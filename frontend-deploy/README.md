# Fylaro Finance Frontend

A next-generation invoice financing platform frontend built with React, TypeScript, and Vite.

## 🚀 Live Demo

Visit: [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

## 📋 Features

- **Invoice Tokenization**: Convert invoices into ERC-1155 tokens
- **Investment Platform**: Fractional investment in tokenized invoices
- **Real-time Trading**: Advanced order matching and trading system
- **Portfolio Management**: Comprehensive portfolio tracking
- **Wallet Integration**: MetaMask and RainbowKit integration
- **Responsive Design**: Mobile-first responsive UI

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: wagmi + RainbowKit
- **State Management**: Zustand + React Query
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Set these in your deployment platform:

```bash
VITE_API_BASE_URL=https://your-backend-url.com
VITE_WEBSOCKET_URL=wss://your-backend-url.com
VITE_CHAIN_ID=421614
VITE_NETWORK_NAME=arbitrum-sepolia

# Contract Addresses
VITE_INVOICE_TOKEN_ADDRESS=0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3
VITE_MARKETPLACE_ADDRESS=0x1478380b06BB0497305ac1F416c9b6207492e17f
VITE_SETTLEMENT_ADDRESS=0xB4F8AE7eB2bCc9F36979b113179e24016eaDAa81
# ... (add all contract addresses)
```

## 🔧 Configuration

The frontend connects to:

- **Arbitrum Sepolia Testnet** (Chain ID: 421614)
- **Smart Contracts**: 10 deployed contracts for complete ecosystem
- **IPFS**: Pinata for document storage

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## 🔐 Security

- Wallet-based authentication
- Secure smart contract interactions
- CSP headers for XSS protection
- Input validation and sanitization

## 📄 License

MIT License - see LICENSE file for details

---

**Fylaro Finance** - Transforming invoice financing through blockchain technology.
