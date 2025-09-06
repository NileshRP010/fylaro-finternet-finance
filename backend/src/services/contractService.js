const ethers = require('ethers');
const { getContractAddresses } = require('../utils/contractAddresses');

class ContractService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC_URL);
    this.initializeContracts();
  }

  async initializeContracts() {
    try {
      const addresses = await getContractAddresses();
      
      // Initialize contract instances
      this.invoiceToken = new ethers.Contract(
        addresses.invoiceToken,
        require('../abis/InvoiceToken.json'),
        this.provider
      );

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }

  setupEventListeners() {
    this.invoiceToken.on('InvoiceCreated', async (tokenId, issuer, amount, event) => {
      try {
        // Handle new invoice creation
        await this.handleNewInvoice(tokenId, issuer, amount);
      } catch (error) {
        console.error('Error handling InvoiceCreated event:', error);
      }
    });

    this.invoiceToken.on('InvoiceTraded', async (tokenId, from, to, price, event) => {
      try {
        // Handle invoice trading
        await this.handleInvoiceTrade(tokenId, from, to, price);
      } catch (error) {
        console.error('Error handling InvoiceTraded event:', error);
      }
    });
  }

  async handleNewInvoice(tokenId, issuer, amount) {
    // TODO: Implement invoice creation handling
    console.log('New invoice created:', { tokenId, issuer, amount });
  }

  async handleInvoiceTrade(tokenId, from, to, price) {
    // TODO: Implement invoice trade handling
    console.log('Invoice traded:', { tokenId, from, to, price });
  }

  // Contract interaction methods
  async createInvoice(data, signer) {
    const contract = this.invoiceToken.connect(signer);
    return await contract.createInvoice(
      data.amount,
      data.dueDate,
      data.metadata,
      { gasLimit: 500000 }
    );
  }

  async getInvoiceDetails(tokenId) {
    return await this.invoiceToken.invoices(tokenId);
  }

  async verifyInvoice(tokenId, signer) {
    const contract = this.invoiceToken.connect(signer);
    return await contract.verifyInvoice(tokenId, { gasLimit: 200000 });
  }

  async listInvoice(tokenId, price, signer) {
    const contract = this.invoiceToken.connect(signer);
    return await contract.listInvoice(tokenId, price, { gasLimit: 200000 });
  }

  async buyInvoice(tokenId, signer) {
    const contract = this.invoiceToken.connect(signer);
    const listing = await contract.listings(tokenId);
    return await contract.buyInvoice(tokenId, { 
      value: listing.price,
      gasLimit: 300000 
    });
  }
}

module.exports = new ContractService();
