import BigNumber from 'bignumber.js';

/**
 * Defenition of fee types
 */
export enum FeeType {
   REDEMPTION = -1,
   TRANSFER = 0,
   DEPOSIT = 1,
}
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
    // tslint:disable-next-line callable-types
    new(jsonInterface: object, address: string, options?: object): IERC20TypeDefault;
}
interface IWeb3Eth {
    Contract: IWeb3EthContract;
    getAccounts: () => Promise<string[]>;
}
interface IWeb3Utils {
    hexToUtf8: (data: string) => string;
}
export interface IWeb3Type {
    eth: IWeb3Eth;
    utils: IWeb3Utils;
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
    decimals: number;
    mixrBalance: BigNumber;
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
    getTokensAcceptedForDeposits: () => Promise<[[string], number]>;
    getTokensAcceptedForRedemptions: () => Promise<[[string], number]>;
    depositToken: (token: string, depositInTokenWei: string, options?: any) => Promise<void>;
    redeemMIX: (token: string, redemptionInBasketWei: string, options?: any) => Promise<void>;
    approve: (address: string, amount: string, options: object) => Promise<void>;
    registerDetailedToken: (address: string, options: object) => Promise<void>;
    registerStandardToken: (address: string, name: string, decimals: string, options: object) => Promise<void>;
    getName: (address: string) => Promise<string>;
    getDecimals: (address: string) => Promise<string>;
    getTargetProportion: (address: string) => Promise<string>;
    getDepositFee: () => Promise<BigNumber>;
    getRedemptionFee: () => Promise<BigNumber>;
    getTransferFee: () => Promise<BigNumber>;
    setBaseFee: (amount: string, type: number, options: object) => Promise<void>;
    setTokensTargetProportion: (tokens: string[],  proportions: string[], options: object) => Promise<void>;
}
/**
 * Interface for Whitelist contract definition
 */
export interface IWhitelistType {
    isGovernor: (address: string) => Promise<boolean>;
}
/**
 * Blockchain state interface
 */
export interface IBlockchainState {
    mixrContract?: IMIXRContractType;
    whitelistContract?: IWhitelistType;
    bildContract?: IBILDState;
    IERC20ABI?: object;
    userAccount?: string;
    web3?: IWeb3Type;
    walletInfo?: IWalletType[];
}
/**
 * Interface for BILD contract
 */
export interface IBILDState extends IERC20Type {
    setMinimumStake: (minimumStake: string, options?: object) => Promise<void>;
    getMinimumStake: () => Promise<BigNumber>;
}
