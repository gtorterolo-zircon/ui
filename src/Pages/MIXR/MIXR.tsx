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
    isMixrLoaded: boolean;
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
                        />
                    </div>
                    <div className="MIXR__main">
                        {!isMixing && <StartMixing click={this.startMixing} />}
                        {
                            // tslint:disable-next-line jsx-no-multiline-js
                            isMixing &&
                            <MixingHook
                                mixrContract={mixrContract}
                                walletInfo={walletInfo}
                                IERC20ABI={IERC20ABI}
                                web3={web3}
                                userAccount={userAccount}
                            />
                        }
                    </div>
                    <div className="MIXR__basket-composition" />
                </div>
                { /*this.renderPopUp()*/}
            </div>
        );
    }

    private startMixing = () => {
        this.setState({ isMixing: true });
    }
}

function MixingHook(props: {
    mixrContract: IMIXRContractType,
    walletInfo: IWalletType[],
    IERC20ABI: object,
    web3: IWeb3Type,
    userAccount: string,
}) {
    const [selectedAssetExchange, setSelectedAssetExchange] = useState('');
    const [selectedAssetCreate, setSelectedAssetCreate] = useState('');
    const [assetSelect, setAssetSelect] = useState('default');
    const [assetAmount, setAssetAmount] = useState('');
    const [isMixrLoaded, setIsMixrLoaded] = useState(true);
    const [haveValidFunds, setHaveValidFunds] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.None);
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
     * Handle fields changes
     */
    function handleChange(event: any) {
        setIsMixrLoaded(false);
        if (event.target.name === 'assetAmount') {
            setAssetAmount(event.target.value);
        } else if (event.target.name === 'assetSelect') {
            setAssetSelect(event.target.value);
        }
    }

    /**
     * Fetch max amount for selected asset
     */
    function fetchAssetMax(event: any) {
        const { walletInfo } = props;
        if (assetSelect.length > 0) {
            // get asset max from user's balance
            const max = walletInfo.filter(
                (wallet) => wallet.name.toLowerCase() === assetSelect.toLowerCase(),
            )[0].balance;
            setAssetAmount(max.toString());
        }
        event.preventDefault();
    }

    /**
     * Given asset and amount information, get and render
     * @param amount asset amount to exchange
     * @param asset asset to ecxhange
     */
    function updateAssetsPrice(amount: string, asset: string) {
        generateDataToRenderExchange(amount).then((assetsMap) => {
            if (asset === 'mix') {
                renderCreate([]);
                renderExchange(assetsMap);
                // in case of moving the default selection
            } else if (asset !== 'empty') {
                renderCreate(assetsMap);
                renderExchange([]);
            }
        });
    }

    /**
     * Called when onClick to reset selection
     * Cleans selection variables values
     */
    function changeSelection() {
        setSelectedAssetCreate('');
        setSelectedAssetExchange('');
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
        } = props;

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
                await mixrContract.redeemMIX(
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
    function renderSelectionChoice() {
        if (selectedAssetCreate === '' && selectedAssetExchange === '') {
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
     * Using state variables it renders the asset names in the dropdown
     * @returns The mapped elements into html <option /> tag
     */
    function renderAssets() {
        const { walletInfo } = props;
        const assetName: string[] = [];
        for (const element of walletInfo) {
            assetName.push(element.name);
        }
        return assetName.map((element) => {
            return <option key={element} value={element.toLowerCase()}>{element}</option>;
        });
    }

    function filterAssetHandler(isExchanging: boolean, key: string) {
        if (isExchanging) {
            setSelectedAssetExchange(key);
        } else {
            setSelectedAssetCreate(key);
        }
    }

    /**
     * Generate data to render assets, according to asset amount and select assets
     * @param amount amount use in exchange (from input)
     * @returns Returns a promise with an array of MIXRComponents
     */
    async function generateDataToRenderExchange(amount: string): Promise<any[]> {
        const {
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
        } = props;

        // since this variables can be undefined, let's check their values
        if (assetSelect === 'default' || amount.length < 1) {
            return [];
        }
        const assetBalance = (
            walletInfo.filter((wElement) =>
                wElement.name.toLowerCase() === assetSelect.toLowerCase(),
            )[0]
        ).balance;
        // verify balance
        if (assetBalance < parseInt(amount, 10)) {
            setHaveValidFunds(false);
            return [];
        }
        const mixrDecimals = 24;

        // TODO: remove it!
        let stop: boolean = false;
        let assetsMap: any[] = [];
        const assetsData: IAsset[] = [];
        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        // local variables
        for (const element of walletInfo) {
            if (element.name.toLowerCase() === assetSelect.toLowerCase()) {
                continue;
            }
            let estimatedFee;

            // get selected asset balance
            // create variables
            let feeType: FeeType;
            let assetAddress: string;
            // if the asset selected is mix
            if (assetSelect.toLowerCase() === 'mix') {
                assetAddress = element.address;
                feeType = FeeType.REDEMPTION;
                // if MIXR does not have enough balance, hide the token
                // get contract using abi
                const ERC = new web3.eth.Contract(IERC20ABI, element.address);
                // verify balance
                const balance = new BigNumber(await ERC.methods.balanceOf(mixrContract.address).call());
                if (balance.lt(new BigNumber(amount).multipliedBy(10 ** element.decimals))) {
                    continue;
                }
            } else {
                // if it's a deposit, it's always MIX
                assetAddress = (
                    walletInfo.filter((wElement) =>
                        wElement.name.toLowerCase() === assetSelect.toLowerCase(),
                    )[0]
                ).address;
                feeType = FeeType.DEPOSIT;
                stop = true;
            }

            estimatedFee = new BigNumber(
                await mixrContract.estimateFee(
                    assetAddress,
                    mixrContract.address,
                    new BigNumber(parseInt(amount, 10) * 10 ** element.decimals).toString(10),
                    feeType,
                ),
            ).dividedBy(10 ** mixrDecimals);

            setHaveValidFunds(true);
            assetsData.push({
                assetName: element.name,
                fee: estimatedFee.toFixed(2),
                receive: new BigNumber(amount).minus(estimatedFee).toFixed(2),
                total: amount,
            });
            if (stop) {
                break;
            }
        }

        if (selectedAssetCreate === '') {
            if (selectedAssetExchange !== '') {
                const element = assetsData.filter((asset) => asset.assetName === selectedAssetExchange)[0];
                assetsMap = [mixrAsset(element)];
            } else {
                assetsMap = assetsData.map((element) => {
                    return mixrAsset(element);
                });
            }
        }
        return assetsMap;
    }

    /**
     * Render create
     */
    function renderCreate(assetsMap: any[]) {
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
        setIsMixrLoaded(true);
    }

    /**
     * Render exchange
     */
    function renderExchange(assetsMap: any[]) {
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
        setIsMixrLoaded(true);
    }

    function renderWarningBalance() {
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
    function mixrAsset(asset: IAsset) {
        return <MIXRAsset
            key={asset.assetName}
            assetName={asset.assetName}
            receive={asset.receive}
            fee={asset.fee}
            total={asset.total}
            // tslint:disable-next-line jsx-no-lambda
            click={() => filterAssetHandler(true, asset.assetName)}
        />;
    }

    function renderChoices() {
        const {
            mixrContract,
            walletInfo,
            IERC20ABI,
            web3,
            userAccount,
        } = props;
        if (assetAmount.length < 1) {
            return null;
        }
        if (assetSelect === 'mixr') {
            return <MixingExchangeHook />;
        } else if (assetSelect !== 'default') {
            return <MixingCreateHook
                mixrContract={mixrContract}
                walletInfo={walletInfo}
                IERC20ABI={IERC20ABI}
                web3={web3}
                userAccount={userAccount}
                inputAmount={assetAmount}
            />;
        } else {
            return null;
        }
    }

    return (
        <React.Fragment>
            <div className="MIXR-Input">
                <p className="MIXR-Input__title">CREATE NEW MIX TOKEN OR EXCHANGE STABLECOINS</p>

                <form className="MIXR-Input__grid">
                    <div className="MIXR-Input__coin-amount-container">
                        <select
                            className="MIXR-Input__name-amount"
                            name="assetSelect"
                            placeholder="Select Coin To Convert"
                            value={assetSelect}
                            onChange={handleChange}
                        >
                            <option disabled={true} value="default">Select Coin To Convert</option>
                            {renderAssets()}
                        </select>
                        <button className="MIXR-Input__down-button" >
                            <img src={DropDownButton} />
                        </button>
                    </div>
                    <div className="MIXR-Input__coin-amount-container">
                        <input
                            className="MIXR-Input__coin-amount"
                            autoComplete="off"
                            placeholder="Send Amount"
                            type="text"
                            name="assetAmount"
                            value={assetAmount}
                            onChange={handleChange}
                        />
                        <button
                            onClick={fetchAssetMax}
                            className="MIXR-Input__max-button"
                        >
                            <img src={MaxButton} />
                        </button>
                    </div>
                </form>
            </div>
            {renderWarningBalance()}
            {renderChoices()}
            {renderSelectionChoice()}
        </React.Fragment>
    );
}

function MixingCreateHook(props: {
    mixrContract: IMIXRContractType,
    walletInfo: IWalletType[],
    IERC20ABI: object,
    web3: IWeb3Type,
    userAccount: string,
    inputAmount: string,
}) {
    const [haveValidFunds, setHaveValidFunds] = useState(true);
    const [selectedAssetToTranfer, setSelectedAssetToTranfer] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.None);
    const [isMixrLoaded, setIsMixrLoaded] = useState(false);
    const assetsToExchange: Map<string, IAsset> = new Map();
    const promisesFeesToLoad: [Promise<{ address: string, fee: Promise<number> }>] = [true as any];
    let loading = true;

    useEffect(() => {
        // typescript is a bit stupid and I need to add something to the array
        // since I don't use it, I will also remove it. You bastard!
        promisesFeesToLoad.pop();
    });

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
        } = props;

        const assetBalance = (
            walletInfo.filter((wElement) => wElement.name.toLowerCase() === 'mix')[0]
        ).balance;
        // let's make sure it's empty
        assetsToExchange.clear();
        // verify balance
        if (assetBalance < parseInt(amount, 10)) {
            setHaveValidFunds(false);
            return [];
        } else if (haveValidFunds === false) {
            setHaveValidFunds(true);
        }

        // if mix is selected, the user is redeeming
        // if any other select, is because it's a deposit
        // local variables
        for (const element of walletInfo) {
            if (element.name.toLowerCase() === 'mix') {
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
                        const assetsMap: any[] = [];
                        assetsToExchange.forEach((assetEach: IAsset) => assetsMap.push(mixrAsset(assetEach)));
                        ReactDOM.render(<React.Fragment>{assetsMap}</React.Fragment>, node);
                    }
                });
            });
            // save in a map
            assetsToExchange.set(element.address, {
                assetName: element.name,
                fee: '0',
                receive: '0',
                total: amount,
            });
        }
    }

    function renderCreate() {
        const { inputAmount } = props;
        const assetsMap: any[] = [];
        if (loading) {
            generateDataToRenderExchange(inputAmount);
            loading = false;
        }
        if (assetsToExchange.size === 0) {
            return;
        }
        // map it to html
        assetsToExchange.forEach((element: IAsset) => assetsMap.push(mixrAsset(element)));
        return <React.Fragment>
            <div className="MIXR-New-Token">
                <p className="MIXR-New-Token__title">
                    CREATE
                        <span className="MIXR-New-Token__title--light"> NEW MIX TOKEN</span>
                </p>
            </div>
            <div id="assetsList">
                <React.Fragment>
                    {assetsMap}
                </React.Fragment>
            </div>
        </React.Fragment>;
    }

    /**
     * Called when onClick to reset selection
     * Cleans selection variables values
     */
    function changeSelection() {
        setSelectedAssetToTranfer('');
    }

    /**
     * Method called when onClick from confirm button transaction
     */
    function confirmTransaction() {
        const {
            mixrContract,
            walletInfo,
            userAccount,
            inputAmount,
        } = props;
        // TODO: get real decimals from system maybe mixr from .env file
        const tokens = parseInt(inputAmount, 10);
        const mixrDecimals = 24;
        // otherwise it's a redeem action
        // get address using of selected token name
        const assetAddress = (
            walletInfo.filter((element) =>
                element.name.toLowerCase() === selectedAssetToTranfer.toLowerCase(),
            )[0]
        ).address;
        // define amount
        // TODO: needs to use convertTokenAmount method
        const amountInBasketWei = new BigNumber(tokens * 10 ** mixrDecimals).toString(10);
        // approve transaction
        mixrContract.approve(
            mixrContract.address,
            amountInBasketWei,
            {
                from: userAccount,
            },
        ).then(async () => {
            // redeem
            await mixrContract.redeemMIX(
                assetAddress,
                amountInBasketWei,
                {
                    from: userAccount,
                },
            );
        });
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

    return (
        <React.Fragment>
            <div className="MIXR-Input__title--big" hidden={isMixrLoaded}>Loading...</div>
            {renderCreate()}
            {renderSelectionChoice()}
        </React.Fragment>
    );
}

function MixingExchangeHook(props: any) {
    return (<p>I</p>);
}

export default MIXR;
