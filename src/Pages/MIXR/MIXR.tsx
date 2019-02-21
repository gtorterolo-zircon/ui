import React, { Component } from 'react';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';

import StartMixing from '../../Components/StartMixing/StartMixing';
import warningLogo from '../../Assets/img/invalid-name.svg';

import './MIXR.css';

interface IAsset {
    assetName: string;
    fee: string;
    receive: string;
    total: string;
}
interface IMIXRState {
    coinSelect?: string;
    coinAmount?: number;
    haveValidFunds?: boolean;
    selectedAssetCreate?: string;
    selectedAssetExchange?: string;
    assets?: IAsset[];
}
class MIXR extends Component<{}, IMIXRState> {
    constructor(props: any) {
        super(props);
        this.state = {
            coinSelect: 'empty',
            haveValidFunds: false,
            selectedAssetCreate: '',
            selectedAssetExchange: '',
        };
    }


    public handleChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    public handleSubmit = (event: any) => {
        event.preventDefault();
        const dummyData = [
            {
                assetName: 'MIXUSD',
                fee: '0.00000018',
                receive: '32.000',
                total: '31.221',
            },
            {
                assetName: 'MIXEURO',
                fee: '0.00000018',
                receive: '32.000',
                total: '31.221',
            },
        ];
        this.setState({ assets: dummyData });
    }

    public loadCoins = () => {
        return ['Tether', 'Paxos'];
    }

    public render() {
        const { coinSelect, coinAmount, haveValidFunds } = this.state;
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
                            <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                            <form className="MIXR-Input__grid" onSubmit={this.handleSubmit}>

                                <select
                                    className="MIXR-Input__coin-input"
                                    name="coinSelect"
                                    value={coinSelect}
                                    onChange={this.handleChange}
                                >
                                    {this.renderCoins()}
                                </select>

                                <input
                                    placeholder="Send Amount"
                                    type="text"
                                    name="coinAmount"
                                    value={coinAmount}
                                    onChange={this.handleChange}
                                />
                                <button>max</button>
                            </form>
                        </div>
                        {this.renderWarningBalance()}
                        {this.renderCreate()}
                        {this.renderExchange()}
                    </div>
                    <div className="MIXR__basket-composition" />
                </div>
            </div>
        );
    }

    private renderCoins = () => {
        return this.loadCoins().map((element) => {
            return <option key={element} value={element.toLowerCase()}>{element}</option>
        });
    }

    private filterAssetHandler = (isExchanging: boolean, key: string) => {
        if (isExchanging) {
            this.setState({ selectedAssetExchange: key });
        } else {
            this.setState({ selectedAssetCreate: key });
        }
    }

    private renderCreate = () => {
        const { assets, selectedAssetCreate, selectedAssetExchange } = this.state;
        if (assets === null || assets === undefined) {
            return null;
        }
        let assetsMap;
        const mixrAsset = (element: IAsset) => <MIXRAsset
            key={element.assetName}
            assetName={element.assetName}
            receive={element.receive}
            fee={element.fee}
            total={element.total}
            click={() => this.filterAssetHandler(false, element.assetName)}
        />;
        if (selectedAssetExchange === '') {
            if (selectedAssetCreate !== '') {
                const element = assets.filter((asset) => asset.assetName === selectedAssetCreate)[0];
                assetsMap = mixrAsset(element);
            } else {
                assetsMap = assets.map((element) => {
                    return mixrAsset(element);
                });
            }
        }
        return <React.Fragment>
            {/* new mix token title */}
            <div className="MIXR-New-Token">
                <p className="MIXR-New-Token__title">
                    CREATE
            <span className="MIXR-New-Token__title--light"> NEW MIX TOKEN</span></p>
            </div>
            {/* mixr asset component */}
            <React.Fragment>
                {assetsMap}
            </React.Fragment>
        </React.Fragment>;
    }

    private renderExchange = () => {
        const { assets, selectedAssetCreate, selectedAssetExchange } = this.state;
        if (assets === null || assets === undefined) {
            return null;
        }
        let assetsMap;
        const mixrAsset = (element: IAsset) => <MIXRAsset
            key={element.assetName}
            assetName={element.assetName}
            receive={element.receive}
            fee={element.fee}
            total={element.total}
            click={() => this.filterAssetHandler(true, element.assetName)}
        />;
        if (selectedAssetCreate === '') {
            if (selectedAssetExchange !== '') {
                const element = assets.filter((asset) => asset.assetName === selectedAssetExchange)[0];
                assetsMap = mixrAsset(element);
            } else {
                assetsMap = assets.map((element) => {
                    return mixrAsset(element);
                });
            }
        }
        return <React.Fragment>
            {/* stablecoin title */}
            <p className="MIXR-New-Token__title MIXR-New-Token__title--padding-top">
                EXCHANGE
            <span className="MIXR-New-Token__title--light"> FOR STABLECOIN</span>
            </p>
            {/* mixr asset component */}
            <React.Fragment>
                {assetsMap}
            </React.Fragment>
        </React.Fragment>;
    }

    private renderWarningBalance = () => {
        const { haveValidFunds } = this.state;
        if (haveValidFunds === true) {
            return null;
        }
        return <React.Fragment>
            {/* warning message */}
            <div className="MIXR-Input__warning-grid">
                <img className="MIXR-Input__warning-logo" src={warningLogo} alt="warning logo" />
                <p className="MIXR-Input__warning-message">
                    LOOKS LIKE YOU DO NOT HAVE SUFFICIENT FUNDS,
                                <br />
                    PURCHASE ADDITIONAL COINS TO START.
                            </p>
            </div>
        </React.Fragment>;
    }
}

export default MIXR;
