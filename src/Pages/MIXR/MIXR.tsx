import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, IWalletType } from '../../Common/CommonInterfaces';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';
import Navbar from '../../Containers/Navbar/Navbar';
import Wallet from '../../Containers/Wallet/Wallet';

import warningLogo from '../../Assets/img/invalid-name.svg';
import StartMixing from '../../Components/StartMixing/StartMixing';

import Popup from '../../Components/Popup/Popup';

import MaxButton from '../../Assets/img/button-max.svg';


import './MIXR.css';

/**
 * Transaction values defenition
 */
enum TransactionStatus {
    None,
    Pendding,
    Success,
    Fail,
}
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
    assetSelect?: string;
    assetAmount?: string;
    haveValidFunds?: boolean;
    selectedAssetCreate?: string;
    selectedAssetExchange?: string;
    assets?: IAsset[];
    isMixing?: boolean;
    transactionStatus: TransactionStatus;
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
            assetAmount: '',
            assetSelect: 'empty',
            haveValidFunds: false,
            isMixing: true,
            selectedAssetCreate: '',
            selectedAssetExchange: '',
            transactionStatus: TransactionStatus.None,
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
                {/* <Popup
                    status="success"
                    color={true}
                /> */}
            </div>
        );
    }

    private handleChange = (event: any) => {
        // we could use a generic setState using the target.name
        // but it would lead us to an error. See more
        // https://stackoverflow.com/a/37427579
        if (event.target.name === 'assetAmount') {
            this.setState({ assetAmount: event.target.value });
            this.generateDataToRenderExchange(event.target.value).then((assetsMap) => {
                this.renderExchange(assetsMap);
            });
        } else if (event.target.name === 'assetSelect') {
            this.setState({ assetSelect: event.target.value });
        }
    }

    private handleSubmit = (event: any) => {
        // TODO: load coins and prices
        event.preventDefault();
    }

    private startMixing = () => {
        this.setState({ isMixing: true });
    }

    private renderMixing = () => {
        const { assetAmount, assetSelect } = this.state;
        return <React.Fragment>
            <div className="MIXR-Input">
                <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                <form className="MIXR-Input__grid" onSubmit={this.handleSubmit}>

                    <select
                        className="MIXR-Input__coin-input"
                        name="assetSelect"
                        value={assetSelect}
                        onChange={this.handleChange}
                    >
                        <option value="empty">Select</option>
                        {this.renderAssets()}
                    </select>
                    <div className="MIXR-Input__coin-amount-container">
                        <input
                            className="MIXR-Input__coin-amount"
                            autoComplete="off"
                            placeholder="Send Amount"
                            type="text"
                            name="assetAmount"
                            value={assetAmount}
                            onChange={this.handleChange}
                        />
                        <button className="MIXR-Input__max-button"><img src={MaxButton} /></button>
                    </div>
                </form>
            </div>
            {this.renderWarningBalance()}
            {this.renderCreate()}
            <div id="renderExchange" />
            {this.renderSelectionChoice()}
        </React.Fragment>;
    }

    private changeSelection = () => {
        this.setState({ selectedAssetCreate: '', selectedAssetExchange: '' });
    }

    private confirmTransaction = () => {
        // TODO: confirm transaction
        const {
            assetAmount,
            mixrContract,
            selectedAssetCreate,
            selectedAssetExchange,
            walletInfo,
            userAccount,
            IERC20ABI,
            web3,
        } = this.state;

        if (
            assetAmount === undefined ||
            userAccount === undefined ||
            mixrContract === undefined ||
            selectedAssetCreate === undefined ||
            selectedAssetExchange === undefined ||
            IERC20ABI === undefined ||
            web3 === undefined ||
            walletInfo === undefined
        ) {
            return;
        }

        // get address using token name
        const assetAddress = (
            walletInfo.filter((element) =>
                element.name.toLowerCase() === selectedAssetExchange.toLowerCase(),
            )[0]
        ).address;

        // get contract using abi
        const ERC = new web3.eth.Contract(IERC20ABI, assetAddress);

        // TODO: get real decimals from system maybe mixr from .env file
        const someERC20Decimals = 18;
        const tokens = parseInt(assetAmount, 10);
        const mixrDecimals = 24;
        // define amounts
        const tokensToDeposit = new BigNumber(10).pow(someERC20Decimals)
            .multipliedBy(tokens).toString(10);
        const MIXToMint = new BigNumber(10).pow(mixrDecimals).multipliedBy(tokens);
        // approve mix tokens
        mixrContract.approve(mixrContract.address, MIXToMint.toString(10), {
            from: userAccount,
        }).then(() => {
            // approve token
            ERC.methods.approve(mixrContract.address, tokensToDeposit)
                .send({ from: userAccount })
                .then(async (receipt: any) => {
                    // deposit
                    await mixrContract.depositToken(assetAddress, tokensToDeposit, {
                        from: userAccount,
                    });
                });
        });
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

    private generateDataToRenderExchange = async (assetAmount: string): Promise<any[]> => {
        const {
            mixrContract,
            selectedAssetCreate,
            selectedAssetExchange,
            assetSelect,
            walletInfo,
        } = this.state;
        if (
            mixrContract === undefined ||
            selectedAssetCreate === undefined ||
            selectedAssetExchange === undefined ||
            walletInfo === undefined ||
            assetSelect === undefined
        ) {
            return [];
        }
        if (assetAmount.length < 1) {
            return [];
        }
        let assetsMap: any[] = [];

        const dummyData: IAsset[] = [];
        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        for (const element of walletInfo) {
            if (element.name.toLowerCase() === assetSelect.toLowerCase()) {
                continue;
            }

            const estimatedFee = new BigNumber(
                await mixrContract.estimateFee(
                    element.address,
                    mixrContract.address,
                    assetAmount,
                    1,
                ),
                // TODO: var .env with MIX decimals number
            ).dividedBy(10 ** 24);

            dummyData.push({
                assetName: element.name,
                fee: estimatedFee.toString(),
                receive: new BigNumber(assetAmount).minus(estimatedFee).toString(),
                total: assetAmount,
            });
        }

        if (selectedAssetCreate === '') {
            if (selectedAssetExchange !== '') {
                const element = dummyData.filter((asset) => asset.assetName === selectedAssetExchange)[0];
                assetsMap = [this.mixrAsset(element)];
            } else {
                assetsMap = dummyData.map((element) => {
                    return this.mixrAsset(element);
                });
            }
        }
        return assetsMap;
    }
    /**
     *
     */
    private renderExchange = (assetsMap: any[]) => {
        const node = document.getElementById('renderExchange');
        if (assetsMap.length === 0) {
            ReactDOM.unmountComponentAtNode(node);
            return;
        }
        ReactDOM.render(
            <React.Fragment>
                {/* stablecoin title */}
                <p className="MIXR-New-Token__title MIXR-New-Token__title--padding-top">
                    EXCHANGE
                <span className="MIXR-New-Token__title--light"> FOR STABLECOIN</span>
                </p>
                {/* mixr asset component */}
                <React.Fragment>
                    {assetsMap}
                </React.Fragment>
            </React.Fragment>, node,
        );
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
