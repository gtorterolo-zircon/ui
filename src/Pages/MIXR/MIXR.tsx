import BigNumber from 'bignumber.js';
import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createLogger, format, transports } from 'winston';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { FeeType, IBlockchainState, IMIXRContractType, IWalletType, IWeb3Type } from '../../Common/CommonInterfaces';
import MIXRAsset from '../../Components/MIXR-Asset/MIXR-Asset';
import Navbar from '../../Components/Navbar/Navbar';
import Wallet from '../../Components/Wallet/Wallet';

import warningLogo from '../../Assets/img/invalid-name.svg';
import StartMixing from '../../Components/StartMixing/StartMixing';

import Popup from '../../Components/Popup/Popup';

import MaxButton from '../../Assets/img/button-max.svg';
import DropDownButton from '../../Assets/img/dropdown-button.svg';
import whiteDropDownButton from '../../Assets/img/wallet-icons/dropdown-arrow.svg';

import './MIXR.css';
import { render } from 'react-dom';

let rightDepositSelect = '';
let inputAmountAssetGlobal = '';
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
    isMixrLoaded: boolean;
    transactionStatus: TransactionStatus;
    clickDepositButton: string;
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
            clickDepositButton: 'default',
            haveValidFunds: true,
            isMixing: true,
            isMixrLoaded: true,
            selectedAssetCreate: '',
            selectedAssetExchange: '',
            transactionStatus: TransactionStatus.None,

        };
    }

    /**
     * @ignore
     */
    public componentWillMount() {
        logger.info('[START] componentWillMount');
        BlockchainGeneric.onLoad().then((result) => {
            this.setState({
                IERC20ABI: result.IERC20ABI,
                mixrContract: result.mixrContract,
                userAccount: result.userAccount,
                walletInfo: result.walletInfo,
                web3: result.web3,
            });
        });
        logger.info('[END] componentWillMount');
    }

    /**
     * @ignore
     */
    public render() {
        const {
            isMixing,
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
            userAccount,
            clickDepositButton,
        } = this.state;
        if (
            mixrContract === undefined ||
            walletInfo === undefined ||
            IERC20ABI === undefined ||
            web3 === undefined ||
            userAccount === undefined
        ) {
            return null;
        }
        let mixingHookeRender;
        if (isMixing) {
            mixingHookeRender = <Mixing
                mixrContract={mixrContract}
                walletInfo={walletInfo}
                IERC20ABI={IERC20ABI}
                web3={web3}
                userAccount={userAccount}
                selectedAssetFromWallet={clickDepositButton.toLowerCase()}
            />;
        }
        return (
            <div className="MIXR">
                <Navbar />
                <div className="MIXR__grid">
                    <div className="MIXR__wallet">
                        <Wallet
                            IERC20ABI={IERC20ABI}
                            mixrContract={mixrContract}
                            userAccount={userAccount}
                            walletInfo={walletInfo}
                            web3={web3}
                            assetClick={this.assetWalletClickHandler}
                        />
                    </div>
                    <div className="MIXR__main">
                        {!isMixing && <StartMixing click={this.startMixing} />}
                        {
                            // tslint:disable-next-line jsx-no-multiline-js
                            isMixing && mixingHookeRender
                        }
                    </div>
                    <div className="MIXR__basket-composition" />
                </div>
            </div>
        );
    }

    /**
     * start mixing! \o/
     */
    private startMixing = () => {
        this.setState({ isMixing: true });
    }

    /**
     * handle to clicks from wallet
     */
    private assetWalletClickHandler = (event: any) => {
        this.setState({ clickDepositButton: event.target.dataset.id, isMixing: true });
        event.preventDefault();
    }

}

interface IMixingProps {
    mixrContract: IMIXRContractType;
    walletInfo: IWalletType[];
    IERC20ABI: object;
    web3: IWeb3Type;
    userAccount: string;
    selectedAssetFromWallet: string;
}
interface IMixingState {
    assetAmount: string;
    typingAssetAmount: boolean;
    assetSelect: string;
    dropdownOpen: boolean;
    haveValidFunds: boolean;
    isMixrLoaded: boolean;
}
// tslint:disable-next-line max-classes-per-file
class Mixing extends Component<IMixingProps, IMixingState> {

    constructor(props: any) {
        super(props);
        this.state = {
            assetAmount: '',
            assetSelect: this.props.selectedAssetFromWallet,
            dropdownOpen: false,
            haveValidFunds: true,
            isMixrLoaded: true,
            typingAssetAmount: false,
        };
    }

    /**
     * After the component is built and is updated!
     */
    public componentDidUpdate(prevProps: IMixingProps, prevState: IMixingState, snapshot: any) {
        if (prevProps.selectedAssetFromWallet !== this.props.selectedAssetFromWallet) {
            this.setState({ assetSelect: this.props.selectedAssetFromWallet });
        }
    }

    /**
     * Handle fields changes
     */
    public handleChange = (event: any) => {
        if (event.target.name === 'assetAmount') {
            inputAmountAssetGlobal = event.target.value;
            this.setState({ assetAmount: event.target.value, typingAssetAmount: true });
            setTimeout((newAssetAmount: string) => {
                if (inputAmountAssetGlobal === newAssetAmount) {
                    this.setState({ typingAssetAmount: false });
                }
            }, 500, event.target.value);
        }
    }

    /**
     * handle select asset
     */
    public handleSelectAsset = (event: any) => {
        const tag = event.currentTarget.dataset.tag;
        this.setState({ assetSelect: tag, dropdownOpen: false });
    }

    /**
     * Fetch max amount for selected asset
     */
    public fetchAssetMax = (event: any) => {
        const { walletInfo } = this.props;
        const { assetSelect } = this.state;
        if (assetSelect.length > 0) {
            // get asset max from user's balance
            const max = walletInfo.filter(
                (wallet) => wallet.symbol.toLowerCase() === assetSelect.toLowerCase(),
            )[0].balance;
            this.setState({ assetAmount: max.toString() });
        }
        event.preventDefault();
    }

    /**
     * Using state variables it renders the asset names in the dropdown
     * @returns The mapped elements into html <li /> tag
     */
    public renderAssets = () => {
        const { walletInfo } = this.props;
        return walletInfo.map((element) => {
            const assetLogo = BlockchainGeneric.getTokensLogo()
                .filter((e) => e.symbol.toLowerCase() === element.symbol.toLowerCase())[0].logo;
            return (
                <li
                    key={element.symbol.toLowerCase()}
                    data-tag={element.symbol.toLowerCase()}
                    onClick={this.handleSelectAsset}
                    className="MIXR-Dropdown__item"
                >
                    <div className="MIXR-Dropdown__item-inner">
                        <img className="MIXR-Dropdown__item-image" src={assetLogo} />
                        <p className="MIXR-Dropdown__item-content--bold">{element.symbol}</p>
                        <p className="MIXR-Dropdown__item-content">{element.name}</p>
                    </div>
                </li>
            );
        });
    }

    /**
     * render warning balance, returning html
     */
    public renderWarningBalance = () => {
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
     * render choices depending on either if it's mix or others
     */
    public renderChoices = () => {
        const {
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
            userAccount,
        } = this.props;
        const {
            assetAmount,
            assetSelect,
            haveValidFunds,
            typingAssetAmount,
        } = this.state;
        if (assetAmount === undefined || assetAmount.length < 1) {
            return null;
        }
        const currentBalance = walletInfo.filter(
            (e) => e.symbol.toLowerCase() === assetSelect.toLowerCase(),
        )[0].balance;
        const invalidBalance = parseInt(assetAmount, 10) > currentBalance;
        if (invalidBalance && haveValidFunds === true) {
            this.setState({ haveValidFunds: false });
        } else if (invalidBalance === false && haveValidFunds === false) {
            this.setState({ haveValidFunds: true });
        } else {
            if (assetSelect === 'mix') {
                return <MixingCreateHook
                    mixrContract={mixrContract}
                    walletInfo={walletInfo}
                    IERC20ABI={IERC20ABI}
                    web3={web3}
                    userAccount={userAccount}
                    inputAmount={assetAmount}
                    typingAssetAmount={typingAssetAmount}
                />;
            } else if (assetSelect !== 'default') {
                return <MixingExchangeHook
                    mixrContract={mixrContract}
                    walletInfo={walletInfo}
                    IERC20ABI={IERC20ABI}
                    web3={web3}
                    userAccount={userAccount}
                    inputAmount={assetAmount}
                    assetSelect={assetSelect}
                />;
            } else {
                return null;
            }
        }
    }

    /**
     * toogle dropdown menu
     */
    public toggleDropdown = (event: any) => {
        const { dropdownOpen } = this.state;
        this.setState({ dropdownOpen: (dropdownOpen ? false : true) });
    }

    /**
     * render assets for dropdown
     */
    public renderSelectedAsset = () => {
        const { assetSelect } = this.state;
        if (assetSelect === 'default') {
            return 'Select Coin To Convert';
        } else {
            const assetToRender = this.props.walletInfo.filter((e) => e.symbol.toLowerCase() === assetSelect)[0];
            const assetLogo = BlockchainGeneric.getTokensLogo()
                .filter((e) => e.symbol.toLowerCase() === assetSelect.toLowerCase())[0].logo;
            return (
                <div className="MIXR-Dropdown__item-inner--no-margin">
                    <img className="MIXR-Dropdown__item-image" src={assetLogo} />
                    <p className="MIXR-Dropdown__item-content--bold">{assetToRender.symbol}</p>
                    <p className="MIXR-Dropdown__item-content">{assetToRender.name}</p>
                </div>
            );
        }
    }

    /**
     * @ignore
     */
    public render() {
        const { dropdownOpen, assetAmount } = this.state;
        return (
            <React.Fragment>
                <div className="MIXR-Input">
                    <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                    <form className="MIXR-Input__grid">
                        <div className="MIXR-Input__coin-amount-container">
                            <div className="MIXR-Input__name-amount" onClick={this.toggleDropdown}>
                                {this.renderSelectedAsset()}
                                <div className="MIXR-Input__down-button" onClick={this.toggleDropdown}>
                                    <img onClick={this.toggleDropdown} src={DropDownButton} />
                                </div>
                            </div>
                            <ul className="MIXR-Dropdown" hidden={dropdownOpen === false}>
                                <li className="MIXR-Dropdown-first-item">
                                    <img className="MIXR-Dropdown-image" src={whiteDropDownButton} />
                                </li>
                                {this.renderAssets()}
                            </ul>
                        </div>
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
                {this.renderChoices()}
                {this.renderWarningBalance()}
            </React.Fragment>
        );
    }
}

interface IMixingCreateHookProps {
    mixrContract: IMIXRContractType;
    walletInfo: IWalletType[];
    IERC20ABI: object;
    web3: IWeb3Type;
    userAccount: string;
    inputAmount: string;
    typingAssetAmount: boolean;
}
interface IMixingCreateHookState {
    selectedAssetToTranfer: string;
    transactionStatus: TransactionStatus;
    isMixrLoaded: boolean;
    inputValue: string;
    assetsToExchange: Map<string, IAsset>;
}
// tslint:disable-next-line max-classes-per-file
class MixingCreateHook extends Component<IMixingCreateHookProps, IMixingCreateHookState> {
    private promisesFeesToLoad: [Promise<{ address: string, fee: Promise<number>, input: string }>] = [true as any];

    constructor(props: any) {
        super(props);
        this.state = {
            assetsToExchange: new Map(),
            inputValue: this.props.inputAmount,
            isMixrLoaded: true,
            selectedAssetToTranfer: '',
            transactionStatus: TransactionStatus.None,
        };
        // typescript is a bit stupid and I need to add something to the array
        // since I don't use it, I will also remove it. You bastard!
        this.promisesFeesToLoad.pop();
    }

    public componentDidMount() {
        this.generateDataToRenderExchange(this.props.inputAmount);
    }

    public componentDidUpdate(prevProps: IMixingCreateHookProps, prevState: IMixingCreateHookState, snapshot: any) {
        if (prevProps.typingAssetAmount !== this.props.typingAssetAmount &&
            this.props.typingAssetAmount === false) {
                if (prevProps.inputAmount !== this.state.inputValue) {
                    this.generateDataToRenderExchange(this.props.inputAmount);
                    this.setState({ inputValue: this.props.inputAmount });
                }
        }
    }

    /**
     * Close transaction related pop up
     */
    public closePopUp = () => {
        this.setState({ transactionStatus: TransactionStatus.None });
    }

    /**
     * Renders popup according to component state
     */
    public renderPopUp = () => {
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

    public filterAssetHandler = (key: string) => {
        this.setState({ selectedAssetToTranfer: key });
    }

    /**
     * Renders a MIXR assets using the given information of the parameter
     * It will render a MIXRAsset component. See the component for more info.
     * @param asset asset info being rendered
     * @returns a MIXRAsset to be put in html
     */
    public mixrAsset = (asset: IAsset) => {
        return <MIXRAsset
            key={asset.assetName}
            assetName={asset.assetName}
            receive={(asset.receive === '0') ? ('...') : (asset.receive)}
            fee={(asset.fee === '0') ? ('...') : (asset.fee)}
            total={asset.total}
            // tslint:disable-next-line jsx-no-lambda
            click={() => this.filterAssetHandler(asset.assetName)}
        />;
    }

    /**
     * Generate data to render assets, according to asset amount and select assets
     * @param amount amount use in exchange (from input)
     * @returns Returns a promise with an array of MIXRComponents
     */
    public generateDataToRenderExchange = (amount: string) => {
        const {
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
        } = this.props;

        // let's make sure it's empty
        const assetsToGenerate: Map<string, IAsset> = new Map();
        this.promisesFeesToLoad = [] as any;

        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        // local variables
        for (const element of walletInfo) {
            if (element.symbol.toLowerCase() === 'mix') {
                continue;
            }
            // get selected asset balance
            // create variables
            let feeType: FeeType;
            let assetAddress: string;
            // if the asset selected is mix
            assetAddress = element.address;
            feeType = FeeType.REDEMPTION;
            // if MIXR does not have enough balance, hide the token
            // get contract using abi
            const ERC = new web3.eth.Contract(IERC20ABI, element.address);
            // verify balance
            if (element.mixrBalance.lt(new BigNumber(amount).multipliedBy(10 ** element.decimals))) {
                continue;
            }
            // estimate fee (it's async, so we will save it in an array and load async)
            const estimatedFee = mixrContract.estimateFee(
                assetAddress,
                mixrContract.address,
                new BigNumber(parseInt(amount, 10) * 10 ** element.decimals).toString(10),
                feeType,
            );
            // save promises and then async
            this.promisesFeesToLoad.push(
                Promise.resolve(
                    {
                        address: element.address,
                        fee: estimatedFee,
                        input: amount,
                    }),
            );
            // save in a map
            assetsToGenerate.set(element.address, {
                assetName: element.symbol,
                fee: '0',
                receive: '0',
                total: amount,
            });
        }
        this.setState({ assetsToExchange: assetsToGenerate, isMixrLoaded: true });
        // wait from them all
        Promise.all(this.promisesFeesToLoad).then(async (feeForToken) => {
            const localAssets = assetsToGenerate;
            // tslint:disable-next-line prefer-for-of
            for (let x = 0; x < feeForToken.length; x += 1) {
                const asset = localAssets.get(feeForToken[x].address);
                if (asset !== undefined && asset.fee === '0') {
                    const fee = new BigNumber(await feeForToken[x].fee).dividedBy(10 ** 24);
                    if (inputAmountAssetGlobal !== feeForToken[x].input) {
                        continue;
                    }
                    asset.fee = fee.toFixed(2);
                    asset.receive = new BigNumber(asset.total).minus(asset.fee).toFixed(2);
                    localAssets.set(feeForToken[x].address, asset);
                }
            }
            if (feeForToken.length > 1 && inputAmountAssetGlobal === feeForToken[0].input) {
                this.setState({ assetsToExchange: localAssets, isMixrLoaded: false });
            }
        });
    }

    public renderCreate = () => {
        const { assetsToExchange } = this.state;
        const assetsMap: any[] = [];
        assetsToExchange.forEach((element: IAsset) => assetsMap.push(this.mixrAsset(element)));
        return <React.Fragment>
            <div className="MIXR-New-Token">
                <p className="MIXR-New-Token__title">
                    CREATE
                        <span className="MIXR-New-Token__title--light"> NEW MIX TOKEN</span>
                </p>
            </div>
            <div id="assetsList">
                {
                    // tslint:disable-next-line jsx-no-multiline-js
                    assetsToExchange.size === 0
                        ? <div className="MIXR-Input__title">Not enought tokens available in MIXR!</div>
                        : assetsMap
                }
            </div>
        </React.Fragment >;
    }

    /**
     * Called when onClick to reset selection
     * Cleans selection variables values
     */
    public changeSelection = () => {
        this.setState({ selectedAssetToTranfer: '' });
    }

    /**
     * Method called when onClick from confirm button transaction
     */
    public confirmTransaction = () => {
        const {
            mixrContract,
            walletInfo,
            userAccount,
        } = this.props;
        const {
            inputValue,
            selectedAssetToTranfer,
        } = this.state;
        // otherwise it's a redeem action
        // get address using of selected token name
        const assetAddress = (
            walletInfo.filter((element) =>
                element.symbol.toLowerCase() === selectedAssetToTranfer.toLowerCase(),
            )[0]
        ).address;
        // define amount
        // TODO: needs to use convertTokenAmount method
        const amountInBasketWei = new BigNumber(inputValue).multipliedBy(10 ** 24).toString(10);
        // approve transaction
        mixrContract.approve(
            mixrContract.address,
            amountInBasketWei,
            {
                from: userAccount,
            },
        ).then(async () => {
            // redeem
            this.setState({ transactionStatus: TransactionStatus.Pending });
            mixrContract.redeemMIX(
                assetAddress,
                amountInBasketWei,
                {
                    from: userAccount,
                },
            ).then(() => {
                this.setState({ transactionStatus: TransactionStatus.Success });
            }).catch(() => {
                this.setState({ transactionStatus: TransactionStatus.Fail });
            });
        });
    }

    /**
     * Render the selection choice after select one option
     */
    public renderSelectionChoice = () => {
        const { selectedAssetToTranfer } = this.state;
        if (selectedAssetToTranfer === '') {
            return null;
        }
        return <div className="MIXR__selection">
            <p
                className="MIXR-Input__title MIXR-Input__title--vertical-align"
                onClick={this.changeSelection}
            >
                CHANGE SELECTION
            </p>
            <button className="MIXR__selection-button" onClick={this.confirmTransaction}>CONFIRM</button>
        </div>;
    }

    public render() {
        return (
            <React.Fragment>
                {this.renderCreate()}
                {this.renderSelectionChoice()}
                {this.renderPopUp()}
            </React.Fragment>
        );
    }
}

function MixingExchangeHook(props: {
    mixrContract: IMIXRContractType,
    walletInfo: IWalletType[],
    IERC20ABI: object,
    web3: IWeb3Type,
    userAccount: string,
    inputAmount: string,
    assetSelect: string,
}) {
    const [selectedAssetToTranfer, setSelectedAssetToTranfer] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.None);
    const assetsToExchange: Map<string, IAsset> = new Map();
    const promisesFeesToLoad: [Promise<{ address: string, fee: Promise<number> }>] = [true as any];
    let loading = true;

    /**
     * Close transaction related pop up
     */
    function closePopUp() {
        setTransactionStatus(TransactionStatus.None);
    }

    /**
     * Renders popup according to component state
     */
    function renderPopUp() {
        switch (transactionStatus) {
            case TransactionStatus.Pending:
                return <Popup status="inProgess" clickClose={closePopUp} />;
            case TransactionStatus.Success:
                return <Popup status="success" clickClose={closePopUp} />;
            case TransactionStatus.Fail:
                return <Popup status="error" clickClose={closePopUp} />;
        }
    }

    /**
     * Method called when onClick from confirm button transaction
     */
    function confirmTransaction() {
        const {
            mixrContract,
            walletInfo,
            userAccount,
            IERC20ABI,
            web3,
            inputAmount,
            assetSelect,
        } = props;

        // TODO: get real decimals from system maybe mixr from .env file
        const tokens = parseInt(inputAmount, 10);
        // if I click in MIX is because I'm doing a deposit
        // get address using selected token name
        const assetAddress = (
            walletInfo.filter((element) =>
                element.symbol.toLowerCase() === assetSelect.toLowerCase(),
            )[0]
        ).address;
        // get contract using abi
        const ERC = new web3.eth.Contract(IERC20ABI, assetAddress);
        // define amounts
        const tokensToDeposit = new BigNumber(10 ** 18).multipliedBy(tokens).toString(10);
        // const MIXToMint = new BigNumber(10).pow(mixrDecimals).multipliedBy(tokens);
        // approve token
        ERC.methods.approve(mixrContract.address, tokensToDeposit)
            .send({ from: userAccount })
            .then(() => {
                setTransactionStatus(TransactionStatus.Pending);
                // deposit
                mixrContract.depositToken(assetAddress, tokensToDeposit, {
                    from: userAccount,
                }).then(() => {
                    setTransactionStatus(TransactionStatus.Success);
                }).catch(() => {
                    setTransactionStatus(TransactionStatus.Fail);
                });
            });
    }

    /**
     * Called when onClick to reset selection
     * Cleans selection variables values
     */
    function changeSelection() {
        setSelectedAssetToTranfer('');
    }

    /**
     * Render the selection choice after select one option
     */
    function renderSelectionChoice() {
        if (selectedAssetToTranfer === '') {
            return null;
        }
        return <div className="MIXR__selection">
            <p
                className="MIXR-Input__title MIXR-Input__title--vertical-align"
                onClick={changeSelection}
            >
                CHANGE SELECTION
            </p>
            <button className="MIXR__selection-button" onClick={confirmTransaction}>CONFIRM</button>
        </div>;
    }

    /**
     * Generate data to render assets, according to asset amount and select assets
     * @param amount amount use in exchange (from input)
     * @returns Returns a promise with an array of MIXRComponents
     */
    function generateDataToRenderExchange(amount: string) {
        const {
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
            assetSelect,
        } = props;

        const assetBalance = (
            walletInfo.filter((wElement) =>
                wElement.symbol.toLowerCase() === assetSelect.toLowerCase(),
            )[0]
        ).balance;
        // let's make sure it's empty
        assetsToExchange.clear();
        // verify balance
        if (assetBalance < parseInt(amount, 10)) {
            return [];
        }

        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        // local variables
        for (const element of walletInfo) {
            if (element.symbol.toLowerCase() === assetSelect.toLowerCase()) {
                continue;
            }
            // get selected asset balance
            // create variables
            let feeType: FeeType;
            let assetAddress: string;
            // if the asset selected is mix
            assetAddress = (
                walletInfo.filter((wElement) =>
                    wElement.symbol.toLowerCase() === assetSelect.toLowerCase(),
                )[0]
            ).address;
            feeType = FeeType.DEPOSIT;
            // estimate fee (it's async, so we will save it in an array and load async)
            const estimatedFee = mixrContract.estimateFee(
                assetAddress,
                mixrContract.address,
                new BigNumber(parseInt(amount, 10) * 10 ** 18).toString(10),
                feeType,
            );
            // save promises and then async
            promisesFeesToLoad.push(
                Promise.resolve(
                    {
                        address: element.address,
                        fee: estimatedFee,
                    }),
            );
            // wait from them all
            Promise.all(promisesFeesToLoad).then((result) => {
                result.forEach(async (feeForToken) => {
                    const asset = assetsToExchange.get(feeForToken.address);
                    if (asset !== undefined && asset.fee === '0') {
                        const fee = new BigNumber(await feeForToken.fee).dividedBy(10 ** 24);
                        asset.fee = fee.toFixed(2);
                        asset.receive = new BigNumber(asset.total).minus(asset.fee).toFixed(2);
                        assetsToExchange.set(feeForToken.address, asset);
                        //
                        const node = document.getElementById('assetsList');
                        if (node === null) {
                            return;
                        }
                        const assetsMap: any[] = [];
                        assetsToExchange.forEach((assetEach: IAsset) => assetsMap.push(mixrAsset(assetEach)));
                        ReactDOM.render(<React.Fragment>{assetsMap}</React.Fragment>, node);
                    }
                });
            });
            // save in a map
            assetsToExchange.set(element.address, {
                assetName: element.symbol,
                fee: '0',
                receive: '0',
                total: amount,
            });
            break;
        }
        if (assetsToExchange.size === 0) {
            const node = document.getElementById('assetsList');
            if (node === null) {
                return;
            }
            ReactDOM.unmountComponentAtNode(node);
        }
    }

    function filterAssetHandler(key: string) {
        setSelectedAssetToTranfer(key);
    }

    /**
     * Renders a MIXR assets using the given information of the parameter
     * It will render a MIXRAsset component. See the component for more info.
     * @param asset asset info being rendered
     * @returns a MIXRAsset to be put in html
     */
    function mixrAsset(asset: IAsset) {
        return <MIXRAsset
            key={asset.assetName}
            assetName={asset.assetName}
            receive={(asset.receive === '0') ? ('...') : (asset.receive)}
            fee={(asset.fee === '0') ? ('...') : (asset.fee)}
            total={asset.total}
            // tslint:disable-next-line jsx-no-lambda
            click={() => filterAssetHandler(asset.assetName)}
        />;
    }

    /**
     * Render exchange
     */
    function renderExchange() {
        const { inputAmount } = props;
        if (loading) {
            generateDataToRenderExchange(inputAmount);
            loading = false;
        }
        return <React.Fragment>
            {/* stablecoin title */}
            <p className="MIXR-New-Token__title MIXR-New-Token__title--padding-top">
                EXCHANGE
                <span className="MIXR-New-Token__title--light"> FOR STABLECOIN</span>
            </p>
            {/* mixr asset component */}
            <div id="assetsList" />
        </React.Fragment>;
    }

    return (
        <React.Fragment>
            {renderExchange()}
            {renderSelectionChoice()}
            {renderPopUp()}
        </React.Fragment>
    );
}

export default MIXR;
