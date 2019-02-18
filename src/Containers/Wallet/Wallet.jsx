import React, { Component } from 'react';
import './Wallet.css';


class Wallet extends Component {
    constructor() {
        super();
        this.state = {
            walletInfo: [],
        };
    }

    componentDidMount() {
        this.loadWalletInfo();
    }

    loadWalletInfo() {
        const walletInfo = [
            {
                name: 'USDT',
                value: 21.056,
                priceUSD: 21.012,
            },
        ];
        this.setState({ walletInfo });
    }

    render() {
        const { walletInfo } = this.state;
        return (
            <div className="Wallet">
                <div className="Wallet__container">
                    <p className="Wallet__title">MY WALLET</p>
                    <div className="Wallet__grid">
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">ASSET</span></span></div>
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">BALANCE</span></span></div>
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">DEPOSIT</span></span></div>

                        {/* TODO: Create a for each to loop out each cryptocurrency in wallet  */}
                        {
                            walletInfo.map(element => (
                                <React.Fragment>
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
                            ))
                        }

                    </div>
                </div>
            </div>
        );
    }
}

export default Wallet;
