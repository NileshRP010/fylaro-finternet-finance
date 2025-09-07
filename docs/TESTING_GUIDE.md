# Testing Guide

## Overview

This document provides comprehensive testing strategies and procedures for the Fylaro Finance platform, covering unit tests, integration tests, end-to-end tests, and smart contract testing.

## Testing Strategy

### Testing Pyramid

The testing approach follows the testing pyramid principle:

1. **Unit Tests (70%)** - Test individual functions and components
2. **Integration Tests (20%)** - Test interactions between components
3. **End-to-End Tests (10%)** - Test complete user workflows

### Test Categories

- **Smart Contract Tests** - Solidity contract testing with Hardhat
- **Backend API Tests** - Express.js API endpoint testing
- **Frontend Component Tests** - React component testing
- **Integration Tests** - Cross-system integration testing
- **Performance Tests** - Load and stress testing
- **Security Tests** - Vulnerability and penetration testing

## Smart Contract Testing

### Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai

# Hardhat configuration for testing
# hardhat.config.js
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: process.env.ARBITRUM_MAINNET_RPC_URL,
        blockNumber: 150000000
      }
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20
  }
};
```

### InvoiceToken Contract Tests

```javascript
// test/InvoiceToken.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceToken", function () {
  let invoiceToken;
  let owner, issuer, investor1, investor2;
  let mockIPFSHash = "QmTest123...";

  beforeEach(async function () {
    [owner, issuer, investor1, investor2] = await ethers.getSigners();

    const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
    invoiceToken = await InvoiceToken.deploy(
      owner.address, // fee recipient
      250, // 2.5% platform fee
      ethers.utils.parseEther("0.001") // verification fee
    );

    await invoiceToken.deployed();

    // Grant issuer role
    const VERIFIED_ISSUER_ROLE = await invoiceToken.VERIFIED_ISSUER_ROLE();
    await invoiceToken.grantRole(VERIFIED_ISSUER_ROLE, issuer.address);
  });

  describe("Invoice Minting", function () {
    it("Should mint a new invoice token", async function () {
      const invoiceNumber = "INV-2025-001";
      const totalAmount = ethers.utils.parseEther("10000");
      const dueDate = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days

      await expect(
        invoiceToken
          .connect(issuer)
          .mintInvoice(
            invoiceNumber,
            totalAmount,
            dueDate,
            mockIPFSHash,
            issuer.address
          )
      )
        .to.emit(invoiceToken, "InvoiceMinted")
        .withArgs(1, invoiceNumber, totalAmount, issuer.address);

      const invoice = await invoiceToken.getInvoice(1);
      expect(invoice.invoiceNumber).to.equal(invoiceNumber);
      expect(invoice.totalAmount).to.equal(totalAmount);
      expect(invoice.status).to.equal(0); // PENDING
    });

    it("Should reject minting from non-verified issuer", async function () {
      await expect(
        invoiceToken
          .connect(investor1)
          .mintInvoice(
            "INV-2025-001",
            ethers.utils.parseEther("10000"),
            Math.floor(Date.now() / 1000) + 86400 * 30,
            mockIPFSHash,
            investor1.address
          )
      ).to.be.revertedWith("AccessControl: account is missing role");
    });

    it("Should reject invalid due date", async function () {
      const pastDate = Math.floor(Date.now() / 1000) - 86400; // Yesterday

      await expect(
        invoiceToken
          .connect(issuer)
          .mintInvoice(
            "INV-2025-001",
            ethers.utils.parseEther("10000"),
            pastDate,
            mockIPFSHash,
            issuer.address
          )
      ).to.be.revertedWith("Due date must be in the future");
    });
  });

  describe("Investment", function () {
    let tokenId;

    beforeEach(async function () {
      // Mint and verify an invoice
      await invoiceToken
        .connect(issuer)
        .mintInvoice(
          "INV-2025-001",
          ethers.utils.parseEther("10000"),
          Math.floor(Date.now() / 1000) + 86400 * 30,
          mockIPFSHash,
          issuer.address
        );
      tokenId = 1;

      // Verify the invoice
      await invoiceToken.verifyInvoice(tokenId);
    });

    it("Should allow investment in verified invoice", async function () {
      const investmentAmount = ethers.utils.parseEther("1000");

      await expect(
        invoiceToken
          .connect(investor1)
          .investInInvoice(tokenId, investmentAmount, {
            value: investmentAmount,
          })
      )
        .to.emit(invoiceToken, "InvestmentMade")
        .withArgs(
          tokenId,
          investor1.address,
          investmentAmount,
          investmentAmount
        );

      const balance = await invoiceToken.balanceOf(investor1.address, tokenId);
      expect(balance).to.equal(investmentAmount);
    });

    it("Should calculate correct platform fee", async function () {
      const investmentAmount = ethers.utils.parseEther("1000");
      const expectedFee = investmentAmount.mul(250).div(10000); // 2.5%

      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      await invoiceToken
        .connect(investor1)
        .investInInvoice(tokenId, investmentAmount, {
          value: investmentAmount,
        });

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(expectedFee);
    });

    it("Should reject investment exceeding remaining amount", async function () {
      const totalAmount = ethers.utils.parseEther("10000");
      const excessiveAmount = ethers.utils.parseEther("15000");

      await expect(
        invoiceToken
          .connect(investor1)
          .investInInvoice(tokenId, excessiveAmount, {
            value: excessiveAmount,
          })
      ).to.be.revertedWith("Investment exceeds remaining amount");
    });

    it("Should handle multiple investors correctly", async function () {
      const investment1 = ethers.utils.parseEther("3000");
      const investment2 = ethers.utils.parseEther("2000");

      await invoiceToken
        .connect(investor1)
        .investInInvoice(tokenId, investment1, {
          value: investment1,
        });

      await invoiceToken
        .connect(investor2)
        .investInInvoice(tokenId, investment2, {
          value: investment2,
        });

      const balance1 = await invoiceToken.balanceOf(investor1.address, tokenId);
      const balance2 = await invoiceToken.balanceOf(investor2.address, tokenId);

      expect(balance1).to.equal(investment1);
      expect(balance2).to.equal(investment2);

      const invoice = await invoiceToken.getInvoice(tokenId);
      expect(invoice.amountRaised).to.equal(investment1.add(investment2));
    });
  });

  describe("Payment and Settlement", function () {
    let tokenId;

    beforeEach(async function () {
      // Setup funded invoice
      await invoiceToken
        .connect(issuer)
        .mintInvoice(
          "INV-2025-001",
          ethers.utils.parseEther("10000"),
          Math.floor(Date.now() / 1000) + 86400 * 30,
          mockIPFSHash,
          issuer.address
        );
      tokenId = 1;

      await invoiceToken.verifyInvoice(tokenId);

      // Full funding
      await invoiceToken
        .connect(investor1)
        .investInInvoice(tokenId, ethers.utils.parseEther("10000"), {
          value: ethers.utils.parseEther("10000"),
        });
    });

    it("Should mark invoice as paid and trigger settlement", async function () {
      const actualAmount = ethers.utils.parseEther("10000");

      const PAYMENT_TRACKER_ROLE = await invoiceToken.PAYMENT_TRACKER_ROLE();
      await invoiceToken.grantRole(PAYMENT_TRACKER_ROLE, owner.address);

      await expect(invoiceToken.markInvoicePaid(tokenId, actualAmount))
        .to.emit(invoiceToken, "InvoicePaid")
        .withArgs(tokenId, actualAmount, actualAmount);

      const invoice = await invoiceToken.getInvoice(tokenId);
      expect(invoice.status).to.equal(3); // PAID
    });

    it("Should calculate returns correctly for partial payment", async function () {
      const actualAmount = ethers.utils.parseEther("8000"); // 80% payment

      const PAYMENT_TRACKER_ROLE = await invoiceToken.PAYMENT_TRACKER_ROLE();
      await invoiceToken.grantRole(PAYMENT_TRACKER_ROLE, owner.address);

      await invoiceToken.markInvoicePaid(tokenId, actualAmount);

      const expectedReturn = await invoiceToken.calculateReturn(
        tokenId,
        investor1.address
      );
      const expectedAmount = ethers.utils.parseEther("8000"); // 80% of investment

      expect(expectedReturn).to.equal(expectedAmount);
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to grant roles", async function () {
      const VERIFIED_ISSUER_ROLE = await invoiceToken.VERIFIED_ISSUER_ROLE();

      await invoiceToken.grantRole(VERIFIED_ISSUER_ROLE, investor1.address);

      const hasRole = await invoiceToken.hasRole(
        VERIFIED_ISSUER_ROLE,
        investor1.address
      );
      expect(hasRole).to.be.true;
    });

    it("Should prevent non-admin from granting roles", async function () {
      const VERIFIED_ISSUER_ROLE = await invoiceToken.VERIFIED_ISSUER_ROLE();

      await expect(
        invoiceToken
          .connect(investor1)
          .grantRole(VERIFIED_ISSUER_ROLE, investor2.address)
      ).to.be.revertedWith("AccessControl: account is missing role");
    });
  });

  describe("Emergency Functions", function () {
    it("Should pause and unpause contract", async function () {
      await invoiceToken.pause();
      expect(await invoiceToken.paused()).to.be.true;

      await invoiceToken.unpause();
      expect(await invoiceToken.paused()).to.be.false;
    });

    it("Should prevent operations when paused", async function () {
      await invoiceToken.pause();

      await expect(
        invoiceToken
          .connect(issuer)
          .mintInvoice(
            "INV-2025-001",
            ethers.utils.parseEther("10000"),
            Math.floor(Date.now() / 1000) + 86400 * 30,
            mockIPFSHash,
            issuer.address
          )
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});
```

### Marketplace Contract Tests

```javascript
// test/Marketplace.test.js
describe("Marketplace", function () {
  let marketplace, invoiceToken;
  let owner, trader1, trader2;

  beforeEach(async function () {
    // Deploy and setup contracts
    [owner, trader1, trader2] = await ethers.getSigners();

    // Deploy InvoiceToken first
    const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
    invoiceToken = await InvoiceToken.deploy(
      owner.address,
      250,
      ethers.utils.parseEther("0.001")
    );

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      invoiceToken.address,
      owner.address,
      100
    ); // 1% trading fee

    await marketplace.deployed();
  });

  describe("Order Placement", function () {
    it("Should place buy order successfully", async function () {
      const tokenId = 1;
      const price = ethers.utils.parseEther("1.05");
      const amount = ethers.utils.parseEther("1000");

      await expect(
        marketplace.connect(trader1).placeBuyOrder(tokenId, price, amount, {
          value: price.mul(amount).div(ethers.utils.parseEther("1")),
        })
      ).to.emit(marketplace, "OrderPlaced");

      const order = await marketplace.getOrder(1);
      expect(order.trader).to.equal(trader1.address);
      expect(order.orderType).to.equal(0); // BUY
    });

    it("Should place sell order successfully", async function () {
      // First, trader needs to have tokens
      // ... setup code to give trader1 some tokens ...

      const tokenId = 1;
      const price = ethers.utils.parseEther("1.05");
      const amount = ethers.utils.parseEther("1000");

      await expect(
        marketplace.connect(trader1).placeSellOrder(tokenId, price, amount)
      ).to.emit(marketplace, "OrderPlaced");
    });
  });

  describe("Order Matching", function () {
    it("Should match compatible buy and sell orders", async function () {
      // Setup buy order
      const tokenId = 1;
      const price = ethers.utils.parseEther("1.05");
      const amount = ethers.utils.parseEther("1000");

      await marketplace.connect(trader1).placeBuyOrder(tokenId, price, amount, {
        value: price.mul(amount).div(ethers.utils.parseEther("1")),
      });

      // Setup sell order at same price
      await marketplace.connect(trader2).placeSellOrder(tokenId, price, amount);

      // Execute matching
      await expect(marketplace.executeOrder(1)).to.emit(
        marketplace,
        "OrderExecuted"
      );
    });
  });
});
```

## Backend API Testing

### Test Setup

```javascript
// test/setup.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

beforeAll(async () => {
  // Setup test database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cleanup
  await sequelize.close();
});

module.exports = { request: request(app) };
```

### Authentication Tests

```javascript
// test/auth.test.js
const { request } = require("./setup");

describe("Authentication", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "securePassword123",
        userType: "business",
        companyName: "Test Company",
        walletAddress: "0x742d35Cc2C3c7e3...",
      };

      const response = await request
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it("should reject duplicate email registration", async () => {
      const userData = {
        email: "test@example.com",
        password: "securePassword123",
        userType: "business",
      };

      // First registration
      await request.post("/api/auth/register").send(userData);

      // Duplicate registration
      const response = await request
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("email already exists");
    });

    it("should validate required fields", async () => {
      const response = await request
        .post("/api/auth/register")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create test user
      await request.post("/api/auth/register").send({
        email: "test@example.com",
        password: "securePassword123",
        userType: "business",
        companyName: "Test Company",
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "securePassword123",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const response = await request
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongPassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
```

### Invoice API Tests

```javascript
// test/invoices.test.js
const { request } = require("./setup");
const path = require("path");

describe("Invoice API", () => {
  let authToken;

  beforeEach(async () => {
    // Create and login user
    await request.post("/api/auth/register").send({
      email: "test@example.com",
      password: "securePassword123",
      userType: "business",
      companyName: "Test Company",
    });

    const loginResponse = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "securePassword123",
    });

    authToken = loginResponse.body.data.token;
  });

  describe("POST /api/invoices/upload", () => {
    it("should upload and tokenize invoice", async () => {
      const testFile = path.join(__dirname, "fixtures", "test-invoice.pdf");

      const response = await request
        .post("/api/invoices/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", testFile)
        .field(
          "invoiceData",
          JSON.stringify({
            invoiceNumber: "INV-2025-001",
            amount: "10000.00",
            currency: "USD",
            dueDate: "2025-12-31",
            buyerName: "Client Company",
            description: "Consulting services",
          })
        )
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.invoiceId).toBeDefined();
      expect(response.body.data.tokenId).toBeDefined();
      expect(response.body.data.ipfsHash).toBeDefined();
    });

    it("should validate file type", async () => {
      const testFile = path.join(__dirname, "fixtures", "test.txt");

      const response = await request
        .post("/api/invoices/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", testFile)
        .field(
          "invoiceData",
          JSON.stringify({
            invoiceNumber: "INV-2025-001",
            amount: "10000.00",
          })
        )
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const response = await request.post("/api/invoices/upload").expect(401);

      expect(response.body.error).toContain("Authentication required");
    });
  });

  describe("GET /api/invoices", () => {
    it("should return user invoices with pagination", async () => {
      const response = await request
        .get("/api/invoices?page=1&limit=10")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.invoices).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it("should filter invoices by status", async () => {
      const response = await request
        .get("/api/invoices?status=verified")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
```

## Frontend Component Testing

### React Testing Library Setup

```javascript
// test/test-utils.jsx
import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../src/lib/web3-config";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export const TestProviders = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { wrapper: TestProviders, ...options });
};

export * from "@testing-library/react";
export { renderWithProviders as render };
```

### Component Tests

```javascript
// test/components/InvoiceCard.test.jsx
import { render, screen, fireEvent } from "../test-utils";
import { InvoiceCard } from "../../src/components/features/InvoiceCard";

const mockInvoice = {
  id: "1",
  invoiceNumber: "INV-001",
  amount: "10000.00",
  currency: "USD",
  status: "verified",
  riskRating: "A-",
  creditScore: 85,
  fundingProgress: 75.5,
  daysToMaturity: 30,
  expectedYield: 8.5,
};

describe("InvoiceCard", () => {
  it("renders invoice information correctly", () => {
    render(<InvoiceCard invoice={mockInvoice} />);

    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
    expect(screen.getByText("A-")).toBeInTheDocument();
    expect(screen.getByText("75.5%")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const handleClick = jest.fn();
    render(<InvoiceCard invoice={mockInvoice} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith(mockInvoice);
  });

  it("displays correct status badge", () => {
    render(<InvoiceCard invoice={mockInvoice} />);

    const statusBadge = screen.getByText("Verified");
    expect(statusBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("shows investment button for verified invoices", () => {
    render(<InvoiceCard invoice={mockInvoice} />);

    expect(screen.getByText("Invest Now")).toBeInTheDocument();
  });

  it("disables investment button for fully funded invoices", () => {
    const fullyFundedInvoice = { ...mockInvoice, fundingProgress: 100 };
    render(<InvoiceCard invoice={fullyFundedInvoice} />);

    const button = screen.getByText("Fully Funded");
    expect(button).toBeDisabled();
  });
});
```

### Hook Tests

```javascript
// test/hooks/useInvoiceUpload.test.js
import { renderHook, act, waitFor } from "@testing-library/react";
import { useInvoiceUpload } from "../../src/hooks/useInvoiceUpload";
import { TestProviders } from "../test-utils";

// Mock the contract and services
jest.mock("../../src/services/contractService");
jest.mock("../../src/services/ipfsService");

describe("useInvoiceUpload", () => {
  it("uploads invoice successfully", async () => {
    const { result } = renderHook(() => useInvoiceUpload(), {
      wrapper: TestProviders,
    });

    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const invoiceData = {
      invoiceNumber: "INV-001",
      amount: "10000",
      dueDate: "2025-12-31",
      issuerAddress: "0x123...",
    };

    await act(async () => {
      await result.current.upload(file, invoiceData);
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("handles upload errors correctly", async () => {
    // Mock failure
    const mockContractService = require("../../src/services/contractService");
    mockContractService.mintInvoice.mockRejectedValue(
      new Error("Transaction failed")
    );

    const { result } = renderHook(() => useInvoiceUpload(), {
      wrapper: TestProviders,
    });

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const invoiceData = { invoiceNumber: "INV-001" };

    await act(async () => {
      try {
        await result.current.upload(file, invoiceData);
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBe("Transaction failed");
  });
});
```

## Integration Testing

### API Integration Tests

```javascript
// test/integration/invoice-workflow.test.js
const { request } = require("../setup");

describe("Invoice Workflow Integration", () => {
  let businessToken, investorToken;
  let invoiceId, tokenId;

  beforeAll(async () => {
    // Create business user
    await request.post("/api/auth/register").send({
      email: "business@example.com",
      password: "password123",
      userType: "business",
      companyName: "Test Business",
    });

    const businessLogin = await request.post("/api/auth/login").send({
      email: "business@example.com",
      password: "password123",
    });
    businessToken = businessLogin.body.data.token;

    // Create investor user
    await request.post("/api/auth/register").send({
      email: "investor@example.com",
      password: "password123",
      userType: "investor",
    });

    const investorLogin = await request.post("/api/auth/login").send({
      email: "investor@example.com",
      password: "password123",
    });
    investorToken = investorLogin.body.data.token;
  });

  it("should complete full invoice lifecycle", async () => {
    // 1. Business uploads invoice
    const uploadResponse = await request
      .post("/api/invoices/upload")
      .set("Authorization", `Bearer ${businessToken}`)
      .attach("file", path.join(__dirname, "../fixtures/test-invoice.pdf"))
      .field(
        "invoiceData",
        JSON.stringify({
          invoiceNumber: "INV-2025-001",
          amount: "10000.00",
          currency: "USD",
          dueDate: "2025-12-31",
        })
      )
      .expect(201);

    invoiceId = uploadResponse.body.data.invoiceId;
    tokenId = uploadResponse.body.data.tokenId;

    // 2. Admin verifies invoice
    await request
      .patch(`/api/invoices/${invoiceId}/verify`)
      .set("Authorization", `Bearer ${businessToken}`) // In real scenario, this would be admin token
      .expect(200);

    // 3. Invoice appears in marketplace
    const marketplaceResponse = await request
      .get("/api/marketplace/invoices")
      .expect(200);

    const invoiceInMarketplace = marketplaceResponse.body.data.invoices.find(
      (inv) => inv.id === invoiceId
    );
    expect(invoiceInMarketplace).toBeDefined();

    // 4. Investor makes investment
    const investmentResponse = await request
      .post("/api/marketplace/invest")
      .set("Authorization", `Bearer ${investorToken}`)
      .send({
        invoiceId: invoiceId,
        amount: "5000.00",
        currency: "USD",
      })
      .expect(201);

    expect(investmentResponse.body.data.investmentId).toBeDefined();

    // 5. Check portfolio reflects investment
    const portfolioResponse = await request
      .get("/api/portfolio")
      .set("Authorization", `Bearer ${investorToken}`)
      .expect(200);

    const investment = portfolioResponse.body.data.investments.find(
      (inv) => inv.invoiceId === invoiceId
    );
    expect(investment).toBeDefined();
    expect(investment.amount).toBe("5000.00");
  });
});
```

### Smart Contract Integration Tests

```javascript
// test/integration/contract-integration.test.js
describe("Smart Contract Integration", () => {
  let invoiceToken, marketplace, settlement;
  let owner, issuer, investor;

  beforeEach(async () => {
    [owner, issuer, investor] = await ethers.getSigners();

    // Deploy all contracts
    const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
    invoiceToken = await InvoiceToken.deploy(
      owner.address,
      250,
      ethers.utils.parseEther("0.001")
    );

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      invoiceToken.address,
      owner.address,
      100
    );

    const Settlement = await ethers.getContractFactory("Settlement");
    settlement = await Settlement.deploy(invoiceToken.address);

    // Setup roles and permissions
    const VERIFIED_ISSUER_ROLE = await invoiceToken.VERIFIED_ISSUER_ROLE();
    await invoiceToken.grantRole(VERIFIED_ISSUER_ROLE, issuer.address);

    const PAYMENT_TRACKER_ROLE = await invoiceToken.PAYMENT_TRACKER_ROLE();
    await invoiceToken.grantRole(PAYMENT_TRACKER_ROLE, settlement.address);
  });

  it("should handle complete invoice lifecycle with trading", async () => {
    // 1. Mint invoice
    await invoiceToken
      .connect(issuer)
      .mintInvoice(
        "INV-2025-001",
        ethers.utils.parseEther("10000"),
        Math.floor(Date.now() / 1000) + 86400 * 30,
        "QmTest123...",
        issuer.address
      );

    const tokenId = 1;
    await invoiceToken.verifyInvoice(tokenId);

    // 2. Initial investment
    await invoiceToken
      .connect(investor)
      .investInInvoice(tokenId, ethers.utils.parseEther("5000"), {
        value: ethers.utils.parseEther("5000"),
      });

    // 3. Create sell order in marketplace
    await invoiceToken
      .connect(investor)
      .setApprovalForAll(marketplace.address, true);

    await marketplace.connect(investor).placeSellOrder(
      tokenId,
      ethers.utils.parseEther("1.05"), // 5% premium
      ethers.utils.parseEther("2000")
    );

    // 4. Another investor buys from marketplace
    const [, , , buyer] = await ethers.getSigners();

    await marketplace.connect(buyer).placeBuyOrder(
      tokenId,
      ethers.utils.parseEther("1.05"),
      ethers.utils.parseEther("2000"),
      { value: ethers.utils.parseEther("2100") } // 2000 * 1.05
    );

    // 5. Execute trade
    await marketplace.executeOrder(1);

    // 6. Verify ownership transfer
    const buyerBalance = await invoiceToken.balanceOf(buyer.address, tokenId);
    expect(buyerBalance).to.equal(ethers.utils.parseEther("2000"));

    // 7. Mark invoice as paid
    await settlement.processSettlement(
      tokenId,
      ethers.utils.parseEther("10000")
    );

    // 8. Verify settlement distribution
    const investorReturn = await settlement.calculateReturn(
      tokenId,
      investor.address
    );
    const buyerReturn = await settlement.calculateReturn(
      tokenId,
      buyer.address
    );

    expect(investorReturn).to.be.gt(0);
    expect(buyerReturn).to.be.gt(0);
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Stress test"
  payload:
    path: "test-data.csv"
    fields:
      - "email"
      - "password"

scenarios:
  - name: "Authentication and API calls"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.data.token"
              as: "authToken"
      - get:
          url: "/api/invoices"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - get:
          url: "/api/marketplace/invoices"

  - name: "Marketplace browsing"
    weight: 30
    flow:
      - get:
          url: "/api/marketplace/invoices"
      - get:
          url: "/api/marketplace/invoices/{{ $randomInt(1, 100) }}"
```

```bash
# Run load tests
artillery run artillery-config.yml

# Generate reports
artillery run --output results.json artillery-config.yml
artillery report results.json
```

### Smart Contract Gas Testing

```javascript
// test/gas-optimization.test.js
describe("Gas Optimization Tests", () => {
  it("should measure gas usage for batch operations", async () => {
    const batchSize = 10;
    const amounts = Array(batchSize).fill(ethers.utils.parseEther("1000"));
    const tokenIds = Array(batchSize).fill(1);

    const tx = await invoiceToken.batchInvest(tokenIds, amounts, {
      value: ethers.utils.parseEther("10000"),
    });

    const receipt = await tx.wait();

    console.log(`Batch investment gas used: ${receipt.gasUsed}`);
    console.log(`Gas per investment: ${receipt.gasUsed.div(batchSize)}`);

    // Assert gas usage is within expected limits
    expect(receipt.gasUsed).to.be.lt(ethers.BigNumber.from("2000000"));
  });

  it("should compare gas costs of different approaches", async () => {
    // Individual investments
    let totalGasIndividual = ethers.BigNumber.from(0);

    for (let i = 0; i < 5; i++) {
      const tx = await invoiceToken
        .connect(investor)
        .investInInvoice(1, ethers.utils.parseEther("1000"), {
          value: ethers.utils.parseEther("1000"),
        });
      const receipt = await tx.wait();
      totalGasIndividual = totalGasIndividual.add(receipt.gasUsed);
    }

    // Batch investment
    const batchTx = await invoiceToken.batchInvest(
      [1, 1, 1, 1, 1],
      Array(5).fill(ethers.utils.parseEther("1000")),
      { value: ethers.utils.parseEther("5000") }
    );
    const batchReceipt = await batchTx.wait();

    console.log(`Individual total gas: ${totalGasIndividual}`);
    console.log(`Batch total gas: ${batchReceipt.gasUsed}`);
    console.log(`Gas savings: ${totalGasIndividual.sub(batchReceipt.gasUsed)}`);

    // Batch should be more efficient
    expect(batchReceipt.gasUsed).to.be.lt(totalGasIndividual);
  });
});
```

## Test Automation

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  smart-contract-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Compile contracts
        run: npx hardhat compile

      - name: Run smart contract tests
        run: npx hardhat test
        env:
          REPORT_GAS: true

      - name: Upload gas report
        uses: actions/upload-artifact@v3
        with:
          name: gas-report
          path: gas-report.txt

  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: |
          npm ci
          cd backend && npm ci

      - name: Run backend tests
        run: cd backend && npm test
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: |
          npm ci
          cd frontend-deploy && npm ci

      - name: Run frontend tests
        run: cd frontend-deploy && npm test

      - name: Build frontend
        run: cd frontend-deploy && npm run build

  integration-tests:
    runs-on: ubuntu-latest
    needs: [smart-contract-tests, backend-tests]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Run integration tests
        run: npm run test:integration
```

### Test Coverage

```bash
# Smart contract coverage
npx hardhat coverage

# Backend coverage
cd backend && npm run test:coverage

# Frontend coverage
cd frontend-deploy && npm run test:coverage

# Combined coverage report
npm run coverage:merge
```

This comprehensive testing guide ensures robust quality assurance across all components of the Fylaro Finance platform.
