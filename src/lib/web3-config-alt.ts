import { createConfig } from 'wagmi';
import { mainnet, arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { http } from 'viem';
import { metaMask, walletConnect, coinbaseWallet, safe } from 'wagmi/connectors';

// Get project ID from environment variables or use a default one for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f5a2f12b7b96c78f1a47e8ae2c5ce9a';

export const config = createConfig({
  chains: [arbitrumSepolia, arbitrum, mainnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Fylaro Finternet Finance',
        url: window.location.origin,
      },
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'Fylaro Finternet Finance',
        description: 'Revolutionary invoice financing marketplace',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`],
      },
    }),
    coinbaseWallet({
      appName: 'Fylaro Finternet Finance',
      appLogoUrl: `${window.location.origin}/favicon.ico`,
    }),
    safe(),
  ],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [mainnet.id]: http(),
  },
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
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://arb1.arbitrum.io/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
  },
} as const;

// Default chain for the application (Arbitrum Sepolia for testing)
export const defaultChain = arbitrumSepolia;

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
