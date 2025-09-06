const { run } = require("hardhat");

async function verifyContract(address, constructorArguments) {
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArguments,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.log("Error verifying contract:", error);
      throw error;
    }
  }
}

module.exports = { verifyContract };
