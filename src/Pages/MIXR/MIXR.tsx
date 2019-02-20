import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';

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
                                    <option value="volvo">Volvo</option>
                                </select>
                                <input placeholder="Send Amount" type="text" />
                                <button>max</button>
                            </div>
                        </div>

                        <div className="MIXR-New-Token">
                            <p className="MIXR-New-Token__title">
                                <span className="MIXR-New-Token__title--bold">CREATE </span>
                                NEW MIX TOKEN </p>
                            <div className="MIXR-New-Token__grid">
                                <div>TUSD</div>
                                <div>
                                    <p>Receive</p>
                                    <p>32.000</p>
                                </div>
                                <div>
                                    <p>- FEE</p>
                                    <p>0.000000018</p>
                                </div>
                                <div>
                                    <p>TOTAL</p>
                                    <p>31.918</p>
                                </div>
                                <button type="button">SELECT</button>
                            </div>
                        </div>


                    </div>
                    <div>l</div>
                </div>
            </div>
        );
    }
}

export default MIXR;
