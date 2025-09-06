@echo off

cd contracts

REM Install Hardhat and core plugins
call npm install --save-dev hardhat
call npm install --save-dev @nomicfoundation/hardhat-toolbox@3
call npm install --save-dev @nomicfoundation/hardhat-ethers@3
call npm install --save-dev @nomicfoundation/hardhat-verify@1
call npm install --save-dev hardhat-gas-reporter
call npm install --save-dev solidity-coverage
call npm install --save-dev hardhat-deploy

REM Install dependencies
call npm install --save-dev dotenv
call npm install --save-dev typescript
call npm install --save-dev ts-node
call npm install --save-dev @types/node
call npm install --save-dev @types/mocha
call npm install --save-dev @arbitrum/sdk
call npm install --save-dev @openzeppelin/contracts

REM Try compiling
call npx hardhat compile
