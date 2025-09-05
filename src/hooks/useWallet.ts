import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { arbitrumSepolia } from '../lib/web3-config';
import { toast } from 'sonner';

export interface WalletState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  isConnecting: boolean;
  error?: string;
}

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
  });

  useEffect(() => {
    setWalletState({
      isConnected,
      address,
      chainId,
      isConnecting,
      error: connectError?.message,
    });
  }, [isConnected, address, chainId, isConnecting, connectError]);

  const connectWallet = async () => {
    try {
      // Get MetaMask connector (most common for Arbitrum)
      const metamaskConnector = connectors.find(
        (connector) => connector.name === 'MetaMask'
      );
      
      if (metamaskConnector) {
        console.log('Connecting with MetaMask...');
        await connect({ connector: metamaskConnector });
        
        // Wait a bit for connection to establish
        setTimeout(async () => {
          // Check if we need to switch to Arbitrum Sepolia
          if (chainId && chainId !== arbitrumSepolia.id) {
            try {
              console.log('Switching to Arbitrum Sepolia from chain:', chainId);
              await switchChain({ chainId: arbitrumSepolia.id });
              toast.success('Switched to Arbitrum Sepolia');
            } catch (switchError) {
              console.error('Switch chain error:', switchError);
              toast.error('Please switch to Arbitrum Sepolia manually in your wallet');
            }
          }
        }, 1000);
        
        toast.success('Wallet connected successfully!');
      } else {
        // Fallback to first available connector
        const firstConnector = connectors[0];
        if (firstConnector) {
          console.log('Connecting with:', firstConnector.name);
          await connect({ connector: firstConnector });
        } else {
          toast.error('No wallet connectors available');
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const switchToArbitrum = async () => {
    try {
      await switchChain({ chainId: arbitrumSepolia.id });
      toast.success('Switched to Arbitrum Sepolia');
    } catch (error) {
      console.error('Failed to switch chain:', error);
      toast.error('Failed to switch to Arbitrum Sepolia');
    }
  };

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isOnArbitrum = chainId === arbitrumSepolia.id;

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToArbitrum,
    formatAddress,
    isOnArbitrum,
    connectors,
  };
};
