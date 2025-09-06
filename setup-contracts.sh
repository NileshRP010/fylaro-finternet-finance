#!/bin/bash

# Install core dependencies
npm install --save-dev @wagmi/cli viem@latest wagmi@latest @wagmi/core@latest

# Install Hardhat and related packages
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox@3 @nomicfoundation/hardhat-ethers@3 @nomicfoundation/hardhat-verify

# Generate contract types
cd contracts
npx wagmi generate

# Build contracts
npx hardhat compile

# Copy ABI to frontend
mkdir -p ../src/generated
cp artifacts/contracts/InvoiceToken.sol/InvoiceToken.json ../src/generated/

# Install frontend dependencies
cd ..
npm install @tanstack/react-query sonner
