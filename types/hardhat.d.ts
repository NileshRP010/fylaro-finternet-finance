declare module "*.json" {
    const value: any;
    export default value;
}

declare module "@nomiclabs/hardhat-ethers" {
    import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
    export type { HardhatEthersHelpers };
}

declare module "hardhat/types" {
    import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";

    export interface HardhatRuntimeEnvironment {
        ethers: HardhatEthersHelpers;
    }

    export interface NetworkUserConfig {
        type?: string;
        accounts?: string[];
        url?: string;
        chainId?: number;
        gasMultiplier?: number;
        gasPrice?: string | number;
        timeout?: number;
        verify?: {
            etherscan?: {
                apiKey?: string;
            };
        };
        mining?: {
            auto: boolean;
            interval: number;
        };
    }
}
