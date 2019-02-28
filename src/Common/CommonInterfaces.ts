/**
 * Interface for IERC20 definition
 * using web3.js package
 */
interface IERC20Calls {
    // although we should not use any, it needs to be
    call: () => Promise<any>;
}
export interface IERC20TypeDefault {
    (address: string): IERC20Type;
    methods: IERC20TypeDefault;
    balanceOf: (user: string) => IERC20Calls;
}
/**
 * Interfaces for web3 definition
 */
interface IWeb3EthContract {
    new(jsonInterface: object, address: string, options?: object): IERC20TypeDefault;
}
interface IWeb3Eth {
    Contract: IWeb3EthContract;
    getAccounts: () => Promise<string[]>;
}
export interface IWeb3Type {
    eth: IWeb3Eth;
    currentProvider?: object;
}
/**
 * Interface for IERC20 definition
 * using truffle contract package
 */
export interface IERC20Type {
    (address: string): IERC20Type;
    decimals: () => Promise<number>;
    balanceOf: (user: string) => Promise<number>;
}
/**
 * Interface for wallet definition
 */
export interface IWalletType { name: string; priceUSD: number; value: number; }
/**
 * Interface for mixr contract definition
 */
export interface IMIXRContractType extends IERC20Type {
    getRegisteredTokens: () => Promise<[[string], number]>;
}
/**
 * TODO:
 */
export interface IBlockchainState {
    mixrContract?: IMIXRContractType;
    IERC20ABI?: object;
    userAccount?: string;
    web3?: IWeb3Type;
    walletInfo?: IWalletType[];
}
