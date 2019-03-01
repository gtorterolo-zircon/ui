import React, { Component } from 'react';

// import Logo from '../../Assets/cementDAO-logo.png';
import Logo from '../../Assets/img/cement-logo.svg';
import loginImg1 from '../../Assets/img/homepage-slider-img-1.svg';
import sliderNext from '../../Assets/img/slider-next.svg';

import './Login.css';

class Login extends Component {
    constructor(props: any) {
        super(props);
    }

    public handleLogin = async (event: any) => {
        event.preventDefault();
        // verify if window have ethereum property
        if (window.hasOwnProperty('ethereum')) {
            // by default the window class does not have ethereum property
            (window as any).ethereum.enable().then(() => {
                // go to mixr page
                window.location.href = '/mixr';
            });
        }
    }

    public render() {
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
                                <button
                                    type="button"
                                    className="Login__grid-left-button"
                                    onClick={this.handleLogin}
                                >
                                    METAMASK
                                </button>
                                <div className="Login__grid-left-CTA-container">
                                    <p className="Login__grid-left-CTA">
                                        Don
                                        <span>&#39;</span>
                                        t have a Metamask account?
                                        <br />
                                        <a href="https://metamask.io/" target="_blank">
                                            <span className="Login__grid-left-CTA--underline">CREATE ONE NOW</span>
                                        </a>
                                    </p>
                                </div>
                                <span className="Login__grid-left-CTA--small Login__grid-left-CTA--underline">Terms of Service</span>
                                <p className="Login__grid-left-CTA--small">&copy; Copyright 2019 by 1A1Z Ltd.</p>
                                <p className="Login__grid-left-CTA--small">All rights reserved.</p>
                            </div>

                        </div>

                    </div>
                    <div className="Login__grid-right">
                        <img className="Login__grid-right-logo" src={loginImg1} alt="cementDAO logo" />
                        <p className="Login__grid-right-title">CEMENT IS A BASKET OF MANY STABLECOINS</p>
                        <p className="Login__grid-right-content">
                            Stablecoin holders can deposit their stablecoins into the
                            Cement Mixer (that&#39;s what we&#39;re calling the basket), to
                            benefit from increased liquidity, greater stability and
                            protection from risk.
                        </p>
                        <div className="Login__button-flex">
                            <img className="Login__button" src={sliderNext} alt="slider next" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
