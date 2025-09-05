import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';
import { 
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

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
  arbitrumSepolia,
  mainnet,
] as const;

export const config = getDefaultConfig({
  appName: import.meta.env.VITE_APP_NAME || 'Fylaro Finternet Finance',
  projectId,
  chains: productionChains,
  ssr: false,
  batch: {
    multicall: true,
  },
  transports: {
    [421614]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [1]: http(),
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        trustWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
});

// Chain configurations for easy access
export const supportedChains = {
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
