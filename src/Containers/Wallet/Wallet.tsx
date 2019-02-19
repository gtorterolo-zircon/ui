import React, { Component } from 'react';
import truffleContract from 'truffle-contract';
import MIXRContract from '../../contracts/MIXR.json';
import SampleERC20Contract from '../../contracts/SampleERC20.json';
import getWeb3 from '../../utils/getWeb3';

import './Wallet.css';

interface IWalletType { name: string; priceUSD: number; value: number; }
interface IMIXRContractState {
    getApprovedTokens: () => Promise<[[IWalletType], number]>;
}
interface IWalletState {
    mixrContract?: IMIXRContractState;
    sampleERC20?: object;
    userAccount?: string;
    web3?: object;
    walletInfo?: IWalletType[];
}
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

            // tslint:disable-next-line: no-unused-expression
            new Promise(async (resolve, reject) => {
                // load MIXR contract
                const ContractMIXR = truffleContract(MIXRContract);
                ContractMIXR.setProvider(web3.currentProvider);
                const instanceMIXR = await ContractMIXR.deployed();

                // load sampleERC20 contract
                const ContractSampleERC20 = truffleContract(SampleERC20Contract);
                ContractSampleERC20.setProvider(web3.currentProvider);
                const instanceSampleERC20 = await ContractSampleERC20.deployed();

                const walletInfo = [
                    {
                        name: 'USDT',
                        priceUSD: 21.012,
                        value: 21.056,
                    },
                ];

                // update component state
                this.setState({
                    mixrContract: instanceMIXR,
                    sampleERC20: instanceSampleERC20,
                    walletInfo,
                });
                resolve();
            });

            // update component state
            this.setState({
                userAccount: accounts[0],
                web3,
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
                            <span className="underline">
                                <span className="Wallet__grid-title--underline">ASSET</span>
                            </span>
                        </div>
                        <div className="Wallet__grid-title">
                            <span className="underline">
                                <span className="Wallet__grid-title--underline">BALANCE</span>
                            </span>
                        </div>
                        <div className="Wallet__grid-title">
                            <span className="underline">
                                <span className="Wallet__grid-title--underline">DEPOSIT</span>
                            </span>
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
    public renderWalletInfo() {
        {
            if (this.state === null || this.state === undefined) {
                return;
            }

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
                            <i className="Wallet__grid-button fas fa-chevron-circle-right fa-2x" />
                        </div>
                    </React.Fragment>
                );
            });
        }
    }
}

export default Wallet;
