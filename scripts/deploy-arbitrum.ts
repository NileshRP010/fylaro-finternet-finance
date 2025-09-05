import { ethers } from "hardhat";
import { verifyContract } from "../utils/verify";

async function main() {
  console.log("Starting deployment to Arbitrum Sepolia...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Check balance
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  // Deploy InvoiceToken
  console.log("\nDeploying InvoiceToken...");
  const uri = "https://api.fylaro.com/metadata/{id}";
  const feeRecipient = "0xF0bB47E1BDdF7c8ca1bC3e84a84741898D51BF38"; // Your fee recipient address

  const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
  const invoiceToken = await InvoiceToken.deploy(uri, feeRecipient, {
    gasLimit: 5000000, // Arbitrum-specific gas limit
  });

  console.log("Waiting for InvoiceToken deployment...");
  await invoiceToken.deployed();
  console.log(`InvoiceToken deployed to: ${invoiceToken.address}`);

  // Wait for some L2 blocks for better state finality
  console.log("\nWaiting for block confirmations...");
  await invoiceToken.deployTransaction.wait(5);

  // Verify contract on Arbiscan
  console.log("\nVerifying contract on Arbiscan...");
  try {
    await verifyContract(invoiceToken.address, [uri, feeRecipient]);
    console.log("Contract verification successful");
  } catch (error) {
    console.log("Contract verification failed:", error);
  }

  // Initialize contract
  console.log("\nInitializing contract...");
  
  // Add deployer as verified issuer
  const verifyTx = await invoiceToken.addVerifiedIssuer(deployer.address);
  await verifyTx.wait(2);
  console.log("Added deployer as verified issuer");

  // Set reasonable platform fees
  const platformFeeTx = await invoiceToken.updatePlatformFee(250); // 2.5%
  await platformFeeTx.wait(2);
  console.log("Updated platform fee to 2.5%");

  // Set verification fee
  const verificationFeeTx = await invoiceToken.updateVerificationFee(
    ethers.utils.parseEther("0.001") // 0.001 ETH on Arbitrum
  );
  await verificationFeeTx.wait(2);
  console.log("Updated verification fee");

  // Log deployment info
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`Network: Arbitrum Sepolia`);
  console.log(`InvoiceToken: ${invoiceToken.address}`);
  console.log(`Fee Recipient: ${feeRecipient}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
  console.log(`Gas Price: ${ethers.utils.formatUnits(await ethers.provider.getGasPrice(), "gwei")} gwei`);
  
  // Save deployment info
  const deploymentInfo = {
    network: "arbitrum-sepolia",
    chainId: 421614,
    invoiceToken: invoiceToken.address,
    feeRecipient: feeRecipient,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString()
  };

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "../deployments/arbitrum-sepolia.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
