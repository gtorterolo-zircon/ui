import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import truffleContract from 'truffle-contract';
import IERC20Contract from '../../contracts/IERC20.json';
import MIXRContract from '../../contracts/MIXR.json';
import getWeb3 from '../../utils/getWeb3';

import './Wallet.css';

import DepositBtn from '../../Assets/img/deposit-btn.svg';

/**
 * Interface for wallet definition
 */
interface IWalletType { name: string; priceUSD: number; value: number; }
/**
 * Interface for web3 definition
 */
interface IWeb3Type {
    currentProvider?: object;
}
/**
 * Interface for IERC20 definition
 */
interface IERC20Type {
    (address: string): IERC20Type;
    decimals: () => Promise<number>;
    balanceOf: (user: string) => Promise<number>;
}
/**
 * Interface for mixr contract definition
 */
interface IMIXRContractType extends IERC20Type {
    getApprovedTokens: () => Promise<[[string], number]>;
}
/**
 * Interface for wallet component state definition
 */
interface IWalletState {
    mixrContract?: IMIXRContractType;
    IERC20?: IERC20Type;
    userAccount?: string;
    web3?: IWeb3Type;
    walletInfo?: IWalletType[];
}
/**
 * The wallet component
 */
class Wallet extends Component<{}, IWalletState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
    }
    /**
     * @ignore
     */
    public async componentDidMount() {
        try {
            // load web3 and the usar accoun
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            // update component state
            this.setState({
                userAccount: accounts[0],
                web3,
            });
            // load platform info async
            this.loadContracts().then(() => {
                this.loadUserBalances();
            });
        } catch (error) {
            // if an error happen, log it
            // TODO: should we log somewhere else apart from the browser console?
            console.log('Failed to load web3, accounts, or contract. Check console for details.');
            console.log(error);
        }
    }
    /**
     * @ignore
     */
    public render() {
        return (
            <div className="Wallet">
                <div className="Wallet__container">
                    <p className="Wallet__title">MY WALLET</p>
                    <div className="Wallet__grid">
                        <div className="Wallet__grid-title">
                            <span className="Wallet__grid-title--underline">ASSET</span>
                        </div>
                        <div className="Wallet__grid-title">
                            <span className="Wallet__grid-title--underline">BALANCE</span>
                        </div>
                        <div className="Wallet__grid-title">
                            <span className="Wallet__grid-title--underline">DEPOSIT</span>
                        </div>
                        {this.renderWalletInfo()}
                    </div>
                </div>
            </div>
        );
    }
    /**
     * Get wallet user balance and render all information
     */
    private renderWalletInfo() {
        {
            if (this.state === null || this.state === undefined) {
                return;
            }
            // get wallet info form state
            const { walletInfo } = this.state;
            if (walletInfo === null || walletInfo === undefined) {
                return;
            }
            // render array data
            return walletInfo.map((element) => {
                return (
                    <React.Fragment key={element.name}>
                        <div className="Wallet__grid-item">{element.name}</div>
                        <div>
                            <p className="Wallet__grid-item">{element.value}</p>
                            <p className="Wallet__grid-item--small">
                                $
                                {element.priceUSD}
                            </p>
                        </div>
                        <div>
                            <img className="Wallet__grid-button" src={DepositBtn} />
                        </div>
                    </React.Fragment>
                );
            });
        }
    }
    /**
     * Load contracts async
     */
    private loadContracts() {
        return new Promise(async (resolve, reject) => {
            // web3 form state
            const { web3 } = this.state;
            if (web3 === undefined) {
                return;
            }
            // load MIXR contract
            const ContractMIXR = truffleContract(MIXRContract);
            ContractMIXR.setProvider(web3.currentProvider);
            const instanceMIXR = await ContractMIXR.deployed();
            // load the ERC20 interface
            const IERC20 = truffleContract(IERC20Contract);
            // update component state
            this.setState({
                IERC20,
                mixrContract: instanceMIXR,
            });
            resolve();
        });
    }
    /**
     * Load balance async
     * This should happen after @loadContracts
     */
    private loadUserBalances() {
        return new Promise(async (resolve, reject) => {
            // load main wallet balances
            const { userAccount, mixrContract, IERC20 } = this.state;
            if (userAccount === undefined || mixrContract === undefined || IERC20 === undefined) {
                return;
            }
            // get the token decimals
            const mixrDecimals = new BigNumber(await mixrContract.decimals()).toNumber();
            // get balance and devide by tokens decimals so we can see a friendly number
            const mixrBalance = new BigNumber(
                await mixrContract.balanceOf(userAccount),
            ).dividedBy(10 ** mixrDecimals);
            // same as above!
            const approved: [[string], number] = await mixrContract.getApprovedTokens();
            const approvedTokensAddress: [string] = approved[0];
            const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
            // save in a state array to render
            const walletInfo = [
                {
                    name: 'MIX',
                    priceUSD: mixrBalance.toNumber(),
                    value: mixrBalance.toNumber(),
                },
            ];
            // iterate over accepted tokens to add them of state component for rendering
            for (let i = 0; i < totalApprovedTokens; i += 1) {
                // get token info
                // TODO: we actualy need a method to get decimals!
                const sampleDecimals = new BigNumber(18).toNumber();
                const sampleBalance = new BigNumber(
                    await IERC20(approvedTokensAddress[i]).balanceOf(userAccount),
                ).dividedBy(10 ** sampleDecimals);
                // add it to the array
                walletInfo.push({
                    name: 'SAMPLE',
                    priceUSD: sampleBalance.toNumber(),
                    value: sampleBalance.toNumber(),
                });
            }
            // update component state
            this.setState({
                walletInfo,
            });
            resolve();
        });
    }
}

export default Wallet;
