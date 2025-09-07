# Fylaro - Next-Generation Invoice Financing Platform

<div align="center">

<img src="./src/assets/fylaro-logo-icon.png" alt="Fylaro Logo" width="120" height="120">

Fylaro is a revolutionary invoice financing marketplace built on the principles of the Finternet on Arbitrum, leveraging tokenization and the Unified Ledger to connect businesses seeking working capital with global investors.

## Smart Contracts principles

[![Built with](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)](https://reactjs.org/)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Solidity-363636)](https://soliditylang.org/)
[![Network](https://img.shields.io/badge/Network-Arbitrum-orange)](https://arbitrum.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

[Live Demo](https://fylaro-arbitrum.vercel.app/) | [Documentation](./docs/) | [Contributing](#contributing)

</div>

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Fylaro demonstrates the transformative potential of the **Finternet** by creating a unified, interoperable platform for invoice financing. By leveraging the core principles of tokenization, unified ledger technology, and global accessibility, Fylaro bridges traditional finance with next-generation financial infrastructure.

### Mission Statement

To democratize access to invoice financing globally by creating a transparent, efficient, and accessible marketplace where businesses can instantly convert receivables to working capital, and investors can access verified, diversified financial assets on **Arbitrum Ecosystem**.

## Key Features

### For Businesses

- **Invoice Tokenization**: Transform invoices into cryptographically verified ERC-1155 NFTs
- **Automated KYC & Fraud Detection**: Robust AI-powered verification system
- **Fair Credit Scoring**: Transparent rating based on verifiable on-chain and off-chain data
- **Real-time Payment Tracking**: Monitor settlement status with WebSocket notifications
- **Global Investor Access**: Connect with institutional and retail investors worldwide
- **Instant Liquidity**: Get funded in minutes, not weeks

### For Investors

- **Diversified Portfolio**: Invest in verified invoice assets with fractional ownership
- **Risk Assessment Tools**: Comprehensive analytics and AI-powered scoring
- **Secondary Trading**: Trade invoice tokens for liquidity on automated order book
- **Automated Settlement**: Seamless payment processing via smart contracts
- **Real-time Analytics**: Track performance and returns with live dashboards
- **Risk Management**: Advanced diversification and portfolio optimization tools

### Platform Features

- **Unified Ledger**: Cross-border asset transfer and settlement
- **IPFS Storage**: Decentralized, encrypted document storage
- **WebSocket Integration**: Real-time updates and notifications
- **Role-Based Access**: Granular permissions and emergency controls
- **Regulatory Compliance**: Built-in compliance frameworks for multiple jurisdictions

## Architecture

Fylaro follows a modern microservices architecture with clear separation of concerns across frontend, backend, blockchain, and storage layers.

```mermaid
flowchart TD
    %% Styling
    classDef frontend fill:#42b883,color:#000,stroke:#42b883
    classDef api fill:#60a5fa,color:#000,stroke:#60a5fa
    classDef app fill:#f97316,color:#fff,stroke:#f97316
    classDef db fill:#fbbf24,color:#000,stroke:#fbbf24
    classDef bc fill:#8b5cf6,color:#fff,stroke:#8b5cf6
    classDef storage fill:#84cc16,color:#000,stroke:#84cc16
    
    subgraph Frontend["Frontend Layer"]
        direction TB
        F1["React + Wagmi"]:::frontend
        F2["RainbowKit UI"]:::frontend
        F3["WebSocket Client"]:::frontend
    end
    
    subgraph API["API Gateway"]
        direction TB
        G1["Express.js"]:::api
        G2["Auth Middleware"]:::api
        G3["Rate Limiting"]:::api
    end
    
    subgraph App["Application Services"]
        direction TB
        S1["InvoiceService"]:::app
        S2["MarketplaceService"]:::app
        S3["AnalyticsService"]:::app
        S4["SettlementService"]:::app
    end
    
    subgraph DB["Database Layer"]
        direction TB
        D1["MongoDB"]:::db
        D2["PostgreSQL"]:::db
        D3["Redis Cache"]:::db
    end
    
    subgraph BC["Blockchain Layer"]
        direction TB
        B1["Smart Contracts"]:::bc
        B2["Event Listeners"]:::bc
    end
    
    subgraph Storage["Decentralized Storage"]
        direction TB
        ST1["IPFS + Pinata"]:::storage
    end
    
    %% Connections
    F1 --> G1
    F2 --> G1
    F3 --> G1
    
    G1 --> S1
    G1 --> S2
    G1 --> S3
    G1 --> S4
    
    S1 --> D1
    S2 --> D2
    S3 --> D2
    S4 --> D1
    
    S1 --> B1
    S2 --> B1
    S4 --> B1
    
    B1 --> B2
    B2 --> S4
    
    S1 --> ST1
    ST1 --> D1
```

### Core Workflows

1. **Invoice Tokenization Flow**

   - Upload → IPFS Storage → Metadata Extraction → KYC Verification → Token Minting → Marketplace Listing

2. **Investment Flow**

   - Discovery → Due Diligence → Investment → Token Transfer → Payment Tracking → Settlement

3. **Trading Flow**
   - Order Placement → Order Matching → Trade Execution → Settlement → Portfolio Update

## Technology Stack

### Frontend

- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Web3 Integration**: wagmi + RainbowKit + ethers.js/viem
- **State Management**: TanStack Query + React Hook Form
- **Charts & Visualization**: Recharts + Lucide React Icons
- **Real-time Updates**: Socket.io Client

### Backend

- **Runtime**: Node.js + Express.js + TypeScript
- **Authentication**: JWT + Role-based Access Control
- **Database**: MongoDB/PostgreSQL with connection pooling
- **Caching**: Redis for session and data caching
- **Real-time**: Socket.io for WebSocket connections
- **File Storage**: IPFS + Pinata for decentralized storage
- **AI/ML**: Credit scoring and fraud detection algorithms

### Blockchain

- **Network**: Arbitrum One (Mainnet) + Arbitrum Sepolia (Testnet)
- **Smart Contracts**: Solidity ^0.8.19
- **Development**: Hardhat + TypeChain + OpenZeppelin
- **Testing**: Hardhat Tests + Chai + Waffle
- **Deployment**: Hardhat Deploy + Contract Verification

### DevOps & Infrastructure

- **Build Tools**: Vite + ESBuild + SWC
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint + Prettier
- **CI/CD**: GitHub Actions (Ready)
- **Monitoring**: Contract events + API monitoring
- **Documentation**: Markdown + Mermaid diagrams

## Quick Start

### Prerequisites

- Node.js v18+ and npm/yarn
- Git
- MetaMask or compatible Web3 wallet
- Arbitrum testnet ETH (for testing)

### 1. Clone and Setup

```bash
# Clone the repository
git clone
cd fylaro-finternet-finance

# Install dependencies for frontend and backend
npm run setup

# Copy environment variables
cp .env.example .env
# Fill in required values in .env file
```

### 2. Environment Configuration

Create a `.env` file with the following variables:

```env
# Blockchain Configuration
DEPLOYER_PRIVATE_KEY=your_private_key_here
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_EXPLORER_API_KEY=your_arbiscan_api_key

# Backend Configuration
MONGODB_URI=mongodb://localhost:27017/fylaro
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret

# Frontend Configuration
VITE_APP_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Development Mode

```bash
# Start both frontend and backend concurrently
npm run start:dev

# Or start individually
npm run backend:dev  # Backend on http://localhost:3001
npm run dev          # Frontend on http://localhost:8080
```

### 4. Smart Contract Deployment (Optional)

```bash
# Deploy contracts to Arbitrum Sepolia testnet
npm run deploy:contracts:testnet

# Deploy to Arbitrum One mainnet (production)
npm run deploy:contracts:mainnet
```

### 5. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs

## Smart Contracts

Fylaro's smart contract ecosystem is deployed on **Arbitrum Sepolia** testnet with the following verified contracts:

| Contract              | Address                                      | Status      | Purpose                                         |
| --------------------- | -------------------------------------------- | ----------- | ----------------------------------------------- |
| **FylaroDeployer**    | `0xA017b9211eCaf0acB9746179fD239E34E0C47B8c` | ✅ Deployed | Main factory contract for system initialization |
| **InvoiceToken**      | `0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3` | ✅ Deployed | ERC-1155 NFT contract for tokenized invoices    |
| **UnifiedLedger**     | `0x167691366329bAC1bBB13EB8e81d3F593F370Fd2` | ✅ Deployed | Central ledger for all financial records        |
| **Marketplace**       | `0x1478380b06BB0497305ac1F416c9b6207492e17f` | ✅ Deployed | Secondary trading platform for invoice tokens   |
| **LiquidityPool**     | `0x3006b0Bb5204E54d2A7AB930Ef048aC9Cbd67006` | ✅ Deployed | Automated market maker for liquidity provision  |
| **PaymentTracker**    | `0xEb93737095142Ccd381AEfd4C2D6ac26dDf64510` | ✅ Deployed | Real-time payment settlement tracking           |
| **CreditScoring**     | `0x195B9955240efc8c3942e894Ce27b77a43b82182` | ✅ Deployed | AI-powered credit risk assessment               |
| **RiskAssessment**    | `0xdF2dFca56d0243BAaD855144CAfB20F112ad829b` | ✅ Deployed | Comprehensive risk analysis framework           |
| **Settlement**        | `0xB4F8AE7eB2bCc9F36979b113179e24016eaDAa81` | ✅ Deployed | Automated payment settlement system             |
| **FinternentGateway** | `0x0f940213D9fF8464dc5947a8662978B9BDD69916` | ✅ Deployed | Gateway for finternet interoperability          |

**Deployment Success Rate**: 10/10 contracts (100% deployment success)

### Contract Interactions

```typescript
// Example: Tokenizing an Invoice
const invoiceToken = new ethers.Contract(
  INVOICE_TOKEN_ADDRESS,
  InvoiceTokenABI,
  signer
);
const tx = await invoiceToken.tokenizeInvoice(
  invoiceData.ipfsHash,
  invoiceData.amount,
  invoiceData.dueDate,
  invoiceData.buyerAddress
);

// Example: Trading on Marketplace
const marketplace = new ethers.Contract(
  MARKETPLACE_ADDRESS,
  MarketplaceABI,
  signer
);
const listingTx = await marketplace.listInvoice(tokenId, price, {
  value: ethers.utils.parseEther("0.01"), // Listing fee
});
```

## API Endpoints

### Authentication

```
POST /api/auth/login          # Wallet-based authentication
POST /api/auth/refresh        # JWT token refresh
POST /api/auth/logout         # User logout
```

### Invoice Management

```
POST /api/invoices           # Upload new invoice
GET  /api/invoices           # List user's invoices
GET  /api/invoices/:id       # Get invoice details
PUT  /api/invoices/:id       # Update invoice status
```

### Marketplace

```
GET  /api/marketplace        # Browse available investments
POST /api/marketplace/invest # Place investment order
GET  /api/marketplace/orders # Get user's orders
```

### Analytics

```
GET  /api/analytics/portfolio    # Portfolio performance
GET  /api/analytics/market       # Market statistics
GET  /api/analytics/risk         # Risk assessment data
```

## Testing

### Smart Contract Tests

```bash
# Run all contract tests
npm run test:contracts

# Run with coverage
npm run test:contracts:coverage

# Test specific contract
npx hardhat test test/InvoiceToken.test.ts
```

### Frontend Tests

```bash
# Run frontend tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Integration Tests

```bash
# Run full integration test suite
npm run test:integration

# Test specific user flows
npm run test:e2e
```

## Deployment

### Smart Contracts

```bash
# Deploy to Arbitrum Sepolia (testnet)
npm run deploy:testnet

# Deploy to Arbitrum One (mainnet)
npm run deploy:mainnet

# Verify contracts on Arbiscan
npm run verify:contracts
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting platform
npm run deploy
```

### Backend Deployment

```bash
# Build backend
npm run backend:build

# Start production server
npm run backend:start

# Deploy with Docker
docker-compose up -d
```

## Feature Implementation Status

| Feature Category         | Progress | Status             |
| ------------------------ | -------- | ------------------ |
| **Core Infrastructure**  | 100%     | ✅ Complete        |
| **Smart Contracts**      | 100%      | ✅ Deployed (9/10) |
| **Invoice Tokenization** | 95%      | ✅ Functional      |
| **Marketplace Trading**  | 85%      | ✅ Operational     |
| **User Authentication**  | 100%     | ✅ Complete        |
| **Payment Processing**   | 80%      | � In Progress      |
| **Credit Scoring**       | 40%      | ✅ AI-Powered      |
| **Risk Assessment**      | 85%      | ✅ Multi-Factor    |
| **Real-time Analytics**  | In progress      | � Expanding        |
| **Cross-border Support** | In progress     | � Development      |
| **Mobile Optimization**  | 85%      | ✅ Responsive      |
| **API Documentation**    | 90%      | ✅ Comprehensive   |

**Overall Progress**: 80% Complete

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Write comprehensive tests
- Use semantic commit messages
- Update documentation
- Ensure code coverage >80%

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/NileshRP010/fylaro-finternet-finance/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NileshRP010/fylaro-finternet-finance/discussions)
- **Email**: support@fylaro.com

## Acknowledgments

- **Arbitrum** for Layer 2 scaling solution
- **OpenZeppelin** for secure smart contract libraries
- **Pinata** for IPFS infrastructure
- **shadcn/ui** for beautiful UI components
- **The Finternet Initiative** for revolutionizing global finance

---

## Future Fylaro Vision

### Phase 1: Tokenization (Current)

- Invoice tokenization
- Basic marketplace
- Simple cross-border payments

### Phase 2: Interoperability (6-12 months)

- Multi-chain support
- Bank API integrations
- Regulatory compliance automation

### Phase 3: Universal Adoption (1-2 years)

- Central bank digital currency (CBDC) integration
- Traditional bank partnership
- Global regulatory harmonization

### Phase 4: Full Finternet (2-5 years)

- Universal financial identity
- Seamless asset portability
- Regulatory automation
- Global financial inclusion

## Measuring Success

### Traditional Metrics

- **Transaction Volume**: $50M+ processed
- **User Growth**: 10,000+ verified users
- **Global Reach**: 50+ countries
- **Settlement Speed**: <2 minutes average

### Finternet-Specific Metrics

- **Cross-Border Efficiency**: 90% reduction in settlement time
- **Cost Reduction**: 75% lower transaction fees
- **Accessibility**: 10x increase in SME access to capital
- **Regulatory Compliance**: 100% automated compliance checking

## Conclusion

Fylaro demonstrates that the Finternet vision is not just theoretical—it's implementable today with the help of the **Arbitrum Infrastructure**. By focusing on invoice financing as a use case, we show how tokenization, unified ledgers, and global interoperability can transform a traditional financial service into something that serves users better, costs less, and works seamlessly across borders.

The future of finance is not about replacing existing systems but about creating a unified layer that makes all financial services work together as one coherent, global system. Fylaro is a step toward that future with the help of **Arbitrum Ecosystem**.
