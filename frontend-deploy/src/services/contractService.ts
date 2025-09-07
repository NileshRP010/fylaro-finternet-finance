import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { arbitrumSepolia } from "@/lib/web3-config";
import {
  createPublicClient,
  createWalletClient,
  http,
  WalletClient,
  PublicClient,
} from "viem";

// Import deployed contract addresses
const CONTRACT_ADDRESSES = {
  invoiceToken: import.meta.env.VITE_INVOICE_TOKEN_ADDRESS,
  marketplace: import.meta.env.VITE_MARKETPLACE_ADDRESS,
  creditScoring: import.meta.env.VITE_CREDIT_SCORING_ADDRESS,
  unifiedLedger: import.meta.env.VITE_UNIFIED_LEDGER_ADDRESS,
  paymentTracker: import.meta.env.VITE_PAYMENT_TRACKER_ADDRESS,
  liquidityPool: import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
  riskAssessment: import.meta.env.VITE_RISK_ASSESSMENT_ADDRESS,
  settlement: import.meta.env.VITE_SETTLEMENT_ADDRESS,
  finternentGateway: import.meta.env.VITE_FINTERNET_GATEWAY_ADDRESS,
  fylaroDeployer: import.meta.env.VITE_FYLARO_DEPLOYER_ADDRESS,
  simpleFylaroDeployer: import.meta.env.VITE_SIMPLE_FYLARO_DEPLOYER_ADDRESS,
} as const;

// Import ABIs
import InvoiceTokenABI from "../../artifacts/contracts/InvoiceToken.sol/InvoiceToken.json";
import MarketplaceABI from "../../artifacts/contracts/Marketplace.sol/InvoiceMarketplace.json";
import CreditScoringABI from "../../artifacts/contracts/CreditScoring.sol/CreditScoring.json";
import UnifiedLedgerABI from "../../artifacts/contracts/UnifiedLedger.sol/UnifiedLedger.json";
import PaymentTrackerABI from "../../artifacts/contracts/PaymentTracker.sol/PaymentTracker.json";
import LiquidityPoolABI from "../../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json";
import RiskAssessmentABI from "../../artifacts/contracts/RiskAssessment.sol/RiskAssessment.json";
import SettlementABI from "../../artifacts/contracts/Settlement.sol/Settlement.json";
import FinternentGatewayABI from "../../artifacts/contracts/FinternentGateway.sol/FinternentGateway.json";
import SimpleFylaroDeployerABI from "../../artifacts/contracts/SimpleFylaroDeployer.sol/SimpleFylaroDeployer.json";

export interface InvoiceData {
  amount: string;
  dueDate: number;
  description: string;
  issuerName: string;
  payerName: string;
  invoiceNumber: string;
}

export interface InvoiceDetails {
  tokenId: string;
  issuer: string;
  amount: string;
  dueDate: number;
  isPaid: boolean;
  isVerified: boolean;
  description: string;
  invoiceNumber: string;
}

export class ContractService {
  private signer: any = null;
  private provider: any = null;

  constructor(signer?: any, provider?: any) {
    this.signer = signer;
    this.provider = provider;
  }

  updateSigner(signer: any, provider?: any) {
    this.signer = signer;
    if (provider) this.provider = provider;
  }

  // Get contract instance
  private getContract(contractName: keyof typeof CONTRACT_ADDRESSES, abi: any) {
    const address = CONTRACT_ADDRESSES[contractName];
    if (!address) {
      throw new Error(`Contract address for ${contractName} not found`);
    }

    if (!this.signer) {
      throw new Error(
        "Signer not available. Please connect your wallet first."
      );
    }

    return new Contract(address, abi.abi, this.signer);
  }

  // Invoice Token Contract Functions
  async createInvoice(invoiceData: InvoiceData): Promise<string> {
    try {
      const contract = this.getContract("invoiceToken", InvoiceTokenABI);

      console.log("Creating invoice with data:", invoiceData);

      // Create metadata string
      const metadata = JSON.stringify({
        description: invoiceData.description,
        issuerName: invoiceData.issuerName,
        payerName: invoiceData.payerName,
        invoiceNumber: invoiceData.invoiceNumber,
        createdAt: Date.now(),
      });

      // Call contract function
      const tx = await contract.createInvoice(
        parseEther(invoiceData.amount),
        invoiceData.dueDate,
        metadata,
        {
          gasLimit: 500000,
        }
      );

      console.log("Transaction sent:", tx.hash);
      toast.loading("Creating invoice on blockchain...", {
        id: "create-invoice",
      });

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Find the InvoiceCreated event to get the token ID
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === "InvoiceCreated";
        } catch {
          return false;
        }
      });

      let tokenId = "";
      if (event) {
        const parsed = contract.interface.parseLog(event);
        tokenId = parsed.args.tokenId.toString();
      }

      toast.success("Invoice created successfully!", { id: "create-invoice" });
      return tokenId;
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      toast.error(`Failed to create invoice: ${error.message}`, {
        id: "create-invoice",
      });
      throw error;
    }
  }

  async getInvoiceDetails(tokenId: string): Promise<InvoiceDetails> {
    try {
      const contract = this.getContract("invoiceToken", InvoiceTokenABI);
      const invoice = await contract.getInvoice(tokenId);

      let metadata = {};
      try {
        metadata = JSON.parse(invoice.metadata);
      } catch {
        metadata = { description: invoice.metadata };
      }

      return {
        tokenId,
        issuer: invoice.issuer,
        amount: formatEther(invoice.totalValue),
        dueDate: Number(invoice.dueDate),
        isPaid: invoice.isPaid,
        isVerified: invoice.isVerified,
        description: (metadata as any).description || "",
        invoiceNumber: (metadata as any).invoiceNumber || "",
      };
    } catch (error: any) {
      console.error("Error getting invoice details:", error);
      throw error;
    }
  }

  async verifyInvoice(tokenId: string): Promise<void> {
    try {
      const contract = this.getContract("invoiceToken", InvoiceTokenABI);

      const tx = await contract.verifyInvoice(tokenId, {
        gasLimit: 200000,
      });

      toast.loading("Verifying invoice...", { id: "verify-invoice" });
      await tx.wait();
      toast.success("Invoice verified successfully!", { id: "verify-invoice" });
    } catch (error: any) {
      console.error("Error verifying invoice:", error);
      toast.error(`Failed to verify invoice: ${error.message}`, {
        id: "verify-invoice",
      });
      throw error;
    }
  }

  // Marketplace Functions
  async listInvoiceForSale(tokenId: string, price: string): Promise<void> {
    try {
      const marketplaceContract = this.getContract(
        "marketplace",
        MarketplaceABI
      );
      const invoiceContract = this.getContract("invoiceToken", InvoiceTokenABI);

      // First approve the marketplace to transfer the token
      const approveTx = await invoiceContract.setApprovalForAll(
        CONTRACT_ADDRESSES.marketplace,
        true,
        { gasLimit: 100000 }
      );

      toast.loading("Approving marketplace...", { id: "list-invoice" });
      await approveTx.wait();

      // List the invoice
      const listTx = await marketplaceContract.listInvoice(
        tokenId,
        parseEther(price),
        { gasLimit: 300000 }
      );

      toast.loading("Listing invoice for sale...", { id: "list-invoice" });
      await listTx.wait();
      toast.success("Invoice listed successfully!", { id: "list-invoice" });
    } catch (error: any) {
      console.error("Error listing invoice:", error);
      toast.error(`Failed to list invoice: ${error.message}`, {
        id: "list-invoice",
      });
      throw error;
    }
  }

  async buyInvoice(tokenId: string, price: string): Promise<void> {
    try {
      const contract = this.getContract("marketplace", MarketplaceABI);

      const tx = await contract.buyInvoice(tokenId, {
        value: parseEther(price),
        gasLimit: 400000,
      });

      toast.loading("Purchasing invoice...", { id: "buy-invoice" });
      await tx.wait();
      toast.success("Invoice purchased successfully!", { id: "buy-invoice" });
    } catch (error: any) {
      console.error("Error buying invoice:", error);
      toast.error(`Failed to buy invoice: ${error.message}`, {
        id: "buy-invoice",
      });
      throw error;
    }
  }

  // Payment Settlement Functions
  async payInvoice(tokenId: string, amount: string): Promise<void> {
    try {
      const contract = this.getContract("settlement", SettlementABI);

      const tx = await contract.depositPayment(tokenId, {
        value: parseEther(amount),
        gasLimit: 300000,
      });

      toast.loading("Processing payment...", { id: "pay-invoice" });
      await tx.wait();
      toast.success("Payment deposited in escrow!", { id: "pay-invoice" });
    } catch (error: any) {
      console.error("Error paying invoice:", error);
      toast.error(`Failed to process payment: ${error.message}`, {
        id: "pay-invoice",
      });
      throw error;
    }
  }

  async releasePayment(tokenId: string): Promise<void> {
    try {
      const contract = this.getContract("settlement", SettlementABI);

      const tx = await contract.releasePayment(tokenId, {
        gasLimit: 300000,
      });

      toast.loading("Releasing payment...", { id: "release-payment" });
      await tx.wait();
      toast.success("Payment released successfully!", {
        id: "release-payment",
      });
    } catch (error: any) {
      console.error("Error releasing payment:", error);
      toast.error(`Failed to release payment: ${error.message}`, {
        id: "release-payment",
      });
      throw error;
    }
  }

  // Credit Scoring Functions
  async getCreditScore(address: string): Promise<number> {
    try {
      const contract = this.getContract("creditScoring", CreditScoringABI);
      const scoreData = await contract.getScore(address);
      return Number(scoreData.score);
    } catch (error: any) {
      console.error("Error getting credit score:", error);
      return 0;
    }
  }

  // Risk Assessment Functions
  async assessInvoiceRisk(tokenId: string): Promise<number> {
    try {
      const contract = this.getContract("riskAssessment", RiskAssessmentABI);
      const riskData = await contract.assessInvoiceRisk(tokenId, {
        gasLimit: 200000,
      });

      const tx = await riskData.wait();

      // Find the risk score from events
      const event = tx.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === "RiskAssessed";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = contract.interface.parseLog(event);
        return Number(parsed.args.riskScore);
      }

      return 50; // Default medium risk
    } catch (error: any) {
      console.error("Error assessing risk:", error);
      return 50;
    }
  }

  // Liquidity Pool Functions
  async depositToLiquidityPool(amount: string): Promise<void> {
    try {
      const contract = this.getContract("liquidityPool", LiquidityPoolABI);

      const tx = await contract.deposit({
        value: parseEther(amount),
        gasLimit: 300000,
      });

      toast.loading("Depositing to liquidity pool...", {
        id: "deposit-liquidity",
      });
      await tx.wait();
      toast.success("Liquidity deposited successfully!", {
        id: "deposit-liquidity",
      });
    } catch (error: any) {
      console.error("Error depositing liquidity:", error);
      toast.error(`Failed to deposit liquidity: ${error.message}`, {
        id: "deposit-liquidity",
      });
      throw error;
    }
  }

  // Utility Functions
  async getUserInvoices(userAddress: string): Promise<InvoiceDetails[]> {
    try {
      const contract = this.getContract("invoiceToken", InvoiceTokenABI);

      // Get user's invoice IDs (this would need to be implemented in the contract)
      // For now, we'll query recent invoices and filter
      const filter = contract.filters.InvoiceCreated(null, userAddress);
      const events = await contract.queryFilter(filter, -10000); // Last 10k blocks

      const invoices: InvoiceDetails[] = [];

      for (const event of events) {
        try {
          const tokenId = event.args?.tokenId?.toString();
          if (tokenId) {
            const details = await this.getInvoiceDetails(tokenId);
            invoices.push(details);
          }
        } catch (error) {
          console.error("Error fetching invoice details:", error);
        }
      }

      return invoices;
    } catch (error: any) {
      console.error("Error getting user invoices:", error);
      return [];
    }
  }

  async getMarketplaceListings(): Promise<any[]> {
    try {
      const contract = this.getContract("marketplace", MarketplaceABI);

      // Get recent listing events
      const filter = contract.filters.InvoiceListed();
      const events = await contract.queryFilter(filter, -10000);

      const listings = [];

      for (const event of events) {
        try {
          const tokenId = event.args?.tokenId?.toString();
          const price = event.args?.price;
          const seller = event.args?.seller;

          if (tokenId && price) {
            const invoiceDetails = await this.getInvoiceDetails(tokenId);
            listings.push({
              ...invoiceDetails,
              price: formatEther(price),
              seller,
            });
          }
        } catch (error) {
          console.error("Error fetching listing details:", error);
        }
      }

      return listings;
    } catch (error: any) {
      console.error("Error getting marketplace listings:", error);
      return [];
    }
  }

  // Contract addresses getter
  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }
}

// Export singleton instance
export const contractService = new ContractService();
