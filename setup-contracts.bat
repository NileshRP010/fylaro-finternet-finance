@echo off

REM Install core dependencies
call npm install --save-dev @wagmi/cli viem@latest wagmi@latest @wagmi/core@latest

REM Install Hardhat and related packages
call npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox@3 @nomicfoundation/hardhat-ethers@3 @nomicfoundation/hardhat-verify

REM Generate contract types
cd contracts
call npx wagmi generate

REM Build contracts
call npx hardhat compile

REM Copy ABI to frontend
if not exist ..\src\generated mkdir ..\src\generated
copy artifacts\contracts\InvoiceToken.sol\InvoiceToken.json ..\src\generated\

REM Install frontend dependencies
cd ..
call npm install @tanstack/react-query sonner
