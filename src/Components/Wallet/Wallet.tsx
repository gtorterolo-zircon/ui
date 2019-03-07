import React, { Component } from 'react';

import ActionMenu from '../../Components/ActionMenu/ActionMenu';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import {
    IBlockchainState,
    IMIXRContractType,
    IWalletType,
    IWeb3Type,
} from '../../Common/CommonInterfaces';

import './Wallet.css';

import DepositBtn from '../../Assets/img/wallet/deposit-btn.svg';


/**
 * Interface for wallet component state definition
 * It also extends IBlockchainState so it can use
 * state variables blockchain related and load
 * information using state. The information is loaded
 * when the component loads.
 */
interface IWalletState extends IBlockchainState {
    mixrContract?: IMIXRContractType;
    IERC20ABI?: object;
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
        await BlockchainGeneric.onLoad().then((result) => {
            this.setState({
                IERC20ABI: result.IERC20ABI,
                mixrContract: result.mixrContract,
                userAccount: result.userAccount,
                walletInfo: result.walletInfo,
                web3: result.web3,
            });
        });
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
                    <div>
                        <ActionMenu />
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
                            <p className="Wallet__grid-item">{element.balance}</p>
                            <p className="Wallet__grid-item--small">
                                $
                                {element.balance}
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
}

export default Wallet;
