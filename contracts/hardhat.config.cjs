require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "paris"
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: "auto",
      mining: {
        auto: true,
        interval: 0
      }
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 42161,
      gasMultiplier: 1.1,
      gasPrice: "auto",
      timeout: 60000,
      confirmations: 2,
      verify: {
        etherscan: {
          apiKey: process.env.ARBITRUM_EXPLORER_API_KEY
        }
      }
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 421614,
      gasMultiplier: 1.1,
      gasPrice: "auto",
      timeout: 60000,
      confirmations: 1,
      verify: {
        etherscan: {
          apiKey: process.env.ARBITRUM_EXPLORER_API_KEY
        }
      }
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    excludeContracts: [],
    src: "./contracts"
  },
  etherscan: {
    apiKey: {
      arbitrum: process.env.ARBITRUM_EXPLORER_API_KEY || "",
      arbitrumSepolia: process.env.ARBITRUM_EXPLORER_API_KEY || ""
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io"
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./deploy",
    deployments: "./deployments"
  },
  mocha: {
    timeout: 40000
  }
};
