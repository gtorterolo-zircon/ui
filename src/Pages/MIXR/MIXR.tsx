import React, { Component } from 'react';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState } from '../../Common/CommonInterfaces';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';

import warningLogo from '../../Assets/img/invalid-name.svg';
import StartMixing from '../../Components/StartMixing/StartMixing';

import Popup from '../../Components/Popup/Popup';


import './MIXR.css';

/**
 * IAsset interface
 * TODO: comment!
 */
interface IAsset {
    assetName: string;
    fee: string;
    receive: string;
    total: string;
}
/**
 * This is the state variables for mixr component
 * It also extends IBlockchainState so it can use
 * state variables blockchain related and load
 * information using state. The information is loaded
 * when the component loads.
 */
interface IMIXRState extends IBlockchainState {
    coinSelect?: string;
    coinAmount?: number;
    haveValidFunds?: boolean;
    selectedAssetCreate?: string;
    selectedAssetExchange?: string;
    assets?: IAsset[];
    isMixing?: boolean;
}

/**
 * This is the MIXR class. This component renders the page to
 * exchange assets.
 */
class MIXR extends Component<{}, IMIXRState> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            coinSelect: 'empty',
            haveValidFunds: false,
            isMixing: false,
            selectedAssetCreate: '',
            selectedAssetExchange: '',
        };
    }

    /**
     * @ignore
     */
    public async componentDidMount() {
        await BlockchainGeneric.onLoad().then((result) => {
            this.setState({
                IERC20ABI: result.IERC20ABI,
                mixrContract: result.mixrContract,
                userAccount: result.userAccount,
                walletInfo: result.walletInfo,
                web3: result.web3,
            });
        });
    }

    public handleChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    public handleSubmit = (event: any) => {
        // TODO: load coins and prices
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

    public render() {
        const { isMixing } = this.state;
        return (
            <div className="MIXR">
                <Navbar />
                <div className="MIXR__grid">
                    <div className="MIXR__wallet">
                        <Wallet />
                    </div>
                    <div className="MIXR__main">
                        {!isMixing && <StartMixing click={this.startMixing} />}
                        {isMixing && this.renderMixing()}
                    </div>
                    <div className="MIXR__basket-composition" />
                </div>
                {/* Error popup  */}
                {/* <Popup
                    status="error"
                    color={false}
                /> */}
                {/* In Progress popup */}
                {/* <Popup
                    status="inProgess"
                    color={true}
                /> */}
                {/* Success popup  */}
                <Popup
                    status="success"
                    color={true}
                />
            </div>
        );
    }




    private startMixing = () => {
        this.setState({isMixing: true});
    }

    private renderMixing = () => {
        const { coinAmount, coinSelect } = this.state;
        return <React.Fragment>
            <div className="MIXR-Input">
                <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                <form className="MIXR-Input__grid" onSubmit={this.handleSubmit}>

                    <select
                        className="MIXR-Input__coin-input"
                        name="coinSelect"
                        value={coinSelect}
                        onChange={this.handleChange}
                    >
                        {this.renderAssets()}
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
            {this.renderSelectionChoice()}
        </React.Fragment>;
    }

    private changeSelection = () => {
        this.setState({ selectedAssetCreate: '', selectedAssetExchange: '' });
    }

    private confirmTransaction = () => {
        // TODO: confirm transaction
        const { selectedAssetCreate, selectedAssetExchange } = this.state;
        alert('clicked' + selectedAssetCreate + ' ' + selectedAssetExchange);
    }

    private renderSelectionChoice = () => {
        const { selectedAssetCreate, selectedAssetExchange } = this.state;
        if (selectedAssetCreate === '' && selectedAssetExchange === '') {
            return null;
        }
        return <div>
            <p className="MIXR-Input__title" onClick={this.changeSelection}>change selection</p>
            <button onClick={this.confirmTransaction}>CONFIRM</button>
        </div>;
    }

    /**
     * Using state variables it renders the asset names in the dropdown
     * @returns The mapped elements into html <option /> tag
     */
    private renderAssets = () => {
        const { walletInfo } = this.state;
        if (walletInfo === undefined) {
            return [];
        }
        const assetName: string[] = [];
        for (const element of walletInfo) {
            assetName.push(element.name);
        }
        return assetName.map((element) => {
            return <option key={element} value={element.toLowerCase()}>{element}</option>;
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
        if (selectedAssetExchange === '') {
            if (selectedAssetCreate !== '') {
                const element = assets.filter((asset) => asset.assetName === selectedAssetCreate)[0];
                assetsMap = this.mixrAsset(element);
            } else {
                assetsMap = assets.map((element) => {
                    return this.mixrAsset(element);
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
    /**
     *
     */
    private renderExchange = () => {
        const { assets, selectedAssetCreate, selectedAssetExchange } = this.state;
        if (assets === null || assets === undefined) {
            return null;
        }
        let assetsMap;
        if (selectedAssetCreate === '') {
            if (selectedAssetExchange !== '') {
                const element = assets.filter((asset) => asset.assetName === selectedAssetExchange)[0];
                assetsMap = this.mixrAsset(element);
            } else {
                assetsMap = assets.map((element) => {
                    return this.mixrAsset(element);
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

    /**
     * Renders a MIXR assets using the given information of the parameter
     * It will render a MIXRAsset component. See the component for more info.
     * @param asset asset info being rendered
     * @returns a MIXRAsset to be put in html
     */
    private mixrAsset = (asset: IAsset) => <MIXRAsset
        key={asset.assetName}
        assetName={asset.assetName}
        receive={asset.receive}
        fee={asset.fee}
        total={asset.total}
        // tslint:disable-next-line jsx-no-lambda
        click={() => this.filterAssetHandler(true, asset.assetName)}
    />
}

export default MIXR;
