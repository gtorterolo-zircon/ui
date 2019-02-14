import React, { Component } from 'react';
import './Wallet.css';


class Wallet extends Component {
    render() {
        return (
            <div className="Wallet">
                <div className="Wallet__container">
                    <p className="Wallet__title">MY WALLET</p>
                    <div className="Wallet__grid">
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">ASSET</span></span></div>
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">BALANCE</span></span></div>
                        <div className="Wallet__grid-title"><span className="underline"><span className="Wallet__grid-title--underline">DEPOSIT</span></span></div>

                        {/* TODO: Create a for each to loop out each cryptocurrency in wallet  */}
                        <div className="Wallet__grid-item">USDT</div>
                        <div>
                            <p className="Wallet__grid-item">21.056</p>
                            <p className="Wallet__grid-item--small">$21.012</p>
                        </div>
                        <div>
                            <i className="Wallet__grid-button fas fa-chevron-circle-right fa-2x" />
                        </div>

                        <div className="Wallet__grid-item">TUSD</div>
                        <div>
                            <p className="Wallet__grid-item">0.056</p>
                            <p className="Wallet__grid-item--small">$0.055</p>
                        </div>
                        <div>
                            <i className="Wallet__grid-button fas fa-chevron-circle-right fa-2x" />
                        </div>

                        <div className="Wallet__grid-item">TUSD</div>
                        <div>
                            <p className="Wallet__grid-item">0.056</p>
                            <p className="Wallet__grid-item--small">$0.055</p>
                        </div>
                        <div>
                            <i className="Wallet__grid-button fas fa-chevron-circle-right fa-2x" />
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

export default Wallet;
