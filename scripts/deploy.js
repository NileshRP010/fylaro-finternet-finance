import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Deploy InvoiceToken
  const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
  const invoiceToken = await InvoiceToken.deploy();
  await invoiceToken.deployed();
  console.log("InvoiceToken deployed to:", invoiceToken.address);

  // Deploy CreditScoring
  const CreditScoring = await hre.ethers.getContractFactory("CreditScoring");
  const creditScoring = await CreditScoring.deploy();
  await creditScoring.deployed();
  console.log("CreditScoring deployed to:", creditScoring.address);

  // Deploy UnifiedLedger with dependencies
  const UnifiedLedger = await hre.ethers.getContractFactory("UnifiedLedger");
  const unifiedLedger = await UnifiedLedger.deploy(invoiceToken.address, creditScoring.address);
  await unifiedLedger.deployed();
  console.log("UnifiedLedger deployed to:", unifiedLedger.address);

  // Deploy other contracts as needed...

  console.log("Deployment completed!");

  // Save the contract addresses
  const addresses = {
    InvoiceToken: invoiceToken.address,
    CreditScoring: creditScoring.address,
    UnifiedLedger: unifiedLedger.address
  };

  console.log("\nContract Addresses:");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
