const { ethers } = require("hardhat");
const { verifyContract } = require("../utils/verify.cjs");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log(
    "🚀 Starting full Fylaro ecosystem deployment to Arbitrum Sepolia..."
  );
  console.log("=".repeat(70));

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  if (parseFloat(ethers.formatEther(balance)) < 0.1) {
    console.warn(
      "⚠️  Low balance detected. You might need more ETH for gas fees."
    );
  }

  console.log("\n" + "=".repeat(70));

  // Define deployment configuration
  const config = {
    feeRecipient: deployer.address, // Using deployer as fee recipient
    feeCollector: deployer.address, // Using deployer as fee collector
    treasuryWallet: deployer.address, // Using deployer as treasury
    // For testnet, we'll use a mock stablecoin address or deploy a simple one
    // In production, this would be USDC/USDT address on Arbitrum
    stablecoin: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Mock USDC on Arbitrum Sepolia
  };

  const deployedContracts = {};
  const gasLimit = 5000000; // Arbitrum-specific gas limit

  try {
    // Step 1: Deploy contracts with no dependencies
    console.log("\n📦 PHASE 1: Deploying base contracts...");

    // 1.1 Deploy CreditScoring (no dependencies)
    console.log("\n🔍 Deploying CreditScoring...");
    const CreditScoring = await ethers.getContractFactory("CreditScoring");
    const creditScoring = await CreditScoring.deploy({ gasLimit });
    await creditScoring.waitForDeployment();
    deployedContracts.creditScoring = await creditScoring.getAddress();
    console.log(
      `✅ CreditScoring deployed to: ${deployedContracts.creditScoring}`
    );

    // 1.2 Deploy InvoiceToken (no dependencies for deployment, only feeRecipient)
    console.log("\n📄 Deploying InvoiceToken...");
    const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
    const invoiceToken = await InvoiceToken.deploy(config.feeRecipient, {
      gasLimit,
    });
    await invoiceToken.waitForDeployment();
    deployedContracts.invoiceToken = await invoiceToken.getAddress();
    console.log(
      `✅ InvoiceToken deployed to: ${deployedContracts.invoiceToken}`
    );

    // Wait for confirmations
    console.log("\n⏳ Waiting for block confirmations...");
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    // Step 2: Deploy contracts that depend on base contracts
    console.log("\n📦 PHASE 2: Deploying dependent contracts...");

    // 2.1 Deploy FinternentGateway
    console.log("\n🌐 Deploying FinternentGateway...");
    const FinternentGateway = await ethers.getContractFactory(
      "FinternentGateway"
    );
    const finternentGateway = await FinternentGateway.deploy(
      config.stablecoin,
      { gasLimit }
    );
    await finternentGateway.waitForDeployment();
    deployedContracts.finternentGateway = await finternentGateway.getAddress();
    console.log(
      `✅ FinternentGateway deployed to: ${deployedContracts.finternentGateway}`
    );

    // 2.2 Deploy Marketplace (actual contract name is InvoiceMarketplace)
    console.log("\n🏪 Deploying InvoiceMarketplace...");
    const Marketplace = await ethers.getContractFactory("InvoiceMarketplace");
    const marketplace = await Marketplace.deploy(
      deployedContracts.invoiceToken,
      { gasLimit }
    );
    await marketplace.waitForDeployment();
    deployedContracts.marketplace = await marketplace.getAddress();
    console.log(
      `✅ InvoiceMarketplace deployed to: ${deployedContracts.marketplace}`
    );

    // 2.3 Deploy Settlement
    console.log("\n💰 Deploying Settlement...");
    const Settlement = await ethers.getContractFactory("Settlement");
    const settlement = await Settlement.deploy(deployedContracts.invoiceToken, {
      gasLimit,
    });
    await settlement.waitForDeployment();
    deployedContracts.settlement = await settlement.getAddress();
    console.log(`✅ Settlement deployed to: ${deployedContracts.settlement}`);

    // 2.4 Deploy PaymentTracker
    console.log("\n💳 Deploying PaymentTracker...");
    const PaymentTracker = await ethers.getContractFactory("PaymentTracker");
    const paymentTracker = await PaymentTracker.deploy(
      deployedContracts.invoiceToken,
      config.feeCollector,
      { gasLimit }
    );
    await paymentTracker.waitForDeployment();
    deployedContracts.paymentTracker = await paymentTracker.getAddress();
    console.log(
      `✅ PaymentTracker deployed to: ${deployedContracts.paymentTracker}`
    );

    // 2.5 Deploy RiskAssessment
    console.log("\n⚡ Deploying RiskAssessment...");
    const RiskAssessment = await ethers.getContractFactory("RiskAssessment");
    const riskAssessment = await RiskAssessment.deploy(
      deployedContracts.invoiceToken,
      deployedContracts.creditScoring,
      { gasLimit }
    );
    await riskAssessment.waitForDeployment();
    deployedContracts.riskAssessment = await riskAssessment.getAddress();
    console.log(
      `✅ RiskAssessment deployed to: ${deployedContracts.riskAssessment}`
    );

    // 2.6 Deploy UnifiedLedger
    console.log("\n📊 Deploying UnifiedLedger...");
    const UnifiedLedger = await ethers.getContractFactory("UnifiedLedger");
    const unifiedLedger = await UnifiedLedger.deploy(
      deployedContracts.invoiceToken,
      deployedContracts.creditScoring,
      { gasLimit }
    );
    await unifiedLedger.waitForDeployment();
    deployedContracts.unifiedLedger = await unifiedLedger.getAddress();
    console.log(
      `✅ UnifiedLedger deployed to: ${deployedContracts.unifiedLedger}`
    );

    // 2.7 Deploy LiquidityPool
    console.log("\n🏦 Deploying LiquidityPool...");
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    const liquidityPool = await LiquidityPool.deploy(
      config.stablecoin,
      deployedContracts.invoiceToken,
      deployedContracts.creditScoring,
      config.feeRecipient,
      { gasLimit }
    );
    await liquidityPool.waitForDeployment();
    deployedContracts.liquidityPool = await liquidityPool.getAddress();
    console.log(
      `✅ LiquidityPool deployed to: ${deployedContracts.liquidityPool}`
    );

    // 2.8 Deploy FylaroDeployer (master contract)
    console.log("\n🏗️  Deploying FylaroDeployer...");
    const FylaroDeployer = await ethers.getContractFactory("FylaroDeployer");
    const fylaroDeployer = await FylaroDeployer.deploy(
      config.stablecoin,
      config.feeCollector,
      config.treasuryWallet,
      { gasLimit }
    );
    await fylaroDeployer.waitForDeployment();
    deployedContracts.fylaroDeployer = await fylaroDeployer.getAddress();
    console.log(
      `✅ FylaroDeployer deployed to: ${deployedContracts.fylaroDeployer}`
    );

    console.log("\n⏳ Waiting for final block confirmations...");
    await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 15 seconds

    // Step 3: Initialize contracts
    console.log("\n📦 PHASE 3: Initializing contracts...");

    // Initialize InvoiceToken
    console.log("\n🔧 Initializing InvoiceToken...");
    const addVerifiedIssuerTx = await invoiceToken.addVerifiedIssuer(
      deployer.address
    );
    await addVerifiedIssuerTx.wait(2);
    console.log("✅ Added deployer as verified issuer");

    const updatePlatformFeeTx = await invoiceToken.updatePlatformFee(250); // 2.5%
    await updatePlatformFeeTx.wait(2);
    console.log("✅ Updated platform fee to 2.5%");

    const updateVerificationFeeTx = await invoiceToken.updateVerificationFee(
      ethers.parseEther("0.001") // 0.001 ETH on Arbitrum
    );
    await updateVerificationFeeTx.wait(2);
    console.log("✅ Updated verification fee");

    // Get current gas price and block info
    const currentBlock = await ethers.provider.getBlockNumber();
    let gasPriceInfo = "N/A";
    try {
      const gasPrice = await ethers.provider.getFeeData();
      gasPriceInfo = `${ethers.formatUnits(
        gasPrice.gasPrice || 0n,
        "gwei"
      )} gwei`;
    } catch (e) {
      console.log("Could not get gas price");
    }

    // Step 4: Display deployment summary
    console.log("\n" + "=".repeat(70));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(70));
    console.log(`📍 Network: Arbitrum Sepolia Testnet`);
    console.log(`⛽ Gas Price: ${gasPriceInfo}`);
    console.log(`📦 Block Number: ${currentBlock}`);
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`💰 Fee Recipient: ${config.feeRecipient}`);
    console.log(`🏛️  Treasury: ${config.treasuryWallet}`);
    console.log(`💵 Stablecoin (Mock): ${config.stablecoin}`);

    console.log("\n📋 DEPLOYED CONTRACTS:");
    console.log("-".repeat(70));
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`${name.padEnd(20)}: ${address}`);
    });

    // Step 5: Save deployment info
    const deploymentInfo = {
      network: "arbitrum-sepolia",
      chainId: 421614,
      deployer: deployer.address,
      blockNumber: currentBlock,
      timestamp: new Date().toISOString(),
      gasPrice: gasPriceInfo,
      configuration: config,
      contracts: deployedContracts,
    };

    const deploymentPath = path.join(
      process.cwd(),
      "deployments/arbitrum-sepolia-full.json"
    );
    const deploymentDir = path.dirname(deploymentPath);
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true });
    }

    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Full deployment info saved to: ${deploymentPath}`);

    // Step 6: Contract verification (optional)
    console.log("\n📋 Contract verification skipped (API key needed)");
    console.log(
      "💡 To verify contracts later, add your Arbiscan API key to .env"
    );

    console.log("\n🎯 NEXT STEPS:");
    console.log("1. 🔐 Update your .env file with the new contract addresses");
    console.log("2. 🌐 Update your frontend to use these contract addresses");
    console.log("3. 🧪 Test the contracts on Arbitrum Sepolia testnet");
    console.log("4. 📄 Verify contracts on Arbiscan (optional)");

    console.log(
      "\n✨ Your Fylaro Finternet ecosystem is now live on Arbitrum Sepolia! ✨"
    );
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);

    console.log("\n📋 Partially deployed contracts:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`${name}: ${address}`);
    });

    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
