import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import StartMixingLogo from '../../Assets/start-mixing-logo.png';

import './StartMixing.css';


class Sidebar extends Component {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <div className="Start-Mixing__container">
                    <p className="Start-Mixing__title">THE CEMENT MIXR PROVIDES ON DEMAND LIQUIDITY AND
                    DECENTRALIZED  EXCHANGE FOR STABLECOINS</p>
                    <img  className="Start-Mixing__Image" src={StartMixingLogo} alt="start-mixing-logo" />
                    <p className="Start-Mixing__content">Deposit a stablecoin into the MIXR and seamlessly exchange it
                    for any other stablecoin, or simply create new MIXUSD token.</p>
                    <button className="Start-Mixing__button" type="button">START MIXING</button>
                </div>
            </div>
        );
    }
}

export default Sidebar;
