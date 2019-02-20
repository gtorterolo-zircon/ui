import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';

// import StartMixing from '../../Components/StartMixing/StartMixing';

import './MIXR.css';



class MIXR extends Component {
    public render() {
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
                            <div className="MIXR-Input__grid">
                                <select className="MIXR-Input__coin-input" placeholder="Select Coin To Convert">

                                        <option className="MIXR-Input__coin-option-container"
                                          value="volvo">Volvo</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="volvo">Volvo</option>
                                        <option value="volvo">Volvo</option>
                                </select>
                                <input placeholder="Send Amount" type="text" />
                                <button>max</button>
                            </div>
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
}

export default MIXR;
