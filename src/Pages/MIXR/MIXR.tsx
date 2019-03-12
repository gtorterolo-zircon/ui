import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createLogger, format, transports } from 'winston';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { FeeType, IBlockchainState } from '../../Common/CommonInterfaces';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';
import Navbar from '../../Components/Navbar/Navbar';
import Wallet from '../../Components/Wallet/Wallet';

import warningLogo from '../../Assets/img/invalid-name.svg';
import StartMixing from '../../Components/StartMixing/StartMixing';

import Popup from '../../Components/Popup/Popup';

import MaxButton from '../../Assets/img/button-max.svg';


import './MIXR.css';

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    level: 'debug',
    transports: [
        new transports.Console(),
    ],
});

/**
 * Transaction values defenition
 */
enum TransactionStatus {
    None,
    Pending,
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
    assetSelect: string;
    assetAmount: string;
    haveValidFunds: boolean;
    selectedAssetCreate: string;
    selectedAssetExchange: string;
    assets: IAsset[];
    isMixing: boolean;
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
            assets: [],
            haveValidFunds: true,
            isMixing: false,
            selectedAssetCreate: '',
            selectedAssetExchange: '',
            transactionStatus: TransactionStatus.None,
        };
    }

    /**
     * @ignore
     */
    public async componentDidMount() {
        logger.info('[START] componentDidMount');
        await BlockchainGeneric.onLoad().then((result) => {
            this.setState({
                IERC20ABI: result.IERC20ABI,
                mixrContract: result.mixrContract,
                userAccount: result.userAccount,
                walletInfo: result.walletInfo,
                web3: result.web3,
            });
        });
        logger.info('[END] componentDidMount');
    }

    /**
     * @ignore
     */
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
                {this.renderPopUp()}
            </div>
        );
    }

    /**
     * Close transaction related pop up
     */
    private closePopUp = () => {
        this.setState({ transactionStatus: TransactionStatus.None });
    }

    /**
     * Renders popup according to component state
     */
    private renderPopUp = () => {
        const { transactionStatus } = this.state;
        switch (transactionStatus) {
            case TransactionStatus.Pending:
                return <Popup status="inProgess" clickClose={this.closePopUp} />;
            case TransactionStatus.Success:
                return <Popup status="success" clickClose={this.closePopUp} />;
            case TransactionStatus.Fail:
                return <Popup status="error" clickClose={this.closePopUp} />;
        }
    }

    /**
     * Handle fields changes
     */
    private handleChange = (event: any) => {
        // we could use a generic setState using the target.name
        // but it would lead us to an error. See more
        // https://stackoverflow.com/a/37427579
        const { assetSelect, assetAmount } = this.state;
        if (assetSelect === undefined || assetAmount === undefined) {
            return;
        }

        // update states
        if (event.target.name === 'assetAmount') {
            this.setState({ assetAmount: event.target.value });
            this.updateAssetsPrice(event.target.value, assetSelect);
        } else if (event.target.name === 'assetSelect') {
            this.setState({ assetSelect: event.target.value });
            // TODO: not updating correctly!
            // this.updateAssetsPrice(assetAmount, event.target.value);
        }
    }

    /**
     * Given asset and amount information, get and render
     * @param amount asset amount to exchange
     * @param asset asset to ecxhange
     */
    private updateAssetsPrice = (amount: string, asset: string): void => {
        this.generateDataToRenderExchange(amount).then((assetsMap) => {
            if (asset === 'mix') {
                this.renderCreate([]);
                this.renderExchange(assetsMap);
            // in case of moving the default selection
            } else if (asset !== 'empty') {
                this.renderCreate(assetsMap);
                this.renderExchange([]);
            }
        });
    }

    /**
     * @ignore
     */
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
                        <option value="empty">Select Coin To Convert</option>
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
                        <button
                            onClick={this.fetchAssetMax}
                            className="MIXR-Input__max-button"
                        >
                            <img src={MaxButton} />
                        </button>
                    </div>
                </form>
            </div>
            {this.renderWarningBalance()}
            <div id="renderCreate" />
            <div id="renderExchange" />
            {this.renderSelectionChoice()}
        </React.Fragment>;
    }

    /**
     * Fetch max amount for selected asset
     */
    private fetchAssetMax = (event: any) => {
        const { assetSelect, walletInfo } = this.state;
        if (assetSelect.length > 0) {
            if (walletInfo === undefined) {
                return;
            }
            // get asset max from user's balance
            const max = walletInfo.filter(
                (wallet) => wallet.name.toLowerCase() === assetSelect.toLowerCase(),
            )[0].balance;
            this.setState({ assetAmount: max.toString() });
            this.updateAssetsPrice(max.toString(), assetSelect);
        }
        event.preventDefault();
    }

    /**
     * Called when onClick to reset selection
     * Cleans selection variables values
     */
    private changeSelection = () => {
        this.setState({ selectedAssetCreate: '', selectedAssetExchange: '' });
    }

    /**
     * Method called when onClick from confirm button transaction
     */
    private confirmTransaction = () => {
        const {
            assetAmount,
            assetSelect,
            mixrContract,
            selectedAssetCreate,
            selectedAssetExchange,
            walletInfo,
            userAccount,
            IERC20ABI,
            web3,
        } = this.state;

        // since this variables can be undefined, let's check their values
        if (
            assetAmount === undefined ||
            assetSelect === undefined ||
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

        // TODO: get real decimals from system maybe mixr from .env file
        const someERC20Decimals = 18;
        const tokens = parseInt(assetAmount, 10);
        const mixrDecimals = 24;
        //
        if (selectedAssetExchange.toLowerCase() === 'mix') {
            // if I click in MIX is because I'm doing a deposit
            // get address using selected token name
            const assetAddress = (
                walletInfo.filter((element) =>
                    element.name.toLowerCase() === assetSelect.toLowerCase(),
                )[0]
            ).address;
            // get contract using abi
            const ERC = new web3.eth.Contract(IERC20ABI, assetAddress);
            // define amounts
            const tokensToDeposit = new BigNumber(10).pow(someERC20Decimals)
                .multipliedBy(tokens).toString(10);
            const MIXToMint = new BigNumber(10).pow(mixrDecimals).multipliedBy(tokens);
            // approve mix tokens
            mixrContract.approve(mixrContract.address, MIXToMint.toString(10), {
                from: userAccount,
            }).then(() => {
                this.setState({ transactionStatus: TransactionStatus.Pending });
                // approve token
                ERC.methods.approve(mixrContract.address, tokensToDeposit)
                    .send({ from: userAccount })
                    .then(async (receipt: any) => {
                        // deposit
                        mixrContract.depositToken(assetAddress, tokensToDeposit, {
                            from: userAccount,
                        }).then(() => {
                            this.setState({ transactionStatus: TransactionStatus.Success });
                        }).catch(() => {
                            this.setState({ transactionStatus: TransactionStatus.Fail });
                        });
                    });
            });
        } else {
            // otherwise it's a redeem action
            // get address using of selected token name
            const assetAddress = (
                walletInfo.filter((element) =>
                    element.name.toLowerCase() === selectedAssetExchange.toLowerCase(),
                )[0]
            ).address;
            // define amount
            // TODO: needs to use convertTokenAmount method
            const amountInBasketWei = new BigNumber(tokens * 10 ** 24).toString(10);
            // approve transaction
            mixrContract.approve(
                mixrContract.address,
                amountInBasketWei,
                {
                    from: userAccount,
                },
            ).then(async () => {
                // redeem
                await mixrContract.redeemMIXR(
                    assetAddress,
                    amountInBasketWei,
                    {
                        from: userAccount,
                    },
                );
            });
        }
    }

    /**
     * Render the selection choice after select one option
     */
    private renderSelectionChoice = () => {
        const { selectedAssetCreate, selectedAssetExchange } = this.state;
        if (selectedAssetCreate === '' && selectedAssetExchange === '') {
            return null;
        }
        return <div className="MIXR__selection">
            <p
                className="MIXR-Input__title MIXR-Input__title--vertical-align"
                onClick={this.changeSelection}
            >
                CHANGE SELECTION
            </p>
            <button  className="MIXR__selection-button" onClick={this.confirmTransaction}>CONFIRM</button>
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

    /**
     * Generate data to render assets, according to asset amount and select assets
     * @param assetAmount amount use in exchange (from input)
     * @returns Returns a promise with an array of MIXRComponents
     */
    private generateDataToRenderExchange = async (assetAmount: string): Promise<any[]> => {
        const {
            mixrContract,
            selectedAssetCreate,
            selectedAssetExchange,
            assetSelect,
            walletInfo,
        } = this.state;

        // since this variables can be undefined, let's check their values
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
        const assetsData: IAsset[] = [];
        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        for (const element of walletInfo) {
            if (element.name.toLowerCase() === assetSelect.toLowerCase()) {
                continue;
            }
            let estimatedFee;

            // get selected asset balance
            const assetBalance = (
                walletInfo.filter((wElement) =>
                    wElement.name.toLowerCase() === assetSelect.toLowerCase(),
                )[0]
            ).balance;
            // verify balance
            if (assetBalance < parseInt(assetAmount, 10)) {
                this.setState({ haveValidFunds: false });
                return [];
            }
            // create variables
            let feeType: FeeType;
            let assetAddress: string;
            // if the asset selected is mix
            if (assetSelect.toLowerCase() === 'mix') {
                assetAddress = element.address;
                feeType = FeeType.REDEMPTION;
            } else {
                // if it's a deposit, it's always MIX
                assetAddress = (
                    walletInfo.filter((wElement) =>
                        wElement.name.toLowerCase() === assetSelect.toLowerCase(),
                    )[0]
                ).address;
                feeType = FeeType.DEPOSIT;
            }

            estimatedFee = new BigNumber(
                await mixrContract.estimateFee(
                    assetAddress,
                    mixrContract.address,
                    new BigNumber(parseInt(assetAmount, 10) * 10 ** 18).toString(10),
                    feeType,
                ),
                // TODO: var .env with MIX decimals number
            ).dividedBy(10 ** 24);

            this.setState({ haveValidFunds: true });
            assetsData.push({
                assetName: element.name,
                fee: estimatedFee.toFixed(2),
                receive: new BigNumber(assetAmount).minus(estimatedFee).toFixed(2),
                total: assetAmount,
            });
        }

        if (selectedAssetCreate === '') {
            if (selectedAssetExchange !== '') {
                const element = assetsData.filter((asset) => asset.assetName === selectedAssetExchange)[0];
                assetsMap = [this.mixrAsset(element)];
            } else {
                assetsMap = assetsData.map((element) => {
                    return this.mixrAsset(element);
                });
            }
        }
        return assetsMap;
    }

    /**
     * Render create
     */
    private renderCreate = (assetsMap: any[]) => {
        const node = document.getElementById('renderCreate');
        if (assetsMap.length === 0) {
            ReactDOM.unmountComponentAtNode(node);
            return;
        }
        ReactDOM.render(
            <React.Fragment>
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
            </React.Fragment>, node,
        );
    }

    /**
     * Render exchange
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
