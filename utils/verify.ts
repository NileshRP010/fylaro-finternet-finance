import { run } from "hardhat";

export async function verifyContract(address: string, constructorArguments: any[]) {
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArguments,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.log("Error verifying contract:", error);
      throw error;
    }
  }
}
