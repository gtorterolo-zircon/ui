import React from 'react';

import Logo from '../../Assets/img/cement-logo.svg';
import MetamaskLogo from '../../Assets/img/metamask-logo.svg';

import './LoginOverlay.css';


const LoginOverlay = (props: any) =>  (
    <div className="Login__overlay">
        <img className="Login__logo" src={Logo} alt="cementDAO logo" />
        <div className="Login__overlay-outer-container">
            <div className="Login__overlay-top-container">
                <p className="Login__overlay-title">
                    CONNECT YOUR WALLET
                    <br />
                    AND START EXCHANGING
                    <br />
                    STABLECOIN NOW
                </p>
                <button
                    type="button"
                    className="Login__overlay-button"
                    onClick={props.click}
                >
                    <span>
                        <img className="Login__overlay-button-logo" src={MetamaskLogo} />
                    </span>
                    METAMASK
                </button>
                <div className="Login__overlay-CTA-container">
                    <p className="Login__overlay-CTA">
                        Don
                        <span>&#39;</span>
                        t have a Metamask account?
                        <br />
                        <a href="https://metamask.io/" target="_blank">
                            <span className="Login__overlay-CTA--underline">CREATE ONE NOW</span>
                        </a>
                    </p>
                </div>
                <span className="Login__overlay-CTA--small Login__overlay-CTA--underline">
                    Terms of Service
                </span>
                <p className="Login__overlay-CTA--small">&copy; Copyright 2019 by 1A1Z Ltd.</p>
                <p className="Login__overlay-CTA--small">All rights reserved.</p>
            </div>
        </div>
    </div>
    );

export default LoginOverlay;
