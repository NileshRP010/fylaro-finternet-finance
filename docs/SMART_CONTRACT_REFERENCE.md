# Smart Contract Reference

## Overview

The Fylaro Finance smart contract ecosystem consists of 10 interconnected contracts deployed on Arbitrum Sepolia testnet. Each contract serves a specific purpose in the invoice tokenization and trading infrastructure.

## Contract Addresses

All contracts are deployed on Arbitrum Sepolia (Chain ID: 421614):

| Contract          | Address                                      | Purpose                        |
| ----------------- | -------------------------------------------- | ------------------------------ |
| FylaroDeployer    | `0xA017b9211eCaf0acB9746179fD239E34E0C47B8c` | Main factory and orchestration |
| InvoiceToken      | `0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3` | ERC-1155 invoice tokenization  |
| Marketplace       | `0x1478380b06BB0497305ac1F416c9b6207492e17f` | Trading and order matching     |
| Settlement        | `0xB4F8AE7eB2bCc9F36979b113179e24016eaDAa81` | Payment settlement system      |
| PaymentTracker    | `0xEb93737095142Ccd381AEfd4C2D6ac26dDf64510` | Payment monitoring             |
| CreditScoring     | `0x195B9955240efc8c3942e894Ce27b77a43b82182` | Credit assessment              |
| RiskAssessment    | `0xdF2dFca56d0243BAaD855144CAfB20F112ad829b` | Risk evaluation                |
| UnifiedLedger     | `0x167691366329bAC1bBB13EB8e81d3F593F370Fd2` | Centralized ledger             |
| LiquidityPool     | `0x3006b0Bb5204E54d2A7AB930Ef048aC9Cbd67006` | Liquidity provision            |
| FinternentGateway | `0x0f940213D9fF8464dc5947a8662978B9BDD69916` | Finternet integration          |

## Core Contracts

### InvoiceToken.sol

The core contract handling invoice tokenization using ERC-1155 standard.

#### Key Functions

```solidity
function mintInvoice(
    string memory invoiceNumber,
    uint256 totalAmount,
    uint256 dueDate,
    string memory ipfsHash,
    address issuer
) external onlyVerifiedIssuer returns (uint256)
```

Mints a new invoice token with fractional ownership capabilities.

**Parameters:**

- `invoiceNumber`: Unique identifier for the invoice
- `totalAmount`: Total invoice value in wei
- `dueDate`: Unix timestamp of payment due date
- `ipfsHash`: IPFS hash of encrypted invoice document
- `issuer`: Address of the invoice issuer

**Returns:** Token ID of the newly minted invoice

```solidity
function investInInvoice(
    uint256 tokenId,
    uint256 amount
) external payable nonReentrant
```

Allows investors to purchase fractional ownership of an invoice.

**Parameters:**

- `tokenId`: ID of the invoice token
- `amount`: Number of tokens to purchase

**Requirements:**

- Invoice must be verified
- Payment amount must match token price
- Invoice must not be fully funded

```solidity
function markInvoicePaid(
    uint256 tokenId,
    uint256 actualAmount
) external onlyRole(PAYMENT_TRACKER_ROLE)
```

Marks an invoice as paid and triggers settlement process.

**Parameters:**

- `tokenId`: ID of the paid invoice token
- `actualAmount`: Actual amount received

#### Events

```solidity
event InvoiceMinted(
    uint256 indexed tokenId,
    string invoiceNumber,
    uint256 totalAmount,
    address indexed issuer
);

event InvestmentMade(
    uint256 indexed tokenId,
    address indexed investor,
    uint256 amount,
    uint256 tokensReceived
);

event InvoicePaid(
    uint256 indexed tokenId,
    uint256 actualAmount,
    uint256 settlementAmount
);
```

### Marketplace.sol

Handles secondary trading of invoice tokens with order book functionality.

#### Key Functions

```solidity
function placeBuyOrder(
    uint256 tokenId,
    uint256 price,
    uint256 amount
) external payable nonReentrant
```

Places a buy order for invoice tokens.

**Parameters:**

- `tokenId`: ID of the invoice token
- `price`: Price per token in wei
- `amount`: Number of tokens to buy

```solidity
function placeSellOrder(
    uint256 tokenId,
    uint256 price,
    uint256 amount
) external nonReentrant
```

Places a sell order for invoice tokens.

**Parameters:**

- `tokenId`: ID of the invoice token
- `price`: Price per token in wei
- `amount`: Number of tokens to sell

```solidity
function executeOrder(
    uint256 orderId
) external nonReentrant
```

Executes a matching order from the order book.

**Parameters:**

- `orderId`: ID of the order to execute

#### Order Structure

```solidity
struct Order {
    uint256 id;
    uint256 tokenId;
    address trader;
    OrderType orderType; // BUY or SELL
    uint256 price;
    uint256 amount;
    uint256 filled;
    OrderStatus status; // PENDING, FILLED, CANCELLED
    uint256 timestamp;
}
```

### Settlement.sol

Handles automated payment distribution to token holders.

#### Key Functions

```solidity
function processSettlement(
    uint256 tokenId,
    uint256 totalAmount
) external onlyRole(PAYMENT_TRACKER_ROLE)
```

Processes settlement for a paid invoice, distributing funds to token holders.

**Parameters:**

- `tokenId`: ID of the paid invoice token
- `totalAmount`: Total amount received from invoice payment

```solidity
function claimReturns(
    uint256 tokenId
) external nonReentrant
```

Allows token holders to claim their share of settlement proceeds.

**Parameters:**

- `tokenId`: ID of the settled invoice token

```solidity
function calculateReturn(
    uint256 tokenId,
    address holder
) external view returns (uint256)
```

Calculates the settlement return for a specific token holder.

**Parameters:**

- `tokenId`: ID of the invoice token
- `holder`: Address of the token holder

**Returns:** Amount claimable by the holder

### CreditScoring.sol

Provides on-chain credit scoring functionality.

#### Key Functions

```solidity
function updateCreditScore(
    address entity,
    uint256 paymentHistory,
    uint256 businessStability,
    uint256 industryRisk,
    uint256 financialHealth,
    uint256 collateralValue
) external onlyRole(CREDIT_ANALYST_ROLE)
```

Updates credit score based on five key factors.

**Parameters:**

- `entity`: Address of the entity being scored
- `paymentHistory`: Payment history score (0-100)
- `businessStability`: Business stability score (0-100)
- `industryRisk`: Industry risk assessment (0-100)
- `financialHealth`: Financial health indicator (0-100)
- `collateralValue`: Collateral value score (0-100)

```solidity
function getCreditScore(
    address entity
) external view returns (CreditInfo memory)
```

Retrieves current credit information for an entity.

**Returns:** CreditInfo struct containing score and risk rating

#### Credit Info Structure

```solidity
struct CreditInfo {
    uint256 score;
    string riskRating;
    uint256 paymentHistory;
    uint256 businessStability;
    uint256 industryRisk;
    uint256 financialHealth;
    uint256 collateralValue;
    uint256 lastUpdated;
}
```

### PaymentTracker.sol

Monitors and tracks invoice payments.

#### Key Functions

```solidity
function recordPayment(
    uint256 tokenId,
    uint256 amount,
    string memory paymentReference
) external onlyRole(PAYMENT_MONITOR_ROLE)
```

Records a payment against an invoice.

**Parameters:**

- `tokenId`: ID of the invoice token
- `amount`: Payment amount received
- `paymentReference`: External payment reference

```solidity
function checkPaymentStatus(
    uint256 tokenId
) external view returns (PaymentStatus memory)
```

Checks current payment status of an invoice.

**Returns:** PaymentStatus struct with payment details

#### Payment Status Structure

```solidity
struct PaymentStatus {
    uint256 totalExpected;
    uint256 totalReceived;
    uint256 remainingAmount;
    bool isFullyPaid;
    uint256 lastPaymentDate;
    uint256 daysOverdue;
}
```

## Security Features

### Access Control

All contracts implement role-based access control using OpenZeppelin's AccessControl:

```solidity
bytes32 public constant VERIFIED_ISSUER_ROLE = keccak256("VERIFIED_ISSUER_ROLE");
bytes32 public constant PAYMENT_TRACKER_ROLE = keccak256("PAYMENT_TRACKER_ROLE");
bytes32 public constant CREDIT_ANALYST_ROLE = keccak256("CREDIT_ANALYST_ROLE");
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
```

### Reentrancy Protection

All state-changing functions use OpenZeppelin's ReentrancyGuard:

```solidity
modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}
```

### Input Validation

Comprehensive input validation on all functions:

```solidity
modifier validAmount(uint256 amount) {
    require(amount > 0, "Amount must be greater than zero");
    _;
}

modifier validTokenId(uint256 tokenId) {
    require(tokenId > 0 && tokenId <= _tokenIdCounter, "Invalid token ID");
    _;
}
```

### Emergency Controls

Emergency pause functionality for critical situations:

```solidity
function pause() external onlyRole(ADMIN_ROLE) {
    _pause();
}

function unpause() external onlyRole(ADMIN_ROLE) {
    _unpause();
}
```

## Gas Optimization

### Batch Operations

Support for batch operations to reduce gas costs:

```solidity
function batchInvest(
    uint256[] memory tokenIds,
    uint256[] memory amounts
) external payable nonReentrant
```

### Storage Optimization

Efficient storage packing to minimize gas usage:

```solidity
struct PackedInvoiceData {
    uint128 totalAmount;    // 16 bytes
    uint64 dueDate;         // 8 bytes
    uint32 tokenId;         // 4 bytes
    uint32 timestamp;       // 4 bytes
}                           // Total: 32 bytes (1 storage slot)
```

## Integration Examples

### Frontend Integration

```javascript
// Connect to contract
const invoiceToken = new ethers.Contract(
  "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3",
  InvoiceTokenABI,
  signer
);

// Mint new invoice
const tx = await invoiceToken.mintInvoice(
  "INV-2025-001",
  ethers.utils.parseEther("10000"),
  Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  "QmX7KV9...", // IPFS hash
  issuerAddress
);

// Invest in invoice
const investTx = await invoiceToken.investInInvoice(tokenId, investmentAmount, {
  value: ethers.utils.parseEther("1000"),
});
```

### Backend Integration

```javascript
// Monitor events
invoiceToken.on(
  "InvestmentMade",
  (tokenId, investor, amount, tokensReceived) => {
    console.log(`Investment made in token ${tokenId} by ${investor}`);
    // Update database and notify users
  }
);

// Check payment status
const status = await paymentTracker.checkPaymentStatus(tokenId);
if (status.isFullyPaid) {
  await settlement.processSettlement(tokenId, status.totalReceived);
}
```

## Testing

### Unit Tests

Run comprehensive test suite:

```bash
npx hardhat test test/InvoiceToken.test.js
npx hardhat test test/Marketplace.test.js
npx hardhat test test/Settlement.test.js
```

### Integration Tests

Test contract interactions:

```bash
npx hardhat test test/integration/
```

### Gas Reports

Generate gas usage reports:

```bash
npx hardhat test --gas-report
```

## Deployment

### Local Development

```bash
npx hardhat node
npx hardhat run scripts/deploy-full-ecosystem.js --network localhost
```

### Arbitrum Sepolia

```bash
npx hardhat run scripts/deploy-full-ecosystem.js --network arbitrum-sepolia
```

### Verification

Verify contracts on Arbiscan:

```bash
npx hardhat verify --network arbitrum-sepolia 0xContractAddress "Constructor Args"
```
