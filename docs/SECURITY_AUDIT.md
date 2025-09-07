# Security and Audit Documentation

## Overview

Security is paramount in the Fylaro Finance platform, given its handling of financial assets and sensitive user data. This document outlines the comprehensive security measures implemented across all layers of the application.

## Smart Contract Security

### Access Control

The platform implements role-based access control using OpenZeppelin's AccessControl contract:

```solidity
// Role definitions
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant VERIFIED_ISSUER_ROLE = keccak256("VERIFIED_ISSUER_ROLE");
bytes32 public constant PAYMENT_TRACKER_ROLE = keccak256("PAYMENT_TRACKER_ROLE");
bytes32 public constant CREDIT_ANALYST_ROLE = keccak256("CREDIT_ANALYST_ROLE");
bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

// Role assignments are managed through multi-signature wallet
function grantRole(bytes32 role, address account) public override onlyRole(getRoleAdmin(role)) {
    require(account != address(0), "Cannot grant role to zero address");
    _grantRole(role, account);
}
```

### Reentrancy Protection

All external calls and state-changing functions are protected using OpenZeppelin's ReentrancyGuard:

```solidity
function investInInvoice(uint256 tokenId, uint256 amount)
    external
    payable
    nonReentrant
    whenNotPaused
{
    require(amount > 0, "Investment amount must be greater than zero");
    require(msg.value == amount, "Sent value must match investment amount");

    // State changes before external calls
    _updateInvestmentState(tokenId, amount, msg.sender);

    // External call (if any) comes after state changes
    _processInvestment(tokenId, amount, msg.sender);
}
```

### Input Validation

Comprehensive input validation prevents malicious data:

```solidity
modifier validTokenId(uint256 tokenId) {
    require(tokenId > 0 && tokenId <= _tokenIdCounter, "Invalid token ID");
    _;
}

modifier validAmount(uint256 amount) {
    require(amount > 0, "Amount must be greater than zero");
    require(amount <= MAX_AMOUNT, "Amount exceeds maximum limit");
    _;
}

modifier validDueDate(uint256 dueDate) {
    require(dueDate > block.timestamp, "Due date must be in the future");
    require(dueDate <= block.timestamp + MAX_INVOICE_DURATION, "Due date too far in future");
    _;
}
```

### Emergency Controls

Emergency pause functionality for critical situations:

```solidity
contract EmergencyPausable is Pausable, AccessControl {
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

    function emergencyPause() external onlyRole(PAUSE_ROLE) {
        _pause();
        emit EmergencyPauseActivated(msg.sender, block.timestamp);
    }

    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can unpause");
        _unpause();
        emit EmergencyPauseDeactivated(msg.sender, block.timestamp);
    }
}
```

### Integer Overflow Protection

Using OpenZeppelin's SafeMath for arithmetic operations:

```solidity
using SafeMath for uint256;

function calculateReturns(uint256 investment, uint256 yield)
    public
    pure
    returns (uint256)
{
    return investment.add(investment.mul(yield).div(10000));
}
```

## Backend Security

### Authentication and Authorization

JWT-based authentication with role-based authorization:

```javascript
// JWT middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Role-based authorization
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
```

### Input Sanitization

Comprehensive input validation using express-validator:

```javascript
const { body, validationResult } = require("express-validator");

const validateInvoiceUpload = [
  body("invoiceNumber")
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Z0-9-]+$/)
    .withMessage("Invalid invoice number format"),
  body("amount")
    .isFloat({ min: 0.01, max: 10000000 })
    .withMessage("Amount must be between 0.01 and 10,000,000"),
  body("dueDate")
    .isISO8601()
    .custom((value) => {
      const dueDate = new Date(value);
      const now = new Date();
      if (dueDate <= now) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

### Rate Limiting

Multi-tier rate limiting to prevent abuse:

```javascript
const rateLimit = require("express-rate-limit");

// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
});

// Authentication rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per window
  skipSuccessfulRequests: true,
  message: "Too many login attempts, please try again later",
});

// Upload rate limit
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: "Upload limit exceeded, please try again later",
});
```

### Data Encryption

Sensitive data encryption using AES-256-GCM:

```javascript
const crypto = require("crypto");

class EncryptionService {
  static encrypt(text, key) {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  }

  static decrypt(encryptedData, key) {
    const algorithm = "aes-256-gcm";
    const decipher = crypto.createDecipher(
      algorithm,
      key,
      Buffer.from(encryptedData.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
```

### SQL Injection Prevention

Using parameterized queries and ORM:

```javascript
// Safe database queries using parameterized statements
const getUserInvoices = async (userId, page, limit) => {
  const query = `
        SELECT id, invoice_number, amount, status, created_at 
        FROM invoices 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
    `;

  const offset = (page - 1) * limit;
  const result = await db.query(query, [userId, limit, offset]);

  return result.rows;
};

// ORM usage with Sequelize
const Invoice = require("../models/Invoice");

const findInvoicesByUser = async (userId, filters) => {
  return await Invoice.findAll({
    where: {
      userId: userId,
      ...filters,
    },
    order: [["createdAt", "DESC"]],
    include: ["user", "investments"],
  });
};
```

## Frontend Security

### XSS Prevention

Content Security Policy headers and input sanitization:

```javascript
// CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' wss: https:;"
  );
  next();
});
```

```typescript
// Input sanitization in React
import DOMPurify from "dompurify";

const SanitizedContent: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};
```

### Wallet Security

Secure wallet integration with proper signature verification:

```typescript
// Secure wallet connection
const useSecureWalletConnection = () => {
  const { signMessage } = useSignMessage();

  const authenticateWallet = async (address: string) => {
    const message = `Authenticate wallet ${address} at ${Date.now()}`;

    try {
      const signature = await signMessage({ message });

      // Verify signature on backend
      const response = await api.post("/auth/wallet", {
        address,
        message,
        signature,
      });

      return response.data;
    } catch (error) {
      throw new Error("Wallet authentication failed");
    }
  };

  return { authenticateWallet };
};
```

### Session Management

Secure session handling with automatic token refresh:

```typescript
// Token management
class TokenManager {
  private static tokenKey = "auth_token";
  private static refreshKey = "refresh_token";

  static setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshKey, refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(this.refreshKey);

    if (!refreshToken) return null;

    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      this.setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  static clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }
}
```

## IPFS Security

### Document Encryption

Client-side encryption before IPFS upload:

```javascript
class SecureIPFSService {
  static async uploadEncryptedDocument(file, userKey) {
    // Generate random encryption key
    const encryptionKey = crypto.randomBytes(32);

    // Encrypt file content
    const fileBuffer = await file.arrayBuffer();
    const encryptedContent = this.encryptBuffer(fileBuffer, encryptionKey);

    // Upload encrypted content to IPFS
    const ipfsHash = await this.uploadToIPFS(encryptedContent);

    // Encrypt the encryption key with user's key
    const encryptedKey = this.encryptKey(encryptionKey, userKey);

    return {
      ipfsHash,
      encryptedKey,
      originalName: file.name,
      mimeType: file.type,
    };
  }

  static async downloadAndDecryptDocument(ipfsHash, encryptedKey, userKey) {
    // Download encrypted content from IPFS
    const encryptedContent = await this.downloadFromIPFS(ipfsHash);

    // Decrypt the encryption key
    const encryptionKey = this.decryptKey(encryptedKey, userKey);

    // Decrypt file content
    const decryptedContent = this.decryptBuffer(
      encryptedContent,
      encryptionKey
    );

    return decryptedContent;
  }
}
```

### Access Control

Time-limited access tokens for IPFS content:

```javascript
class IPFSAccessControl {
  static generateAccessToken(ipfsHash, userId, expirationHours = 24) {
    const payload = {
      ipfsHash,
      userId,
      exp: Math.floor(Date.now() / 1000) + expirationHours * 3600,
    };

    return jwt.sign(payload, process.env.IPFS_ACCESS_SECRET);
  }

  static validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.IPFS_ACCESS_SECRET);

      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Access token expired");
      }

      return decoded;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }
}
```

## Monitoring and Alerting

### Security Event Logging

Comprehensive logging of security-relevant events:

```javascript
const winston = require("winston");

const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/security.log" }),
    new winston.transports.Console(),
  ],
});

class SecurityMonitor {
  static logAuthenticationAttempt(success, email, ip, userAgent) {
    securityLogger.info("Authentication attempt", {
      event: "auth_attempt",
      success,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  static logSuspiciousActivity(activity, userId, details) {
    securityLogger.warn("Suspicious activity detected", {
      event: "suspicious_activity",
      activity,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  static logSmartContractInteraction(
    contractAddress,
    functionName,
    userId,
    params
  ) {
    securityLogger.info("Smart contract interaction", {
      event: "contract_interaction",
      contractAddress,
      functionName,
      userId,
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Real-time Threat Detection

Automated threat detection and response:

```javascript
class ThreatDetector {
  static async detectAnomalousActivity(userId, activity) {
    const recentActivity = await this.getRecentActivity(userId, 1); // Last hour

    // Check for unusual patterns
    const patterns = [
      this.checkRapidTransactions(recentActivity),
      this.checkLargeAmounts(activity),
      this.checkUnusualTimes(activity),
      this.checkGeolocation(activity),
    ];

    const threatLevel = this.calculateThreatLevel(patterns);

    if (threatLevel > 0.7) {
      await this.triggerSecurityAlert(userId, activity, threatLevel);
    }

    return threatLevel;
  }

  static async triggerSecurityAlert(userId, activity, threatLevel) {
    // Temporarily freeze account if high threat
    if (threatLevel > 0.9) {
      await this.freezeAccount(userId);
    }

    // Send notification to security team
    await this.notifySecurityTeam({
      userId,
      activity,
      threatLevel,
      timestamp: new Date().toISOString(),
    });

    // Log security incident
    SecurityMonitor.logSuspiciousActivity("high_threat_detected", userId, {
      threatLevel,
      activity,
    });
  }
}
```

## Audit Trail

### Transaction Auditing

Complete audit trail for all financial transactions:

```solidity
contract AuditTrail {
    struct AuditEntry {
        uint256 timestamp;
        address actor;
        string action;
        uint256 amount;
        address targetContract;
        bytes32 transactionHash;
        string metadata;
    }

    mapping(uint256 => AuditEntry) public auditEntries;
    uint256 public auditCounter;

    event AuditEntryCreated(
        uint256 indexed entryId,
        address indexed actor,
        string action,
        uint256 amount
    );

    function createAuditEntry(
        address actor,
        string memory action,
        uint256 amount,
        address targetContract,
        string memory metadata
    ) external onlyRole(AUDIT_ROLE) {
        auditCounter++;

        auditEntries[auditCounter] = AuditEntry({
            timestamp: block.timestamp,
            actor: actor,
            action: action,
            amount: amount,
            targetContract: targetContract,
            transactionHash: keccak256(abi.encodePacked(block.timestamp, actor, action)),
            metadata: metadata
        });

        emit AuditEntryCreated(auditCounter, actor, action, amount);
    }
}
```

## Security Testing

### Automated Security Scanning

Continuous security scanning with multiple tools:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Slither static analysis
        uses: crytic/slither-action@v0.1.1
        with:
          node-version: 18

      - name: Run MythX security analysis
        run: |
          npm install -g mythx-cli
          mythx analyze contracts/
```

### Manual Security Testing

Systematic manual security testing procedures:

1. **Smart Contract Testing**

   - Reentrancy attack simulation
   - Integer overflow/underflow testing
   - Access control verification
   - Gas limit and gas cost analysis

2. **API Security Testing**

   - SQL injection attempts
   - XSS payload testing
   - Authentication bypass attempts
   - Rate limiting verification

3. **Frontend Security Testing**
   - CSP header verification
   - Local storage security
   - Session management testing
   - Wallet integration security

## Incident Response

### Security Incident Response Plan

Structured approach to security incidents:

```javascript
class IncidentResponseSystem {
  static async handleSecurityIncident(incidentType, severity, details) {
    const incident = {
      id: this.generateIncidentId(),
      type: incidentType,
      severity,
      details,
      timestamp: new Date().toISOString(),
      status: "open",
    };

    // Immediate response based on severity
    if (severity === "critical") {
      await this.executeCriticalResponse(incident);
    } else if (severity === "high") {
      await this.executeHighSeverityResponse(incident);
    }

    // Log incident
    await this.logIncident(incident);

    // Notify stakeholders
    await this.notifyStakeholders(incident);

    return incident;
  }

  static async executeCriticalResponse(incident) {
    // Immediately pause all smart contracts
    await this.pauseAllContracts();

    // Freeze all user accounts
    await this.freezeAllAccounts();

    // Alert security team immediately
    await this.alertSecurityTeam(incident, "CRITICAL");

    // Prepare public communication
    await this.preparePublicStatement(incident);
  }
}
```

This comprehensive security documentation ensures that all aspects of the Fylaro Finance platform are thoroughly protected against potential threats and vulnerabilities.
