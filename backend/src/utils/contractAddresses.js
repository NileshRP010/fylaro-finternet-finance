const fs = require('fs').promises;
const path = require('path');

async function getContractAddresses() {
    try {
        const deploymentPath = path.join(__dirname, '../../../deployments/arbitrum-sepolia.json');
        const deployment = JSON.parse(await fs.readFile(deploymentPath, 'utf8'));
        
        return {
            invoiceToken: deployment.invoiceToken
        };
    } catch (error) {
        console.error('Failed to load contract addresses:', error);
        throw error;
    }
}

module.exports = {
    getContractAddresses
};
