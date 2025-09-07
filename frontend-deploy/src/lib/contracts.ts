import { Contract } from '@ethersproject/contracts';
import { getProvider } from './web3-config';

// Contract ABIs
import InvoiceTokenABI from '../../artifacts/contracts/InvoiceToken.sol/InvoiceToken.json';
import CreditScoringABI from '../../artifacts/contracts/CreditScoring.sol/CreditScoring.json';
import RiskAssessmentABI from '../../artifacts/contracts/RiskAssessment.sol/RiskAssessment.json';
import LiquidityPoolABI from '../../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json';
import PaymentTrackerABI from '../../artifacts/contracts/PaymentTracker.sol/PaymentTracker.json';
import SettlementABI from '../../artifacts/contracts/Settlement.sol/Settlement.json';
import MarketplaceABI from '../../artifacts/contracts/Marketplace.sol/Marketplace.json';
import UnifiedLedgerABI from '../../artifacts/contracts/UnifiedLedger.sol/UnifiedLedger.json';
import FinternentGatewayABI from '../../artifacts/contracts/FinternentGateway.sol/FinternentGateway.json';

// Contract addresses - these will be populated after deployment
export const CONTRACT_ADDRESSES = {
  // Arbitrum Mainnet
  42161: {
    InvoiceToken: '',
    CreditScoring: '',
    RiskAssessment: '',
    LiquidityPool: '',
    PaymentTracker: '',
    Settlement: '',
    Marketplace: '',
    UnifiedLedger: '',
    FinternentGateway: ''
  },
  // Arbitrum Sepolia
  421614: {
    InvoiceToken: '',
    CreditScoring: '',
    RiskAssessment: '',
    LiquidityPool: '',
    PaymentTracker: '',
    Settlement: '',
    Marketplace: '',
    UnifiedLedger: '',
    FinternentGateway: ''
  }
};

// Contract factories
export const getContracts = (chainId: number) => {
  const provider = getProvider(chainId);
  const addresses = CONTRACT_ADDRESSES[chainId];

  if (!addresses) {
    throw new Error(`No contract addresses found for chain ID ${chainId}`);
  }

  return {
    invoiceToken: new Contract(addresses.InvoiceToken, InvoiceTokenABI.abi, provider),
    creditScoring: new Contract(addresses.CreditScoring, CreditScoringABI.abi, provider),
    riskAssessment: new Contract(addresses.RiskAssessment, RiskAssessmentABI.abi, provider),
    liquidityPool: new Contract(addresses.LiquidityPool, LiquidityPoolABI.abi, provider),
    paymentTracker: new Contract(addresses.PaymentTracker, PaymentTrackerABI.abi, provider),
    settlement: new Contract(addresses.Settlement, SettlementABI.abi, provider),
    marketplace: new Contract(addresses.Marketplace, MarketplaceABI.abi, provider),
    unifiedLedger: new Contract(addresses.UnifiedLedger, UnifiedLedgerABI.abi, provider),
    finternentGateway: new Contract(addresses.FinternentGateway, FinternentGatewayABI.abi, provider)
  };
};

// Hook for interacting with contracts
export const useContracts = () => {
  const { chainId } = useWeb3React();
  return getContracts(chainId);
};

// Helper functions for common contract interactions
export const contractHelpers = {
  // Invoice Token functions
  async mintInvoiceToken(signer: any, to: string, tokenId: string, amount: number) {
    const contracts = getContracts(await signer.getChainId());
    const invoiceToken = contracts.invoiceToken.connect(signer);
    return invoiceToken.mint(to, tokenId, amount);
  },

  // Credit Scoring functions
  async getCreditScore(address: string, chainId: number) {
    const contracts = getContracts(chainId);
    return contracts.creditScoring.getScore(address);
  },

  // Risk Assessment functions
  async assessRisk(signer: any, invoiceId: string) {
    const contracts = getContracts(await signer.getChainId());
    const riskAssessment = contracts.riskAssessment.connect(signer);
    return riskAssessment.assessInvoiceRisk(invoiceId);
  },

  // Liquidity Pool functions
  async depositLiquidity(signer: any, amount: string) {
    const contracts = getContracts(await signer.getChainId());
    const liquidityPool = contracts.liquidityPool.connect(signer);
    return liquidityPool.deposit({ value: amount });
  },

  // Payment Tracker functions
  async trackPayment(signer: any, invoiceId: string, amount: string) {
    const contracts = getContracts(await signer.getChainId());
    const paymentTracker = contracts.paymentTracker.connect(signer);
    return paymentTracker.recordPayment(invoiceId, amount);
  },

  // Settlement functions
  async settleInvoice(signer: any, invoiceId: string) {
    const contracts = getContracts(await signer.getChainId());
    const settlement = contracts.settlement.connect(signer);
    return settlement.settleInvoice(invoiceId);
  },

  // Marketplace functions
  async listInvoice(signer: any, invoiceId: string, price: string) {
    const contracts = getContracts(await signer.getChainId());
    const marketplace = contracts.marketplace.connect(signer);
    return marketplace.createListing(invoiceId, price);
  },

  // UnifiedLedger functions
  async getInvoiceDetails(invoiceId: string, chainId: number) {
    const contracts = getContracts(chainId);
    return contracts.unifiedLedger.getInvoiceDetails(invoiceId);
  },

  // FinternentGateway functions
  async processInvoice(signer: any, invoiceData: any) {
    const contracts = getContracts(await signer.getChainId());
    const gateway = contracts.finternentGateway.connect(signer);
    return gateway.processInvoice(invoiceData);
  }
};

// Event listeners
export const setupContractListeners = (chainId: number, callbacks: any) => {
  const contracts = getContracts(chainId);

  // InvoiceToken events
  contracts.invoiceToken.on('Transfer', callbacks.onTransfer);
  
  // Marketplace events
  contracts.marketplace.on('ListingCreated', callbacks.onListingCreated);
  contracts.marketplace.on('ListingSold', callbacks.onListingSold);
  
  // PaymentTracker events
  contracts.paymentTracker.on('PaymentRecorded', callbacks.onPaymentRecorded);
  
  // Settlement events
  contracts.settlement.on('InvoiceSettled', callbacks.onInvoiceSettled);

  return () => {
    contracts.invoiceToken.removeAllListeners();
    contracts.marketplace.removeAllListeners();
    contracts.paymentTracker.removeAllListeners();
    contracts.settlement.removeAllListeners();
  };
};
