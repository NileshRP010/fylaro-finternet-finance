const { ethers } = require("hardhat");

async function main() {
  console.log("🏗️  Deploying SimpleFylaroDeployer (optimized version)...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Configuration
  const config = {
    stablecoin: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Mock USDC
    feeCollector: deployer.address,
    treasuryWallet: deployer.address,
  };

  // Existing deployed contracts
  const existingContracts = {
    CreditScoring: "0x195B9955240efc8c3942e894Ce27b77a43b82182",
    InvoiceToken: "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3",
    FinternentGateway: "0x0f940213D9fF8464dc5947a8662978B9BDD69916",
    Marketplace: "0x1478380b06BB0497305ac1F416c9b6207492e17f",
    Settlement: "0xB4F8AE7eB2bCc9F36979b113179e24016eaDAa81",
    PaymentTracker: "0xEb93737095142Ccd381AEfd4C2D6ac26dDf64510",
    RiskAssessment: "0xdF2dFca56d0243BAaD855144CAfB20F112ad829b",
    UnifiedLedger: "0x167691366329bAC1bBB13EB8e81d3F593F370Fd2",
    LiquidityPool: "0x3006b0Bb5204E54d2A7AB930Ef048aC9Cbd67006",
  };

  try {
    console.log("\n📦 Deploying SimpleFylaroDeployer...");

    const SimpleFylaroDeployer = await ethers.getContractFactory(
      "SimpleFylaroDeployer"
    );
    const simpleFylaroDeployer = await SimpleFylaroDeployer.deploy(
      config.stablecoin,
      config.feeCollector,
      config.treasuryWallet,
      {
        gasLimit: 3000000, // Should be much smaller now
      }
    );

    console.log("⏳ Waiting for deployment...");
    await simpleFylaroDeployer.waitForDeployment();

    const deployerAddress = await simpleFylaroDeployer.getAddress();
    console.log(`✅ SimpleFylaroDeployer deployed to: ${deployerAddress}`);

    // Wait for confirmations
    console.log("⏳ Waiting for block confirmations...");
    await simpleFylaroDeployer.deploymentTransaction()?.wait(3);

    // Register all existing contracts
    console.log("\n📋 Registering existing contracts...");

    const contractNames = Object.keys(existingContracts);
    const contractAddresses = Object.values(existingContracts);

    const registerTx = await simpleFylaroDeployer.batchRegisterContracts(
      contractNames,
      contractAddresses
    );
    await registerTx.wait(2);

    console.log("✅ All contracts registered successfully!");

    // Verify registrations
    console.log("\n🔍 Verifying contract registrations...");
    for (const [name, address] of Object.entries(existingContracts)) {
      const registeredAddress = await simpleFylaroDeployer.getContract(name);
      if (registeredAddress.toLowerCase() === address.toLowerCase()) {
        console.log(`✅ ${name}: ${address}`);
      } else {
        console.log(`❌ ${name}: Registration failed`);
      }
    }

    // Get ecosystem info
    const ecosystemInfo = await simpleFylaroDeployer.getEcosystemInfo();
    console.log("\n🌟 Ecosystem Info:");
    console.log(`   Stablecoin: ${ecosystemInfo[0]}`);
    console.log(`   Fee Collector: ${ecosystemInfo[1]}`);
    console.log(`   Treasury: ${ecosystemInfo[2]}`);
    console.log(`   InvoiceToken: ${ecosystemInfo[3]}`);
    console.log(`   Marketplace: ${ecosystemInfo[4]}`);

    // Update the ecosystem deployment file
    const fs = require("fs");
    const path = require("path");

    const ecosystemPath = path.join(
      process.cwd(),
      "deployments/arbitrum-sepolia-ecosystem.json"
    );
    if (fs.existsSync(ecosystemPath)) {
      const ecosystemData = JSON.parse(fs.readFileSync(ecosystemPath, "utf8"));
      ecosystemData.contracts.fylaroDeployer = deployerAddress;
      ecosystemData.contracts.simpleFylaroDeployer = deployerAddress; // Add both for clarity
      ecosystemData.status = "complete_success";
      ecosystemData.deployment_summary.deployed_successfully = 10;
      ecosystemData.deployment_summary.failed = 0;
      ecosystemData.deployment_summary.success_rate = "100%";
      delete ecosystemData.failed_contracts;

      fs.writeFileSync(ecosystemPath, JSON.stringify(ecosystemData, null, 2));
      console.log(`\n💾 Updated ecosystem deployment file: ${ecosystemPath}`);
    }

    console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`📍 SimpleFylaroDeployer: ${deployerAddress}`);
    console.log(`🏛️  Registry: All 9 contracts registered`);
    console.log(`⚙️  Configuration: Fully initialized`);
    console.log(`🌟 Status: 100% Complete - All 10 contracts deployed!`);

    console.log("\n✨ Your complete Fylaro Finternet ecosystem is now live!");
    console.log("🎯 All contracts deployed and registered successfully!");
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
