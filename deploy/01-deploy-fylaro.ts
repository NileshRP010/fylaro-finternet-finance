import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Starting deployments...");
  console.log("Deployer address:", deployer);

  // Deploy InvoiceToken
  const invoiceToken = await deploy('InvoiceToken', {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("InvoiceToken deployed to:", invoiceToken.address);

  // Deploy CreditScoring
  const creditScoring = await deploy('CreditScoring', {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("CreditScoring deployed to:", creditScoring.address);

  // Deploy UnifiedLedger with dependencies
  const unifiedLedger = await deploy('UnifiedLedger', {
    from: deployer,
    args: [invoiceToken.address, creditScoring.address],
    log: true,
  });
  console.log("UnifiedLedger deployed to:", unifiedLedger.address);

  // Write the deployment addresses
  const addresses = {
    InvoiceToken: invoiceToken.address,
    CreditScoring: creditScoring.address,
    UnifiedLedger: unifiedLedger.address
  };

  console.log("\nContract Addresses:");
  console.log(JSON.stringify(addresses, null, 2));

  // Verify on Etherscan if not on a local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await invoiceToken.deployTransaction.wait(5);
    await creditScoring.deployTransaction.wait(5);
    await unifiedLedger.deployTransaction.wait(5);

    console.log("\nVerifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: invoiceToken.address,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: creditScoring.address,
        constructorArguments: [],
      });

      await hre.run("verify:verify", {
        address: unifiedLedger.address,
        constructorArguments: [invoiceToken.address, creditScoring.address],
      });
    } catch (error) {
      console.log("Error verifying contracts:", error);
    }
  }
};

export default func;
func.tags = ['Fylaro'];
