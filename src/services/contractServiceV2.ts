import { parseEther, formatEther, Address } from "viem";
import { toast } from "sonner";
import {
  writeContract,
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "@/lib/web3-config";

// Contract addresses from your deployment
const CONTRACT_ADDRESSES = {
  invoiceToken: "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3" as Address,
  marketplace: "0x1478380b06BB0497305ac1F416c9b6207492e17f" as Address,
  settlement: "0xB4F8AE7eB2bCc9F36979b113179e24016eaDAa81" as Address,
  liquidityPool: "0x3006b0Bb5204E54d2A7AB930Ef048aC9Cbd67006" as Address,
  creditScoring: "0x195B9955240efc8c3942e894Ce27b77a43b82182" as Address,
  riskAssessment: "0xdF2dFca56d0243BAaD855144CAfB20F112ad829b" as Address,
  paymentTracker: "0xEb93737095142Ccd381AEfd4C2D6ac26dDf64510" as Address,
  unifiedLedger: "0x167691366329bAC1bBB13EB8e81d3F593F370Fd2" as Address,
  finternentGateway: "0x0f940213D9fF8464dc5947a8662978B9BDD69916" as Address,
  simpleFylaroDeployer: "0xA017b9211eCaf0acB9746179fD239E34E0C47B8c" as Address,
} as const;

// Simplified ABIs with just the functions we need
const INVOICE_TOKEN_ABI = [
  {
    type: "function",
    name: "tokenizeInvoice",
    inputs: [
      { name: "_invoiceId", type: "string" },
      { name: "_totalValue", type: "uint256" },
      { name: "_totalShares", type: "uint256" },
      { name: "_dueDate", type: "uint256" },
      { name: "_debtor", type: "address" },
      { name: "_ipfsHash", type: "string" },
      { name: "_industry", type: "string" },
      { name: "_riskRating", type: "uint8" },
      { name: "_interestRate", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "addVerifiedIssuer",
    inputs: [{ name: "issuer", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifiedIssuers",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markAsPaid",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getInvoiceDetails",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "dueDate", type: "uint256" },
      { name: "isPaid", type: "bool" },
      { name: "issuer", type: "address" },
      { name: "description", type: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const MARKETPLACE_ABI = [
  {
    type: "function",
    name: "listInvoice",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "purchaseInvoice",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getListingPrice",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isListed",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;

// Invoice data interface
export interface InvoiceData {
  amount: string;
  dueDate: number;
  description: string;
  issuerName: string;
  payerName: string;
  invoiceNumber: string;
}

// Contract service class
class ContractService {
  // Get contract addresses
  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }

  // Create a new invoice token
  async createInvoice(
    invoiceData: InvoiceData,
    userAddress?: Address
  ): Promise<string> {
    try {
      console.log("Creating invoice with data:", invoiceData);

      if (!userAddress) {
        throw new Error("No wallet connected");
      }

      // Check if user is a verified issuer
      const isVerified = await this.isVerifiedIssuer(userAddress);
      if (!isVerified) {
        // Try to auto-add the user as verified issuer (will work if they're the owner)
        console.log(
          "User not verified, attempting to add as verified issuer..."
        );
        try {
          await this.addVerifiedIssuer(userAddress);
          console.log("Successfully added user as verified issuer");
          toast.success("Address verified successfully!");
        } catch (verifyError) {
          console.error("Failed to auto-verify:", verifyError);
          throw new Error(
            "Address not verified as issuer. You need to be added as a verified issuer by the contract owner. If you are the owner, make sure you're using the same address that deployed the contract."
          );
        }
      }

      // Convert amount to Wei
      const amountInWei = parseEther(invoiceData.amount);

      // Convert due date to timestamp if it's a date string
      const dueDateTimestamp =
        typeof invoiceData.dueDate === "string"
          ? Math.floor(new Date(invoiceData.dueDate).getTime() / 1000)
          : BigInt(invoiceData.dueDate);

      // For tokenizeInvoice function parameters:
      const totalShares = BigInt(10000); // Default 10,000 shares for fractional ownership
      const debtorAddress =
        "0x0000000000000000000000000000000000000001" as Address; // Placeholder debtor
      const ipfsHash = ""; // No IPFS hash for now
      const industry = "General"; // Default industry
      const riskRating = 5; // Medium risk rating (1-10 scale)
      const interestRate = BigInt(500); // 5% interest rate in basis points

      // Verification fee (0.01 ETH as required by contract)
      const verificationFee = parseEther("0.01");

      console.log("Contract parameters:", {
        invoiceId: invoiceData.invoiceNumber,
        totalValue: amountInWei.toString(),
        totalShares: totalShares.toString(),
        dueDate: dueDateTimestamp.toString(),
        debtor: debtorAddress,
        ipfsHash,
        industry,
        riskRating,
        interestRate: interestRate.toString(),
        verificationFee: verificationFee.toString(),
      });

      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.invoiceToken,
        abi: INVOICE_TOKEN_ABI,
        functionName: "tokenizeInvoice",
        args: [
          invoiceData.invoiceNumber, // _invoiceId
          amountInWei, // _totalValue
          totalShares, // _totalShares
          BigInt(dueDateTimestamp), // _dueDate
          debtorAddress, // _debtor
          ipfsHash, // _ipfsHash
          industry, // _industry
          riskRating, // _riskRating
          interestRate, // _interestRate
        ],
        // Send verification fee with transaction
        value: verificationFee,
      });

      console.log("Transaction hash:", hash);

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Transaction confirmed:", receipt);

      // Extract token ID from logs (simplified - in production, parse logs properly)
      const tokenId = Date.now().toString(); // Placeholder - should parse from events

      toast.success("Invoice tokenized successfully!");
      return tokenId;
    } catch (error) {
      console.error("Error creating invoice:", error);

      // Check if user cancelled the transaction
      if (error instanceof Error) {
        if (
          error.message.includes("User denied") ||
          error.message.includes("User rejected") ||
          error.message.includes("denied transaction signature") ||
          error.message.includes("User cancelled")
        ) {
          toast.info("Invoice tokenization cancelled by user");
          throw new Error("Transaction cancelled");
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create invoice: ${errorMessage}`);
      throw error;
    }
  }

  // Check if an address is a verified issuer
  async isVerifiedIssuer(address: Address): Promise<boolean> {
    try {
      const result = await readContract(config, {
        address: CONTRACT_ADDRESSES.invoiceToken,
        abi: INVOICE_TOKEN_ABI,
        functionName: "verifiedIssuers",
        args: [address],
      });
      return result as boolean;
    } catch (error) {
      console.error("Error checking verified issuer status:", error);
      return false;
    }
  }

  // Add a verified issuer (owner only function)
  async addVerifiedIssuer(issuerAddress: Address): Promise<string> {
    try {
      console.log(`Adding verified issuer: ${issuerAddress}`);

      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.invoiceToken,
        abi: INVOICE_TOKEN_ABI,
        functionName: "addVerifiedIssuer",
        args: [issuerAddress],
      });

      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Verified issuer added:", receipt);

      toast.success("Verified issuer added successfully!");
      return hash;
    } catch (error) {
      console.error("Error adding verified issuer:", error);

      // Check if user cancelled the transaction
      if (error instanceof Error) {
        if (
          error.message.includes("User denied") ||
          error.message.includes("User rejected") ||
          error.message.includes("denied transaction signature") ||
          error.message.includes("User cancelled")
        ) {
          toast.info("Address verification cancelled by user");
          throw new Error("Transaction cancelled");
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add verified issuer: ${errorMessage}`);
      throw error;
    }
  }

  // List invoice for sale on marketplace
  async listInvoiceForSale(tokenId: string, price: string): Promise<string> {
    try {
      console.log(`Listing invoice ${tokenId} for ${price} ETH`);

      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "listInvoice",
        args: [BigInt(tokenId), parseEther(price)],
      });

      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Listing confirmed:", receipt);

      toast.success("Invoice listed for sale!");
      return hash;
    } catch (error) {
      console.error("Error listing invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to list invoice: ${errorMessage}`);
      throw error;
    }
  }

  // Purchase an invoice from marketplace
  async purchaseInvoice(tokenId: string, price: string): Promise<string> {
    try {
      console.log(`Purchasing invoice ${tokenId} for ${price} ETH`);

      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "purchaseInvoice",
        args: [BigInt(tokenId)],
        value: parseEther(price),
      });

      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Purchase confirmed:", receipt);

      toast.success("Invoice purchased successfully!");
      return hash;
    } catch (error) {
      console.error("Error purchasing invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to purchase invoice: ${errorMessage}`);
      throw error;
    }
  }

  // Mark invoice as paid
  async markInvoiceAsPaid(tokenId: string): Promise<string> {
    try {
      console.log(`Marking invoice ${tokenId} as paid`);

      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.invoiceToken,
        abi: INVOICE_TOKEN_ABI,
        functionName: "markAsPaid",
        args: [BigInt(tokenId)],
      });

      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Payment confirmation:", receipt);

      toast.success("Invoice marked as paid!");
      return hash;
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to mark invoice as paid: ${errorMessage}`);
      throw error;
    }
  }

  // Get user's invoices (simplified - returns mock data for now)
  async getUserInvoices(userAddress: string): Promise<any[]> {
    try {
      console.log(`Getting invoices for user: ${userAddress}`);

      // In a real implementation, you would:
      // 1. Query blockchain events for invoices created by this user
      // 2. Get details for each invoice
      // 3. Check listing status

      // For now, return mock data
      const mockInvoices = [
        {
          tokenId: "1",
          amount: "1.5",
          dueDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          description: "Web development services",
          issuerName: "Tech Solutions Inc",
          payerName: "Acme Corp",
          invoiceNumber: "INV-2025-001",
          isPaid: false,
          isListed: false,
        },
        {
          tokenId: "2",
          amount: "2.8",
          dueDate: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60, // 45 days from now
          description: "Consulting services Q3",
          issuerName: "Business Advisors LLC",
          payerName: "Startup Inc",
          invoiceNumber: "INV-2025-002",
          isPaid: false,
          isListed: true,
          listingPrice: "2.5",
        },
      ];

      return mockInvoices;
    } catch (error) {
      console.error("Error getting user invoices:", error);
      return [];
    }
  }

  // Get marketplace listings (simplified - returns mock data for now)
  async getMarketplaceListings(): Promise<any[]> {
    try {
      console.log("Getting marketplace listings");

      // Mock marketplace data with more comprehensive search examples
      const mockListings = [
        {
          tokenId: "1",
          amount: "10.5",
          dueDate: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60, // 45 days from now
          description: "Web development services for e-commerce platform",
          issuerName: "TechFlow Solutions",
          payerName: "ShopMart Inc",
          invoiceNumber: "INV-2025-001",
          isPaid: false,
          isListed: true,
          listingPrice: "9.8",
          seller: "0x742d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "2",
          amount: "7.25",
          dueDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          description: "Marketing campaign design and implementation",
          issuerName: "Creative Agency Pro",
          payerName: "Startup Ventures LLC",
          invoiceNumber: "INV-2025-002",
          isPaid: false,
          isListed: true,
          listingPrice: "6.9",
          seller: "0x123d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "3",
          amount: "5.0",
          dueDate: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 days from now
          description: "Manufacturing order fulfillment",
          issuerName: "Factory Direct Ltd",
          payerName: "Retail Giant Corp",
          invoiceNumber: "INV-2025-003",
          isPaid: false,
          isListed: true,
          listingPrice: "4.5",
          seller: "0x742d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "4",
          amount: "3.2",
          dueDate: Math.floor(Date.now() / 1000) + 20 * 24 * 60 * 60, // 20 days from now
          description: "Software license renewal",
          issuerName: "SoftwareCo",
          payerName: "Enterprise Solutions",
          invoiceNumber: "INV-2025-004",
          isPaid: false,
          isListed: true,
          listingPrice: "3.0",
          seller: "0x123d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "5",
          amount: "15.75",
          dueDate: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // 90 days from now
          description: "Consulting services for blockchain integration",
          issuerName: "Blockchain Experts Inc",
          payerName: "FinTech Innovations",
          invoiceNumber: "INV-2025-005",
          isPaid: false,
          isListed: true,
          listingPrice: "14.5",
          seller: "0x456d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "6",
          amount: "2.8",
          dueDate: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60, // 15 days from now
          description: "Graphic design for mobile app",
          issuerName: "Design Studio",
          payerName: "Mobile App Co",
          invoiceNumber: "INV-2025-006",
          isPaid: true,
          isListed: false,
          listingPrice: "2.8",
          seller: "0x789d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "7",
          amount: "12.0",
          dueDate: Math.floor(Date.now() / 1000) + 75 * 24 * 60 * 60, // 75 days from now
          description: "Construction materials supply",
          issuerName: "BuildMart Suppliers",
          payerName: "Construction Corp",
          invoiceNumber: "INV-2025-007",
          isPaid: false,
          isListed: true,
          listingPrice: "11.2",
          seller: "0xABCd35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "8",
          amount: "6.5",
          dueDate: Math.floor(Date.now() / 1000) + 35 * 24 * 60 * 60, // 35 days from now
          description: "Legal advisory services",
          issuerName: "Law Firm Partners",
          payerName: "Business Enterprises",
          invoiceNumber: "INV-2025-008",
          isPaid: false,
          isListed: true,
          listingPrice: "6.1",
          seller: "0xDEFd35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "9",
          amount: "4.3",
          dueDate: Math.floor(Date.now() / 1000) + 25 * 24 * 60 * 60, // 25 days from now
          description: "SEO optimization services",
          issuerName: "Digital Marketing Pro",
          payerName: "E-commerce Store",
          invoiceNumber: "INV-2025-009",
          isPaid: false,
          isListed: true,
          listingPrice: "4.0",
          seller: "0x111d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
        {
          tokenId: "10",
          amount: "8.9",
          dueDate: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60, // 50 days from now
          description: "Cloud infrastructure setup",
          issuerName: "CloudTech Solutions",
          payerName: "DataCenter Corp",
          invoiceNumber: "INV-2025-010",
          isPaid: false,
          isListed: true,
          listingPrice: "8.3",
          seller: "0x222d35Cc6634C0532925a3b8D35Cc6634C0532925",
        },
      ];

      return mockListings;
    } catch (error) {
      console.error("Error getting marketplace listings:", error);
      return [];
    }
  }

  // Check if invoice is listed for sale
  async isInvoiceListed(tokenId: string): Promise<boolean> {
    try {
      const isListed = await readContract(config, {
        address: CONTRACT_ADDRESSES.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "isListed",
        args: [BigInt(tokenId)],
      });

      return isListed as boolean;
    } catch (error) {
      console.error("Error checking listing status:", error);
      return false;
    }
  }

  // Get listing price for an invoice
  async getListingPrice(tokenId: string): Promise<string> {
    try {
      const price = await readContract(config, {
        address: CONTRACT_ADDRESSES.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "getListingPrice",
        args: [BigInt(tokenId)],
      });

      return formatEther(price as bigint);
    } catch (error) {
      console.error("Error getting listing price:", error);
      return "0";
    }
  }
}

// Export singleton instance
export const contractService = new ContractService();
export type { InvoiceData };
