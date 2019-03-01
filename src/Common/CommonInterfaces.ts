/**
 * Interface for IERC20 definition
 * using web3.js package
 */
interface IERC20Calls {
    // although we should not use any, it needs to be
    call: () => Promise<any>;
    send: (options: object) => Promise<any>;
}
export interface IERC20TypeDefault {
    (address: string): IERC20Type;
    methods: IERC20TypeDefault;
    balanceOf: (user: string) => IERC20Calls;
    approve: (address: string, amount: string) => IERC20Calls;
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
export interface IWalletType {
    name: string;
    address: string;
    balance: number;
}
/**
 * Interface for mixr contract definition
 */
export interface IMIXRContractType extends IERC20Type {
    address: string;
    DEPOSIT: () => Promise<number>;
    estimateFee: (
        token: string,
        basket: string,
        transactionAmount: string,
        transactionType: number,
    ) => Promise<number>;
    getRegisteredTokens: () => Promise<[[string], number]>;
    depositToken: (token: string, depositInTokenWei: string, options?: any) => Promise<void>;
    approve: (address: string, amount: string, options: object) => Promise<void>;
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
