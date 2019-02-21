import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import StartMixingLogo from '../../Assets/img/illustration-welcome.svg';

import './StartMixing.css';


const StartMixing = (props: any) => (
    <div>
        <div className="Start-Mixing__container">
            <p className="Start-Mixing__title">THE CEMENT MIXR PROVIDES ON DEMAND LIQUIDITY AND
                    DECENTRALIZED  EXCHANGE FOR STABLECOINS</p>
            <p className="Start-Mixing__content">Deposit a stablecoin into the MIXR and seamlessly exchange it
                    for any other stablecoin, or simply create new MIXUSD token.</p>
            <img className="Start-Mixing__Image" src={StartMixingLogo} alt="start-mixing-logo" />
            <div className="Start-Mixing__button-grid">
                <button
                    onClick={props.click}
                    className="Start-Mixing__button"
                    type="button"
                >
                    GET STARTED
                </button>
            </div>
        </div>
    </div>
);

export default StartMixing;
