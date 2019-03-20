import BigNumber from 'bignumber.js';
import truffleContract from 'truffle-contract';

import BILDContract from '../contracts/BILD.json';
import IERC20Contract from '../contracts/IERC20.json';
import MIXRContract from '../contracts/MIXR.json';
import WhitelistContract from '../contracts/Whitelist.json';
import getWeb3 from '../utils/getWeb3';
import {
    IBILDState,
    IBlockchainState,
    IMIXRContractType,
    IWalletType,
    IWeb3Type,
    IWhitelistType,
} from './CommonInterfaces';

import DAIicon from '../Assets/img/wallet-icons/dai.svg';
import GUSDicon from '../Assets/img/wallet-icons/gemini-dollar.svg';
import MIXicon from '../Assets/img/popup-images/error-popup-image.svg';
import PAXicon from '../Assets/img/wallet-icons/paxos.svg';
import USDTicon from '../Assets/img/wallet-icons/tether-icon.svg';
import TUSDicon from '../Assets/img/wallet-icons/true-usd.svg';
import USDCicon from '../Assets/img/wallet-icons/usd-coin.svg';

/**
 * Blockchain generic is a class used to server with some static methods
 * that does some generic call which are used often in different parts
 * of the application.
 */
class BlockchainGeneric {

    // tslint:disable-next-line member-ordering
    public static async onLoad(): Promise<IBlockchainState> {
        // load web3 and the usar accoun
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        // update component state
        const contracts = await this.loadContracts(web3);
        const balances = await this.loadUserBalances(accounts[0], contracts.mixr, web3, contracts.erc20abi);
        return ({
            IERC20ABI: contracts.erc20abi,
            bildContract: contracts.bild,
            mixrContract: contracts.mixr,
            userAccount: accounts[0],
            walletInfo: balances,
            web3,
            whitelistContract: contracts.whitelist,
        });
    }

    /**
     * Get tokens logo
     */
    public static getTokensLogo() {
        return [
            { symbol: 'MIX', logo: MIXicon },
            { symbol: 'USDT', logo: USDTicon },
            { symbol: 'TUSD', logo: TUSDicon },
            { symbol: 'USDC', logo: USDCicon },
            { symbol: 'PAX', logo: PAXicon },
            { symbol: 'GUSD', logo: GUSDicon },
            { symbol: 'DAI', logo: DAIicon },
        ];
    }

    /**
     * Load contracts async
     */
    private static loadContracts(web3: IWeb3Type):
        Promise<{ erc20abi: object, mixr: IMIXRContractType, whitelist: IWhitelistType, bild: IBILDState }> {
        return new Promise(async (resolve, reject) => {
            // load MIXR contract
            const ContractMIXR = truffleContract(MIXRContract);
            ContractMIXR.setProvider(web3.currentProvider);
            const instanceMIXR: IMIXRContractType = await ContractMIXR.deployed();
            // load whitelist contract
            const ContractWhitelist = truffleContract(WhitelistContract);
            ContractWhitelist.setProvider(web3.currentProvider);
            const instanceWhitelist: IWhitelistType = await ContractWhitelist.deployed();
            // load bild contract
            const ContractBILD = truffleContract(BILDContract);
            ContractBILD.setProvider(web3.currentProvider);
            const instanceBILD: IBILDState = await ContractBILD.deployed();
            // load the ERC20 interface abi
            const abi = (IERC20Contract).abi;
            // update component state
            resolve({ erc20abi: abi, mixr: instanceMIXR, whitelist: instanceWhitelist, bild: instanceBILD });
        });
    }
    /**
     * Load balance async
     * This should happen after @loadContracts
     */
    private static loadUserBalances(
        userAccount: string,
        mixrContract: IMIXRContractType,
        web3: IWeb3Type,
        IERC20ABI: object,
    ): Promise<IWalletType[]> {
        return new Promise(async (resolve, reject) => {
            // get the token decimals
            const mixrDecimals = new BigNumber(await mixrContract.decimals()).toNumber();
            // get balance and devide by tokens decimals so we can see a friendly number
            const mixrBalance = new BigNumber(
                await mixrContract.balanceOf(userAccount),
            ).dividedBy(10 ** mixrDecimals);
            // same as above!
            const approved: [[string], number] = await mixrContract.getRegisteredTokens();
            console.log('approved', approved);
            const approvedTokensAddress: [string] = approved[0];
            const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
            // save in a state array to render
            const walletInfo: IWalletType[] = [
                {
                    address: mixrContract.address,
                    balance: mixrBalance.dp(2).toNumber(),
                    decimals: new BigNumber(await mixrContract.decimals()).toNumber(),
                    mixrBalance: new BigNumber(0),
                    name: 'MIX',
                    symbol: 'MIX',
                },
            ];
            const validTokensForDeposit = await mixrContract.getTokensAcceptedForDeposits();
            const validTokensForRedemption = await mixrContract.getTokensAcceptedForRedemptions();
            // iterate over accepted tokens to add them of state component for rendering
            for (let i = 0; i < totalApprovedTokens; i += 1) {
                if (validTokensForDeposit[0]
                    .find((name) => name === approvedTokensAddress[i]) === undefined ||
                    validTokensForRedemption[0]
                        .find((name) => name === approvedTokensAddress[i]) === undefined) {
                    continue;
                }
                // get token info
                const tokenDecimals = new BigNumber(
                    await mixrContract.getDecimals(approvedTokensAddress[i]),
                ).toNumber();
                const ERC = new web3.eth.Contract(IERC20ABI, approvedTokensAddress[i]);
                const sampleBalance = new BigNumber(
                    await ERC.methods.balanceOf(userAccount).call(),
                ).dividedBy(10 ** tokenDecimals);
                // add it to the array
                const tokenName = await mixrContract.getName(approvedTokensAddress[i]);
                const tokenSymbol = await mixrContract.getSymbol(approvedTokensAddress[i]);
                walletInfo.push({
                    address: approvedTokensAddress[i],
                    balance: sampleBalance.dp(2).toNumber(),
                    decimals: tokenDecimals,
                    mixrBalance: new BigNumber(await ERC.methods.balanceOf(mixrContract.address).call()),
                    name: tokenName,
                    symbol: tokenSymbol,
                });
            }
            // resolve with info
            resolve(walletInfo);
        });
    }
}

export default BlockchainGeneric;
