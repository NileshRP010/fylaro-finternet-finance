const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const { authenticateToken } = require('../middleware/auth');

// Get invoice details
router.get('/invoice/:tokenId', async (req, res) => {
    try {
        const details = await contractService.getInvoiceDetails(req.params.tokenId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new invoice
router.post('/invoice', authenticateToken, async (req, res) => {
    try {
        const { amount, dueDate, metadata } = req.body;
        const tx = await contractService.createInvoice({
            amount,
            dueDate,
            metadata
        }, req.user.wallet);
        res.json({ 
            txHash: tx.hash,
            message: 'Invoice creation transaction submitted' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List invoice for sale
router.post('/invoice/:tokenId/list', authenticateToken, async (req, res) => {
    try {
        const { price } = req.body;
        const tx = await contractService.listInvoice(
            req.params.tokenId,
            price,
            req.user.wallet
        );
        res.json({ 
            txHash: tx.hash,
            message: 'Invoice listing transaction submitted' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buy listed invoice
router.post('/invoice/:tokenId/buy', authenticateToken, async (req, res) => {
    try {
        const tx = await contractService.buyInvoice(
            req.params.tokenId,
            req.user.wallet
        );
        res.json({ 
            txHash: tx.hash,
            message: 'Invoice purchase transaction submitted' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify invoice
router.post('/invoice/:tokenId/verify', authenticateToken, async (req, res) => {
    try {
        const tx = await contractService.verifyInvoice(
            req.params.tokenId,
            req.user.wallet
        );
        res.json({ 
            txHash: tx.hash,
            message: 'Invoice verification transaction submitted' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all user's invoices
router.get('/user/invoices', authenticateToken, async (req, res) => {
    try {
        const invoices = await contractService.getUserInvoices(req.user.wallet);
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get marketplace listings
router.get('/marketplace/listings', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const listings = await contractService.getMarketplaceListings(page, limit);
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
