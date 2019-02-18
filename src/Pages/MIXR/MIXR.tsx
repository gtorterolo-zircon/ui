import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';

import StartMixing from '../../Components/StartMixing/StartMixing';

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

                        </div>
                    </div>
                    <div>l</div>
                </div>
            </div>
        );
    }
}

export default MIXR;
