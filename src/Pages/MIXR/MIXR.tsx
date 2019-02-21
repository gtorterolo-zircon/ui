import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';

import StartMixing from '../../Components/StartMixing/StartMixing';
import warningLogo from '../../Assets/img/invalid-name.svg';

import './MIXR.css';


interface IMIXRState {
    coinSelect?: string;
    coinAmount?: number;
}
class MIXR extends Component<{}, IMIXRState> {
    constructor(props: any) {
        super(props);
        this.state = { coinSelect: 'empty' };
    }

    public handleChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    public handleSubmit = (event: any) => {
        const { coinSelect } = this.state;
        alert('Your favorite flavor is: ' + coinSelect);
        event.preventDefault();
    }

    public loadCoins = () => {
        return ['Tether', 'Paxos'];
    }

    public render() {
        const { coinSelect, coinAmount } = this.state;
        return (
            <div className="MIXR">
                <Navbar />
                <div className="MIXR__grid">
                    <div className="MIXR__wallet">
                        <Wallet />
                    </div>
                    <div className="MIXR__main">
                        {/* <StartMixing /> */}

                        <div className="MIXR-Input">
                            <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                            <form className="MIXR-Input__grid" onSubmit={this.handleSubmit}>

                                <select
                                    className="MIXR-Input__coin-input"
                                    name="coinSelect"
                                    value={coinSelect}
                                    onChange={this.handleChange}
                                >
                                    {this.renderCoins()}
                                </select>

                                <input
                                    placeholder="Send Amount"
                                    type="text"
                                    name="coinAmount"
                                    value={coinAmount}
                                    onChange={this.handleChange}
                                />
                                <button>max</button>
                            </form>
                        </div>

                        <div className="MIXR-Input__warning-grid">
                            <img className="MIXR-Input__warning-logo" src={warningLogo} alt="warning logo" />
                            <p className="MIXR-Input__warning-message">
                                LOOKS LIKE YOU DO NOT HAVE SUFFICIENT FUNDS,
                                <br />
                                PURCHASE ADDITIONAL COINS TO START.
                            </p>
                        </div>

                        <div className="MIXR-New-Token">
                            <p className="MIXR-New-Token__title">
                                CREATE
                                <span className="MIXR-New-Token__title--light"> NEW MIX TOKEN</span></p>
                        </div>

                        <MIXRAsset
                            assetName="MIXUSD"
                            receive="32.000"
                            fee="0.00000018"
                            total="31.221"
                        />

                        <p className="MIXR-New-Token__title MIXR-New-Token__title--padding-top">
                            EXCHANGE
                            <span className="MIXR-New-Token__title--light"> FOR STABLECOIN</span>
                        </p>

                        <MIXRAsset
                            assetName="MIXUSD"
                            receive="32.000"
                            fee="0.00000018"
                            total="31.221"
                        />

                    </div>
                    <div className="MIXR__basket-composition"></div>
                </div>
            </div>
        );
    }

    private renderCoins = () => {
        return this.loadCoins().map(element => {
            return <option key={element} value={element.toLowerCase()}>{element}</option>
        });
    }
}

export default MIXR;
