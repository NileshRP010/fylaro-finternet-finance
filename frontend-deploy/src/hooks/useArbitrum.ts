import { useCallback } from 'react';
import { ethers } from 'ethers';
import { usePublicClient, useWalletClient } from 'wagmi';
import { arbitrumSepolia } from '../lib/web3-config';

export const useArbitrum = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const getL1Fee = useCallback(async (data: string) => {
    try {
      const gasEstimator = new ethers.Contract(
        "0x000000000000000000000000000000000000006C",
        ["function getL1Fee(bytes) view returns (uint256)"],
        new ethers.providers.JsonRpcProvider(arbitrumSepolia.rpcUrls.default.http[0])
      );

      const l1Fee = await gasEstimator.getL1Fee(data);
      return l1Fee;
    } catch (error) {
      console.error('Error estimating L1 fee:', error);
      return ethers.BigNumber.from(0);
    }
  }, []);

  const getL2GasPrice = useCallback(async () => {
    try {
      const gasPrice = await publicClient.getGasPrice();
      return gasPrice;
    } catch (error) {
      console.error('Error getting L2 gas price:', error);
      return 0n;
    }
  }, [publicClient]);

  const estimateTotalFee = useCallback(async (data: string) => {
    try {
      const [l1Fee, l2GasPrice] = await Promise.all([
        getL1Fee(data),
        getL2GasPrice()
      ]);

      // Estimate L2 gas (example value, adjust based on your contract)
      const estimatedL2Gas = 200000n;
      const l2Fee = l2GasPrice * estimatedL2Gas;

      return {
        l1Fee: ethers.BigNumber.from(l1Fee),
        l2Fee: ethers.BigNumber.from(l2Fee.toString()),
        total: ethers.BigNumber.from(l1Fee).add(ethers.BigNumber.from(l2Fee.toString()))
      };
    } catch (error) {
      console.error('Error estimating total fee:', error);
      return {
        l1Fee: ethers.BigNumber.from(0),
        l2Fee: ethers.BigNumber.from(0),
        total: ethers.BigNumber.from(0)
      };
    }
  }, [getL1Fee, getL2GasPrice]);

  const waitForL1Finality = useCallback(async (l2TxHash: string) => {
    try {
      // Wait for the L2 transaction to be included
      const l2Receipt = await publicClient.waitForTransactionReceipt({ hash: l2TxHash as `0x${string}` });
      
      // Get the L1 block number when it will be finalized (usually after 7 days)
      const finalityBlock = l2Receipt.blockNumber + (60 * 60 * 24 * 7) / 12; // Approx. blocks in 7 days
      
      return {
        l2BlockNumber: l2Receipt.blockNumber,
        finalityBlockNumber: finalityBlock,
        isFinalized: false
      };
    } catch (error) {
      console.error('Error checking L1 finality:', error);
      return null;
    }
  }, [publicClient]);

  return {
    getL1Fee,
    getL2GasPrice,
    estimateTotalFee,
    waitForL1Finality
  };
};
