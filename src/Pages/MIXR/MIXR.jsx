import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';


import './MIXR.css';


class MIXR extends Component {
    render() {
        return (
            <div className="MIXR">
                <Navbar />
                <div className="MIXR__grid">
                    <div className="MIXR__wallet">
                        <Wallet />
                    </div>
                    <div className="MIXR__wallet1">middle</div>
                    <div className="MIXR__wallet1">l</div>
                </div>
            </div>
        );
    }
}

export default MIXR;
