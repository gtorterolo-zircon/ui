import React, { Component } from 'react';
import './Wallet.css'


class Wallet extends Component {
  render() {
    return (
      <div className="Wallet">
        <div className="Wallet__container">
          <p className="Wallet__title">MY WALLET</p>
          <div className="Wallet__grid">
            <div className="Wallet__grid-title"><span className="Wallet__grid-title--underline">ASSET</span></div>
            <div className="Wallet__grid-title"><span className="Wallet__grid-title--underline">BALANCE</span></div>
            <div className="Wallet__grid-title"><span className="Wallet__grid-title--underline">DEPOSIT</span></div>
          
            {/* TODO: Create a for each to loop out each cryptocurrency in wallet  */}
            <div className="Wallet__grid-item">USDT</div>
            <div className="Wallet__grid-title">
              <p>21.056</p>
              <p>$21.012</p>
            </div>
            <div className="Wallet__grid-title">DEPOSIT</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wallet;