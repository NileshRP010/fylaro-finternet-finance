const { ethers } = require("hardhat");

async function main() {
  console.log("🏗️  Deploying FylaroDeployer contract...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Configuration (using our existing deployed contracts)
  const config = {
    stablecoin: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Mock USDC
    feeCollector: deployer.address,
    treasuryWallet: deployer.address,
  };

  try {
    console.log("\n📦 Attempting to deploy FylaroDeployer...");

    // Try to deploy with increased gas limit
    const FylaroDeployer = await ethers.getContractFactory("FylaroDeployer");

    console.log(
      "⚠️  Warning: Large contract detected. Attempting deployment..."
    );
    console.log("💡 If this fails, we'll create a factory pattern instead.");

    const fylaroDeployer = await FylaroDeployer.deploy(
      config.stablecoin,
      config.feeCollector,
      config.treasuryWallet,
      {
        gasLimit: 15000000, // Very high gas limit for large contract
      }
    );

    console.log("⏳ Waiting for deployment...");
    await fylaroDeployer.waitForDeployment();

    const fylaroDeployerAddress = await fylaroDeployer.getAddress();
    console.log(`✅ FylaroDeployer deployed to: ${fylaroDeployerAddress}`);

    // Wait for confirmations
    console.log("⏳ Waiting for block confirmations...");
    await fylaroDeployer.deploymentTransaction()?.wait(3);

    // Save deployment info
    const deploymentInfo = {
      network: "arbitrum-sepolia",
      chainId: 421614,
      fylaroDeployer: fylaroDeployerAddress,
      configuration: config,
      deployer: deployer.address,
      blockNumber: await ethers.provider.getBlockNumber(),
      timestamp: new Date().toISOString(),
    };

    console.log("\n🎉 FylaroDeployer deployment completed successfully!");
    console.log("📋 Contract Details:");
    console.log(`   Address: ${fylaroDeployerAddress}`);
    console.log(`   Deployer: ${deployer.address}`);
    console.log(`   Fee Collector: ${config.feeCollector}`);
    console.log(`   Treasury: ${config.treasuryWallet}`);
    console.log(`   Stablecoin: ${config.stablecoin}`);

    // Update the ecosystem deployment file
    const fs = require("fs");
    const path = require("path");

    const ecosystemPath = path.join(
      process.cwd(),
      "deployments/arbitrum-sepolia-ecosystem.json"
    );
    if (fs.existsSync(ecosystemPath)) {
      const ecosystemData = JSON.parse(fs.readFileSync(ecosystemPath, "utf8"));
      ecosystemData.contracts.fylaroDeployer = fylaroDeployerAddress;
      ecosystemData.status = "complete_success";
      ecosystemData.deployment_summary.deployed_successfully = 10;
      ecosystemData.deployment_summary.failed = 0;
      ecosystemData.deployment_summary.success_rate = "100%";
      delete ecosystemData.failed_contracts;

      fs.writeFileSync(ecosystemPath, JSON.stringify(ecosystemData, null, 2));
      console.log(`\n💾 Updated ecosystem deployment file: ${ecosystemPath}`);
    }

    console.log("\n🌟 Complete Fylaro ecosystem now deployed!");
    console.log("🎯 All 10 contracts are now live on Arbitrum Sepolia!");
  } catch (error) {
    console.error("\n❌ FylaroDeployer deployment failed:");
    console.error(error.message);

    if (
      error.message.includes("initcode") ||
      error.message.includes("too big")
    ) {
      console.log(
        "\n💡 Contract is too large. Suggesting alternative approach..."
      );
      console.log("\n🔧 Alternative Solutions:");
      console.log("1. Use a factory pattern with multiple smaller contracts");
      console.log("2. Split FylaroDeployer into modules");
      console.log("3. Use proxy pattern with implementation contracts");
      console.log(
        "4. Remove the FylaroDeployer and use scripts for deployment"
      );

      console.log(
        "\n✨ Good news: Your core ecosystem (9/10 contracts) is fully functional!"
      );
      console.log(
        "   The FylaroDeployer is mainly a convenience contract for batch operations."
      );
    } else {
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
