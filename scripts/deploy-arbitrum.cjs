const { ethers } = require("hardhat");
const { verifyContract } = require("../utils/verify.cjs");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment to Arbitrum Sepolia...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Deploy InvoiceToken
  console.log("\nDeploying InvoiceToken...");
  const feeRecipient = "0xF0bB47E1BDdF7c8ca1bC3e84a84741898D51BF38"; // Your fee recipient address

  const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
  const invoiceToken = await InvoiceToken.deploy(feeRecipient, {
    gasLimit: 5000000, // Arbitrum-specific gas limit
  });

  console.log("Waiting for InvoiceToken deployment...");
  await invoiceToken.waitForDeployment();
  const invoiceTokenAddress = await invoiceToken.getAddress();
  console.log(`InvoiceToken deployed to: ${invoiceTokenAddress}`);

  // Wait for some L2 blocks for better state finality
  console.log("\nWaiting for block confirmations...");
  await invoiceToken.deploymentTransaction()?.wait(5);

  // Verify contract on Arbiscan (skipped - need valid API key)
  console.log("\nSkipping contract verification (API key needed)...");
  // try {
  //   await verifyContract(invoiceTokenAddress, [feeRecipient]);
  //   console.log("Contract verification successful");
  // } catch (error) {
  //   console.log("Contract verification failed:", error);
  // }

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
    ethers.parseEther("0.001") // 0.001 ETH on Arbitrum
  );
  await verificationFeeTx.wait(2);
  console.log("Updated verification fee");

  // Log deployment info
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`Network: Arbitrum Sepolia`);
  console.log(`InvoiceToken: ${invoiceTokenAddress}`);
  console.log(`Fee Recipient: ${feeRecipient}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);

  try {
    const gasPrice = await ethers.provider.getFeeData();
    console.log(
      `Gas Price: ${ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei")} gwei`
    );
  } catch (e) {
    console.log("Could not get gas price");
  }

  // Save deployment info
  const deploymentInfo = {
    network: "arbitrum-sepolia",
    chainId: 421614,
    invoiceToken: invoiceTokenAddress,
    feeRecipient: feeRecipient,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
  };

  // Write deployment info to file
  const deploymentPath = path.join(
    process.cwd(),
    "deployments/arbitrum-sepolia.json"
  );

  // Create deployments directory if it doesn't exist
  const deploymentDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
