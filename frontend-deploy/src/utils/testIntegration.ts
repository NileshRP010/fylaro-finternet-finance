import { contractService } from "@/services/contractService";
import { ethers } from "ethers";

// Test script to verify contract integration
async function testContractIntegration() {
  console.log("🔗 Testing Contract Integration...");

  try {
    // Get contract addresses
    const addresses = contractService.getContractAddresses();
    console.log("📋 Contract Addresses:", addresses);

    // Check if all required addresses are set
    const requiredContracts = [
      "invoiceToken",
      "marketplace",
      "settlement",
      "liquidityPool",
      "creditScoring",
      "riskAssessment",
      "paymentTracker",
      "unifiedLedger",
      "finternentGateway",
      "simpleFylaroDeployer",
    ];

    const missingContracts = requiredContracts.filter(
      (contract) => !addresses[contract]
    );

    if (missingContracts.length > 0) {
      console.error("❌ Missing contract addresses:", missingContracts);
      return false;
    }

    console.log("✅ All contract addresses configured");

    // Test environment variables
    const envVars = {
      VITE_INVOICE_TOKEN_ADDRESS: import.meta.env.VITE_INVOICE_TOKEN_ADDRESS,
      VITE_MARKETPLACE_ADDRESS: import.meta.env.VITE_MARKETPLACE_ADDRESS,
      VITE_SETTLEMENT_ADDRESS: import.meta.env.VITE_SETTLEMENT_ADDRESS,
      VITE_LIQUIDITY_POOL_ADDRESS: import.meta.env.VITE_LIQUIDITY_POOL_ADDRESS,
      VITE_ARBITRUM_SEPOLIA_RPC: import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC,
    };

    console.log("🔧 Environment Variables:", envVars);

    const missingEnvVars = Object.entries(envVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      console.warn("⚠️ Missing environment variables:", missingEnvVars);
    } else {
      console.log("✅ All environment variables configured");
    }

    // Test provider connection
    const provider = new ethers.JsonRpcProvider(
      import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC
    );
    const network = await provider.getNetwork();
    console.log("🌐 Network Info:", {
      name: network.name,
      chainId: network.chainId.toString(),
      expected: "421614",
    });

    if (network.chainId.toString() !== "421614") {
      console.error("❌ Wrong network! Expected Arbitrum Sepolia (421614)");
      return false;
    }

    console.log("✅ Connected to Arbitrum Sepolia");

    // Test contract connectivity (read-only)
    try {
      const contract = new ethers.Contract(
        addresses.invoiceToken,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
        ],
        provider
      );

      const name = await contract.name();
      const symbol = await contract.symbol();

      console.log("📄 Invoice Token Contract:", { name, symbol });
      console.log("✅ Contract connectivity verified");
    } catch (error) {
      console.error("❌ Contract connectivity failed:", error);
      return false;
    }

    console.log("🎉 Contract integration test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}

// Auto-run test when imported
if (typeof window !== "undefined") {
  // Run test in browser environment
  window.testContractIntegration = testContractIntegration;
  console.log(
    "🧪 Contract integration test available as window.testContractIntegration()"
  );
}

export { testContractIntegration };
