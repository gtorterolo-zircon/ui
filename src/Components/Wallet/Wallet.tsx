import React, { Component } from 'react';
import ActionMenu from '../../Components/ActionMenu/ActionMenu';

import {
    IBlockchainState,
} from '../../Common/CommonInterfaces';

import './Wallet.css';

import DepositBtn from '../../Assets/img/wallet/deposit-btn.svg';


interface IWalletState extends IBlockchainState {
    assetClick?: any;
}
/**
 * The wallet component
 */
class Wallet extends Component<IWalletState, {}> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
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
            // get wallet info form state
            const { walletInfo } = this.props;
            if (walletInfo === null || walletInfo === undefined) {
                return;
            }
            // render array data
            return walletInfo.map((element) => {
                return (
                    <React.Fragment key={element.symbol}>
                        <div className="Wallet__grid-item">{element.symbol}</div>
                        <div>
                            <p className="Wallet__grid-item">{element.balance}</p>
                            <p className="Wallet__grid-item--small">
                                $
                                {element.balance}
                            </p>
                        </div>
                        <div>
                            <img
                                className="Wallet__grid-button"
                                data-id={element.symbol}
                                onClick={this.props.assetClick}
                                src={DepositBtn}
                            />
                        </div>
                    </React.Fragment>
                );
            });
        }
    }
}

export default Wallet;
