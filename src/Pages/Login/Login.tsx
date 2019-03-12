import React, { Component } from 'react';

import Carousel from 'react-slick';

import LoginOverlay from '../../Components/LoginOverlay/LoginOverlay';

import loginImg1 from '../../Assets/img/Login/login-img-1.svg';
import loginImg2 from '../../Assets/img/Login/login-img-2.svg';
import loginImg3 from '../../Assets/img/Login/login-img-3.svg';
import loginImg4 from '../../Assets/img/Login/login-img-4.svg';
import sliderNext from '../../Assets/img/slider-next.svg';

import LoginBackground from '../../Components/LoginBackground/LoginBackground';

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

    const settings = {
            draggable: false,
            infinite: true,
            slidesToScroll: 1,
            slidesToShow: 1,
            speed: 800,
        };
        console.log(settings)

    return (
            <div>
                <LoginOverlay
                    click={this.handleLogin}
                />



                <Carousel {...settings}>
                    <div>
                        <LoginBackground
                            background="#ff8400"
                            title="CEMENT IS A BASKET OF MANY STABLECOINS"
                            content="Stablecoin holders can deposit their stablecoins into the
                            Cement Mixer (that&#39;s what we&#39;re calling the basket), to
                            benefit from increased liquidity, greater stability and
                            protection from risk."
                            img={loginImg1}
                            nextButtonImg={sliderNext}
                        />
                    </div>
                    <div>
                        <LoginBackground
                            background="#ff006c"
                            title="ON DEMAND LIQUIDITY &
                            DECENTRALIZED EXCHANGE"
                            content="Deposit a stablecoin in the Mixer allows you to
                             seamlessly exchange it for any other stablecoin in the Mixer.
                             For example, a holder of TUSD can easily pay a provider that
                             only accepts DAI."
                            img={loginImg2}
                            nextButton={sliderNext}
                            nextButtonImg={sliderNext}

                        />
                    </div>
                    <div>
                        <LoginBackground
                            background="#00d0de"
                            title="THE COMMUNITY VOTES WHICH STABLE COINS ENTER THE MIXR"
                            content="Members of the community vote for Rating Agents, who
                            compete to identify the best stablecoin projects. Community votes
                            determine which stablecoins are accepted or ejected from the Mixer."
                            img={loginImg3}
                            nextButton={sliderNext}
                        />
                    </div>
                    <div>
                        <LoginBackground
                            background="#ff6272"
                            title="MANAGING RISK AND REWARD BASED ON USER PREFERENCE"
                            content="Cement creates a marketplace for risk. Our users are protected
                            from the risk of failure of the underlying stablecoins and from the
                            diversification of their exposure. Earn rewards, paid out from fees collected
                            in the MIXR by absorbing this risk."
                            img={loginImg4}
                            nextButton={sliderNext}
                        />
                    </div>

                </Carousel>

            </div>
        );
    }
}

export default Login;
