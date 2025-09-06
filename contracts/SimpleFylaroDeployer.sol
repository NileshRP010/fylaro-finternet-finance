// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleFylaroDeployer
 * @dev Minimal helper contract for Fylaro ecosystem management
 */
contract SimpleFylaroDeployer is Ownable {
    // Contract addresses (read-only registry)
    mapping(string => address) public contracts;

    // Configuration
    address public stablecoin;
    address public feeCollector;
    address public treasuryWallet;

    // Events
    event ContractRegistered(string contractName, address contractAddress);
    event ConfigurationUpdated(
        address stablecoin,
        address feeCollector,
        address treasury
    );

    /**
     * @dev Constructor
     */
    constructor(
        address _stablecoin,
        address _feeCollector,
        address _treasuryWallet
    ) {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_feeCollector != address(0), "Invalid fee collector");
        require(_treasuryWallet != address(0), "Invalid treasury");

        stablecoin = _stablecoin;
        feeCollector = _feeCollector;
        treasuryWallet = _treasuryWallet;
    }

    /**
     * @dev Register a deployed contract
     */
    function registerContract(
        string memory name,
        address contractAddress
    ) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        contracts[name] = contractAddress;
        emit ContractRegistered(name, contractAddress);
    }

    /**
     * @dev Get contract address by name
     */
    function getContract(string memory name) external view returns (address) {
        return contracts[name];
    }

    /**
     * @dev Update configuration
     */
    function updateConfiguration(
        address _stablecoin,
        address _feeCollector,
        address _treasuryWallet
    ) external onlyOwner {
        require(_stablecoin != address(0), "Invalid stablecoin");
        require(_feeCollector != address(0), "Invalid fee collector");
        require(_treasuryWallet != address(0), "Invalid treasury");

        stablecoin = _stablecoin;
        feeCollector = _feeCollector;
        treasuryWallet = _treasuryWallet;

        emit ConfigurationUpdated(_stablecoin, _feeCollector, _treasuryWallet);
    }

    /**
     * @dev Batch register contracts
     */
    function batchRegisterContracts(
        string[] memory names,
        address[] memory addresses
    ) external onlyOwner {
        require(names.length == addresses.length, "Arrays length mismatch");

        for (uint256 i = 0; i < names.length; i++) {
            require(addresses[i] != address(0), "Invalid contract address");
            contracts[names[i]] = addresses[i];
            emit ContractRegistered(names[i], addresses[i]);
        }
    }

    /**
     * @dev Get ecosystem info
     */
    function getEcosystemInfo()
        external
        view
        returns (
            address _stablecoin,
            address _feeCollector,
            address _treasuryWallet,
            address _invoiceToken,
            address _marketplace
        )
    {
        return (
            stablecoin,
            feeCollector,
            treasuryWallet,
            contracts["InvoiceToken"],
            contracts["Marketplace"]
        );
    }
}
