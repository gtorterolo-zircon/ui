import React, { Component } from 'react';
import Wallet from '../../Containers/Wallet/Wallet';

import './MIXR.css';


class MIXR extends Component {
    render() {
        return (
            <div className="MIXR">
                <div className="MIXR__grid">
                    <div className="MIXR__wallet">
                        <Wallet />
                    </div>
                    <div className="MIXR__wallet1">middle</div>
                    <div className="MIXR__wallet1">end</div>
                </div>
            </div>
        );
    }
}

export default MIXR;
