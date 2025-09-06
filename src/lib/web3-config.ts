import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  trustWallet, 
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'viem';
import { arbitrum } from 'wagmi/chains';

// Get project ID from environment variables or use a default one for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f5a2f12b7b96c78f1a47e8ae2c5ce9a';

// Define Arbitrum Sepolia chain
export const arbitrumSepolia = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
    public: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
  testnet: true,
} as const;

// Explicitly define chains to avoid any local network conflicts
const productionChains = [
  arbitrum,
  arbitrumSepolia,
] as const;

const appName = import.meta.env.VITE_APP_NAME || 'Fylaro Finternet Finance';

export const config = getDefaultConfig({
  appName,
  projectId,
  chains: productionChains,
  ssr: false,
  transports: {
    [421614]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [42161]: http('https://arb1.arbitrum.io/rpc'),
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        trustWallet,
        rainbowWallet,
      ]
    },
    {
      groupName: 'Other Options',
      wallets: [
        coinbaseWallet,
        walletConnectWallet,
      ]
    }
  ]
});

// Chain configurations for easy access
export const supportedChains = {
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://arb1.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
    testnet: false,
  },
  arbitrumSepolia: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
    },
    testnet: true,
  },
} as const;

// Default chain for the application (Arbitrum Sepolia)
export const defaultChain = arbitrumSepolia;
