// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./InvoiceToken.sol";
import "./Marketplace.sol";
import "./CreditScoring.sol";
import "./PaymentTracker.sol";
import "./UnifiedLedger.sol";
import "./RiskAssessment.sol";
import "./LiquidityPool.sol";
import "./FinternentGateway.sol";

/**
 * @title FylaroDeployer
 * @dev Helper contract for deploying the Fylaro Finternet Finance ecosystem
 */
contract FylaroDeployer is Ownable {
    // Contract addresses
    address public invoiceToken;
    address public marketplace;
    address public creditScoring;
    address public paymentTracker;
    address public unifiedLedger;
    address public riskAssessment;
    address public liquidityPool;
    address public finternetGateway;

    // Configuration
    address public stablecoin;
    address public feeCollector;
    address public treasuryWallet;

    // Deployment status
    bool public deployed;

    // Events
    event ContractDeployed(string contractName, address contractAddress);
    event EcosystemDeployed(address gateway);

    /**
     * @dev Constructor
     * @param _stablecoin The stablecoin address
     * @param _feeCollector The fee collector address
     * @param _treasuryWallet The treasury wallet address
     */
    constructor(
        address _stablecoin,
        address _feeCollector,
        address _treasuryWallet
    ) {
        require(_stablecoin != address(0), "Invalid stablecoin address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        require(
            _treasuryWallet != address(0),
            "Invalid treasury wallet address"
        );

        stablecoin = _stablecoin;
        feeCollector = _feeCollector;
        treasuryWallet = _treasuryWallet;
    }

    /**
     * @dev Deploy the entire Fylaro ecosystem
     * @return success Whether the deployment was successful
     */
    function deployEcosystem() external onlyOwner returns (bool success) {
        require(!deployed, "Already deployed");

        // Deploy InvoiceToken
        invoiceToken = address(new InvoiceToken(treasuryWallet));
        emit ContractDeployed("InvoiceToken", invoiceToken);

        // Deploy CreditScoring
        creditScoring = address(new CreditScoring());
        emit ContractDeployed("CreditScoring", creditScoring);

        // Deploy Marketplace
        marketplace = address(new InvoiceMarketplace(invoiceToken));
        emit ContractDeployed("Marketplace", marketplace);

        // Deploy PaymentTracker
        paymentTracker = address(
            new PaymentTracker(invoiceToken, feeCollector)
        );
        emit ContractDeployed("PaymentTracker", paymentTracker);

        // Deploy UnifiedLedger
        unifiedLedger = address(new UnifiedLedger(invoiceToken, creditScoring));
        emit ContractDeployed("UnifiedLedger", unifiedLedger);

        // Deploy RiskAssessment
        riskAssessment = address(
            new RiskAssessment(invoiceToken, creditScoring)
        );
        emit ContractDeployed("RiskAssessment", riskAssessment);

        // Deploy LiquidityPool
        liquidityPool = address(
            new LiquidityPool(
                stablecoin,
                invoiceToken,
                creditScoring,
                treasuryWallet
            )
        );
        emit ContractDeployed("LiquidityPool", liquidityPool);

        // Deploy FinternentGateway
        finternetGateway = address(new FinternentGateway(stablecoin));
        emit ContractDeployed("FinternentGateway", finternetGateway);

        // Configure gateway
        FinternentGateway gateway = FinternentGateway(
            payable(finternetGateway)
        );

        // Register contracts in gateway
        gateway.registerContract(
            "InvoiceToken",
            payable(invoiceToken),
            "1.0.0"
        );
        gateway.registerContract("Marketplace", payable(marketplace), "1.0.0");
        gateway.registerContract(
            "CreditScoring",
            payable(creditScoring),
            "1.0.0"
        );
        gateway.registerContract(
            "PaymentTracker",
            payable(paymentTracker),
            "1.0.0"
        );
        gateway.registerContract(
            "UnifiedLedger",
            payable(unifiedLedger),
            "1.0.0"
        );
        gateway.registerContract(
            "RiskAssessment",
            payable(riskAssessment),
            "1.0.0"
        );
        gateway.registerContract(
            "LiquidityPool",
            payable(liquidityPool),
            "1.0.0"
        );

        // Set gateway as operator in other contracts
        // Note: InvoiceToken doesn't inherit AccessControl, so removing grantRole call
        CreditScoring(creditScoring).grantRole(
            keccak256("ASSESSOR_ROLE"),
            finternetGateway
        );
        PaymentTracker(payable(paymentTracker)).grantRole(
            keccak256("MANAGER_ROLE"),
            finternetGateway
        );

        deployed = true;

        emit EcosystemDeployed(finternetGateway);

        return true;
    }

    /**
     * @dev Update configuration
     * @param _stablecoin The new stablecoin address
     * @param _feeCollector The new fee collector address
     * @param _treasuryWallet The new treasury wallet address
     * @return success Whether the update was successful
     */
    function updateConfig(
        address _stablecoin,
        address _feeCollector,
        address _treasuryWallet
    ) external onlyOwner returns (bool success) {
        require(!deployed, "Already deployed");
        require(_stablecoin != address(0), "Invalid stablecoin address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        require(
            _treasuryWallet != address(0),
            "Invalid treasury wallet address"
        );

        stablecoin = _stablecoin;
        feeCollector = _feeCollector;
        treasuryWallet = _treasuryWallet;

        return true;
    }

    /**
     * @dev Get all contract addresses
     * @return _invoiceToken The InvoiceToken contract address
     * @return _marketplace The Marketplace contract address
     * @return _creditScoring The CreditScoring contract address
     * @return _paymentTracker The PaymentTracker contract address
     * @return _unifiedLedger The UnifiedLedger contract address
     * @return _riskAssessment The RiskAssessment contract address
     * @return _liquidityPool The LiquidityPool contract address
     * @return _finternetGateway The FinternentGateway contract address
     */
    function getAllContractAddresses()
        external
        view
        returns (
            address _invoiceToken,
            address _marketplace,
            address _creditScoring,
            address _paymentTracker,
            address _unifiedLedger,
            address _riskAssessment,
            address _liquidityPool,
            address _finternetGateway
        )
    {
        return (
            invoiceToken,
            marketplace,
            creditScoring,
            paymentTracker,
            unifiedLedger,
            riskAssessment,
            liquidityPool,
            finternetGateway
        );
    }
}
