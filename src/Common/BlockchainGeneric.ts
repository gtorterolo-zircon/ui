import BigNumber from 'bignumber.js';
import truffleContract from 'truffle-contract';

import IERC20Contract from '../contracts/IERC20.json';
import MIXRContract from '../contracts/MIXR.json';
import WhitelistContract from '../contracts/Whitelist.json';
import getWeb3 from '../utils/getWeb3';
import {
    IBlockchainState,
    IMIXRContractType,
    IWalletType,
    IWeb3Type,
    IWhitelistType,
} from './CommonInterfaces';


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
            mixrContract: contracts.mixr,
            userAccount: accounts[0],
            walletInfo: balances,
            web3,
            whitelistContract: contracts.whitelist,
        });
    }

    /**
     * Load contracts async
     */
    private static loadContracts(web3: IWeb3Type):
        Promise<{erc20abi: object, mixr: IMIXRContractType, whitelist: IWhitelistType}> {
        return new Promise(async (resolve, reject) => {
            // load MIXR contract
            const ContractMIXR = truffleContract(MIXRContract);
            ContractMIXR.setProvider(web3.currentProvider);
            const instanceMIXR: IMIXRContractType = await ContractMIXR.deployed();
            // load MIXR contract
            const ContractWhitelist = truffleContract(WhitelistContract);
            ContractWhitelist.setProvider(web3.currentProvider);
            const instanceWhitelist: IWhitelistType = await ContractWhitelist.deployed();
            // load the ERC20 interface abi
            const abi = (IERC20Contract).abi;
            // update component state
            resolve({erc20abi: abi, mixr: instanceMIXR, whitelist: instanceWhitelist});
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
            const approvedTokensAddress: [string] = approved[0];
            const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
            // save in a state array to render
            const walletInfo: IWalletType[] = [
                {
                    address: mixrContract.address,
                    balance: mixrBalance.dp(2).toNumber(),
                    name: 'MIX',
                },
            ];
            // iterate over accepted tokens to add them of state component for rendering
            for (let i = 0; i < totalApprovedTokens; i += 1) {
                // get token info
                // TODO: we actualy need a method to get decimals!
                const sampleDecimals = new BigNumber(18).toNumber();
                const ERC = new web3.eth.Contract(IERC20ABI, approvedTokensAddress[i]);
                const sampleBalance = new BigNumber(
                    await ERC.methods.balanceOf(userAccount).call(),
                ).dividedBy(10 ** sampleDecimals);
                // add it to the array
                const tokenName = web3.utils.hexToUtf8(await mixrContract.getName(approvedTokensAddress[i]));
                walletInfo.push({
                    address: approvedTokensAddress[i],
                    balance: sampleBalance.dp(2).toNumber(),
                    name: tokenName,
                });
            }
            // resolve with info
            resolve(walletInfo);
        });
    }
}

export default BlockchainGeneric;
