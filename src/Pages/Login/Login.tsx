import React, { Component } from 'react';

import LoginOverlay from '../../Components/LoginOverlay/LoginOverlay';

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
                <LoginOverlay
                    click={this.handleLogin}
                />

                {/* Login Background */}
                <div className="Login__grid">
                    <div className="Login__grid-inner"></div>
                    <div className="Login__grid-inner">
                        <img className="Login__grid-logo" src={loginImg1} alt="cementDAO logo" />
                        <p className="Login__grid-title">CEMENT IS A BASKET OF MANY STABLECOINS</p>
                        <p className="Login__grid-content">
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
