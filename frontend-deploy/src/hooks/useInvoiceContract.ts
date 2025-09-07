import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useTransaction } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { invoiceTokenAbi } from '../generated/wagmi';

const INVOICE_TOKEN_ADDRESS = import.meta.env.VITE_INVOICE_TOKEN_ADDRESS;

export const useInvoiceContract = () => {
  const { address } = useAccount();

  // Create Invoice
  const { writeAsync: createInvoice, data: createData } = useContractWrite({
    address: INVOICE_TOKEN_ADDRESS,
    abi: InvoiceTokenABI,
    functionName: 'createInvoice',
  });

  const { isLoading: isCreating } = useWaitForTransaction({
    hash: createData?.hash,
    onSuccess: () => {
      toast.success('Invoice created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create invoice: ' + error.message);
    },
  });

  // List Invoice
  const { writeAsync: listInvoice, data: listData } = useContractWrite({
    address: INVOICE_TOKEN_ADDRESS,
    abi: InvoiceTokenABI,
    functionName: 'listInvoice',
  });

  const { isLoading: isListing } = useWaitForTransaction({
    hash: listData?.hash,
    onSuccess: () => {
      toast.success('Invoice listed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to list invoice: ' + error.message);
    },
  });

  // Buy Invoice
  const { writeAsync: buyInvoice, data: buyData } = useContractWrite({
    address: INVOICE_TOKEN_ADDRESS,
    abi: InvoiceTokenABI,
    functionName: 'buyInvoice',
  });

  const { isLoading: isBuying } = useWaitForTransaction({
    hash: buyData?.hash,
    onSuccess: () => {
      toast.success('Invoice purchased successfully!');
    },
    onError: (error) => {
      toast.error('Failed to buy invoice: ' + error.message);
    },
  });

  // Get Invoice Details
  const useInvoiceDetails = (tokenId: string) => {
    return useContractRead({
      address: INVOICE_TOKEN_ADDRESS,
      abi: InvoiceTokenABI,
      functionName: 'invoices',
      args: [tokenId],
      enabled: Boolean(tokenId),
    });
  };

  // Get User's Invoices
  const useUserInvoices = () => {
    return useQuery({
      queryKey: ['userInvoices', address],
      queryFn: async () => {
        const response = await fetch(`/api/user/invoices`);
        if (!response.ok) throw new Error('Failed to fetch user invoices');
        return response.json();
      },
      enabled: Boolean(address),
    });
  };

  // Get Marketplace Listings
  const useMarketplaceListings = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['marketplaceListings', page, limit],
      queryFn: async () => {
        const response = await fetch(`/api/marketplace/listings?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch marketplace listings');
        return response.json();
      },
    });
  };

  // Contract Actions
  const handleCreateInvoice = async (amount: bigint, dueDate: number, metadata: string) => {
    try {
      const tx = await createInvoice({
        args: [amount, BigInt(dueDate), metadata],
      });
      return tx;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  };

  const handleListInvoice = async (tokenId: bigint, price: bigint) => {
    try {
      const tx = await listInvoice({
        args: [tokenId, price],
      });
      return tx;
    } catch (error) {
      console.error('Error listing invoice:', error);
      throw error;
    }
  };

  const handleBuyInvoice = async (tokenId: bigint, price: bigint) => {
    try {
      const tx = await buyInvoice({
        args: [tokenId],
        value: price,
      });
      return tx;
    } catch (error) {
      console.error('Error buying invoice:', error);
      throw error;
    }
  };

  return {
    handleCreateInvoice,
    handleListInvoice,
    handleBuyInvoice,
    useInvoiceDetails,
    useUserInvoices,
    useMarketplaceListings,
    isCreating,
    isListing,
    isBuying,
  };
};

export default useInvoiceContract;
