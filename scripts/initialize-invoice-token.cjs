const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Initializing InvoiceToken contract...");

  const [deployer] = await ethers.getSigners();
  console.log(`Initializing from account: ${deployer.address}`);

  // Connect to the deployed InvoiceToken
  const invoiceTokenAddress = "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3";
  const InvoiceToken = await ethers.getContractFactory("InvoiceToken");
  const invoiceToken = InvoiceToken.attach(invoiceTokenAddress);

  try {
    // Add deployer as verified issuer
    console.log("Adding deployer as verified issuer...");
    const addVerifiedIssuerTx = await invoiceToken.addVerifiedIssuer(
      deployer.address
    );
    await addVerifiedIssuerTx.wait(2);
    console.log("✅ Added deployer as verified issuer");

    // Set platform fee
    console.log("Setting platform fee to 2.5%...");
    const updatePlatformFeeTx = await invoiceToken.updatePlatformFee(250); // 2.5%
    await updatePlatformFeeTx.wait(2);
    console.log("✅ Platform fee set to 2.5%");

    // Set verification fee
    console.log("Setting verification fee...");
    const updateVerificationFeeTx = await invoiceToken.updateVerificationFee(
      ethers.parseEther("0.001") // 0.001 ETH on Arbitrum
    );
    await updateVerificationFeeTx.wait(2);
    console.log("✅ Verification fee set to 0.001 ETH");

    console.log("\n🎉 InvoiceToken initialization completed successfully!");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
