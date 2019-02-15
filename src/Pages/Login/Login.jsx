import React, { Component } from 'react';

import LoginLogo from '../../Assets/login-page-logo.png';
import Logo from '../../Assets/cementDAO-logo.png';
import './Login.css';

class Login extends Component {
    render() {
        return (
            <div>
                <div className="Login__grid">
                    <div className="Login__grid-left">
                        <img className="Login__logo" src={Logo} alt="cementDAO logo" />

                        <div className="Login__grid-left-outer-container">
                            <div className="Login__grid-left-top-container">
                                <p className="Login__grid-left-title">
                                    CONNECT YOUR WALLET
                                    <br />
                                    AND START EXCHANGING
                                    <br />
                                    STABLECOIN NOW
                                </p>
                                <button type="button" className="Login__grid-left-button">METAMASK</button>
                                <div>
                                    <p className="Login__grid-left-CTA">
                                        Don
                                        <span>&#39;</span>
                                        t have a Metamask account?
                                        <br />
                                        <span className="Login__grid-left-CTA--underline">Create one now</span>
                                    </p>
                                </div>
                            </div>

                            <div className="Login__grid-left-bottom-container">
                                &copy; Copyright 2019 by 1A1Z Ltd. All rights reserved.
                                <span className="Login__grid-left-bottom-container--underline">Terms of Service</span>
                            </div>

                        </div>

                    </div>
                    <div className="Login__grid-right">
                        <img className="Login__grid-right-logo" src={LoginLogo} alt="cementDAO logo" />
                        <p className="Login__grid-right-title">CEMENT IS A BASKET OF MANY STABLECOINS</p>
                        <p className="Login__grid-right-content">
                            Stablecoin holders can deposit their stablecoins into the
                            Cement Mixer (that&#39;s what we&#39;re calling the basket), to
                            benefit from increased liquidity, greater stability and
                            protection from risk.
                        </p>
                        <div className="Login__button-flex">
                            <span className="Login__button--background"><i className="Login__button" /></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
