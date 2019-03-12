import BigNumber from 'bignumber.js';
import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, IMIXRContractType, FeeType } from '../../Common/CommonInterfaces';

import Navbar from '../../Components/Navbar/Navbar';

import './Admin.css';


/**
 * Enum to define action type
 */
enum TypeAction {
    None = 0,
    RegisterToken = 1,
    SetTargetProportion = 2,
    setBaseFee = 3,
}
/**
 * Admin Interface
 */
interface IAdmin extends IBlockchainState {
    action: TypeAction;
    isGovernor: boolean;
}
/**
 * Class Admin
 * @dev This is the skeleton for W13, also known as Special Wallet
 * It's main objective is to handle governators requests.
 */
class Admin extends Component<{}, IAdmin> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            action: TypeAction.SetTargetProportion,
            isGovernor: false,
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
            if (
                result.userAccount === undefined ||
                result.whitelistContract === undefined ||
                result.mixrContract === undefined
            ) {
                return;
            }
            result.whitelistContract.isGovernor(result.userAccount).then((isGovernor) => {
                this.setState({ isGovernor });
                if (isGovernor) {
                    this.updateRegisteredTokens();
                }
            });
        });
    }

    /**
     * @ignore
     */
    public render() {
        const {
            mixrContract,
            userAccount,
            action,
            isGovernor,
            web3,
        } = this.state;
        if (
            userAccount === undefined ||
            mixrContract === undefined ||
            web3 === undefined ||
            isGovernor === undefined
        ) {
            return null;
        }
        if (isGovernor === true) {
            return <p>You are not allowed!</p>;
        }
        let actionRender = null;
        switch (action) {
            case TypeAction.RegisterToken:
                actionRender = <RegisterTokensHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                />;
                break;
            case TypeAction.SetTargetProportion:
                actionRender = <SetTargetProportionHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                />;
                break;
            case TypeAction.setBaseFee:
                actionRender = <SetBaseFeeHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                    web3={web3}
                />;
                break;
        }
        return (
            <div className="Admin">
                <Navbar />
                <div className="Admin__grid">
                    <div className="Admin__main">
                        <ul>
                            <li
                                className="Admin-Input__title Admin-Input__title--big"
                                data-id="addErc20StableCoin"
                                onClick={this.handleClick}
                            >
                                Add ERC20 StableCoin
                            </li>
                            <li
                                className="Admin-Input__title Admin-Input__title--big"
                                data-id="setTargetProportion"
                                onClick={this.handleClick}
                            >
                                Set Target Proportion
                            </li>
                            <li
                                className="Admin-Input__title Admin-Input__title--big"
                                data-id="setBaseFee"
                                onClick={this.handleClick}
                            >
                                Set Base Fee
                            </li>
                        </ul>
                    </div>
                    <div className="Admin__main">
                        <div>
                            {actionRender}
                            <p
                            className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding">
                                TOKEN ADDRESSES
                            </p>
                            <ul id="tokensList" />
                        </div>
                    </div>
                    <div />
                </div>

            </div>
        );
    }

    private handleClick = (event: any) => {
        const actionId = event.target.dataset.id;
        alert(actionId);
        switch (actionId) {
            case 'addErc20StableCoin':
                this.setState({ action: TypeAction.RegisterToken });
                break;
            case 'setTargetProportion':
                this.setState({ action: TypeAction.SetTargetProportion });
                break;
            case 'setBaseFee':
                this.setState({ action: TypeAction.setBaseFee });
                break;
        }
        event.preventDefault();
    }

    /**
     * Update registered tokens.
     */
    private updateRegisteredTokens = () => {
        const { mixrContract } = this.state;
        if (mixrContract === undefined) {
            return;
        }
        mixrContract.getRegisteredTokens().then((tokens) => {
            const tokenMap = tokens[0];
            const tokenElements = tokenMap.map((token) => <li className="Admin-Input__title Admin-Input__title--padding" key={token}>{token}</li>);
            ReactDOM.render(tokenElements, document.getElementById('tokensList'));
        });
    }
}

/**
 * React Hook to handle token registry
 * @param props Properties sent to hook
 */
function RegisterTokensHook(props: any) {
    const [erc20Address, setErc20Address] = useState('');
    const [erc20Name, setErc20Name] = useState('');
    const [erc20Decimals, setErc20Decimals] = useState('');

    useEffect(() => {
        //
    });

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        if (event.target.name === 'erc20Address') {
            setErc20Address(event.target.value);
        } else if (event.target.name === 'erc20Name') {
            setErc20Name(event.target.value);
        } else if (event.target.name === 'erc20Decimals') {
            setErc20Decimals(event.target.value);
        }
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const { mixrContract, userAccount } = props;
        if (mixrContract === undefined) {
            return;
        }
        mixrContract.registerDetailedToken(erc20Address, {
            from: userAccount,
        }).then(() => {
            console.log('registered!');
        });
        event.preventDefault();
    }

    /**
     * @ignore
     */
    return (
        <React.Fragment>
            <p className="Admin-Input__title Admin-Input__title--big">ADD ERC20 STABLECOIN</p>
            <form onSubmit={handleSubmit}>
                <div className="Admin__inputs-grid">

                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">ADDRESS</p>
                        <input
                            className="Admin__input-approvals"
                            type="text"
                            placeholder="Address"
                            name="erc20Address"
                            value={erc20Address}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">NAME</p>
                        <input
                            className="Admin__input-approvals"
                            type="text"
                            placeholder="Name"
                            name="erc20Name"
                            value={erc20Name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">DECIMALS</p>
                        <input
                            className="Admin__input-approvals"
                            type="number"
                            placeholder="Decimals"
                            name="erc20Decimals"
                            value={erc20Decimals}
                            onChange={handleChange}
                        />
                    </div>
                    <div />
                    <div />
                    <div className="Admin__button-grid">
                        <input className="Admin__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

/**
 * React Hook to handle set target proportion
 * @param props Properties sent to hook
 */
function SetTargetProportionHook(props: any) {
    const [load, setLoad] = useState(false);
    const [tokensProportions, setTokensProportions] = useState([{}] as [{ address: string, proportion: string }]);

    useEffect(() => {
        if (load === false) {
            getTokenProportions().then((result) => {
                setTokensProportions(result);
            });
            setLoad(true);
        }
    });

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        const localChanges: [{ address: string, proportion: string }] = [] as any;
        const totalTokens = tokensProportions.length;
        for (let i = 0; i < totalTokens; i++) {
            if (tokensProportions[i].address === event.target.name) {
                localChanges[i] = { address: event.target.name, proportion: event.target.value };
            } else {
                localChanges[i] = tokensProportions[i];
            }
        }
        setTokensProportions(localChanges);
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        // TODO:
        event.preventDefault();
    }

    /**
     * Get token information async to render
     */
    async function getTokenProportions() {
        const { mixrContract } = props;

        const tokensAndPorportions: [{ address: string, proportion: string }] = [{} as any];
        tokensAndPorportions.pop();
        const approved: [[string], number] = await mixrContract.getRegisteredTokens();
        const approvedTokensAddress: [string] = approved[0];
        const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            // TODO: mixr decimals!
            const proportion = new BigNumber(
                await mixrContract.getTargetProportion(approvedTokensAddress[i]),
            ).dividedBy(10 ** 24).toString();
            tokensAndPorportions.push({ address: approvedTokensAddress[i], proportion });
        }
        return tokensAndPorportions;
    }

    /**
     * Transform json array in HTML
     */
    function renderTokensProportions() {
        return (
            tokensProportions.map((token) => {
                return (
                    <li key={token.address}>
                        {/* <p>{token.address}</p> */}
                        <input
                            name={token.address}
                            type="text"
                            value={token.proportion}
                            placeholder="proportion"
                            onChange={handleChange}
                            className="Admin__input-approvals--full-width"
                        />;
                    </li>
                );
            })
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                <li
                    className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding" >
                    TOKEN PROPORTION
                </li>
                {renderTokensProportions()}
            </ul>
            <div className="Admin__token-proportion-grid">
                <div />
                <div className="Admin__button-grid">
                    <input className="Admin__button" type="submit" value="SUBMIT" />
                </div>
            </div>

        </form>
    );
}

/**
 * React Hook to handle set the base fee for deposit
 * @param props Properties sent to hook
 */
function SetBaseFeeHook(props: any) {
    enum controlVarNames { baseFeeDepositToken = 'baseFeeDepositToken' };
    const [load, setLoad] = useState(false);
    const [tokensNames, setTokensNames] = useState([{}] as [{ address: string, name: string }]);
    const [baseFeeDepositToken, setBaseFeeDepositToken] = useState('default');
    const [baseFeeDepositValue, setBaseFeeDepositValue] = useState('');
    const [baseFeeRedemptionToken, setBaseFeeRedemptionToken] = useState('default');
    const [baseFeeRedemptionValue, setBaseFeeRedemptionValue] = useState('');

    useEffect(() => {
        if (load === false) {
            getAvailableTokens().then((result) => {
                setTokensNames(result);
                setLoad(true);
            });
        }
    });

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        if (event.target.name === 'baseFeeDepositToken') {
            setBaseFeeDepositToken(event.target.value);
            updateBaseFeeValue(event.target.value, FeeType.DEPOSIT).then((result) => {
                setBaseFeeDepositValue(result);
            });
        } else if (event.target.name === 'baseFeeDepositValue') {
            setBaseFeeDepositValue(event.target.value);
        } else if (event.target.name === 'baseFeeRedemptionToken') {
            setBaseFeeRedemptionToken(event.target.value);
            updateBaseFeeValue(event.target.value, FeeType.REDEMPTION).then((result) => {
                setBaseFeeRedemptionValue(result);
            });
        } else if (event.target.name === 'baseFeeRedemptionValue') {
            setBaseFeeRedemptionValue(event.target.value);
        }
    }

    async function updateBaseFeeValue(tokenAddress: string, feeType: FeeType) {
        const { mixrContract } = props;
        let baseFee;
        if (feeType === FeeType.DEPOSIT) {
            baseFee = new BigNumber(
                await (mixrContract as IMIXRContractType).getDepositFee(tokenAddress),
                // TODO: mixr decimals!
            ).dividedBy(10 ** 24).toString();
        } else {
            baseFee = new BigNumber(
                await (mixrContract as IMIXRContractType).getRedemptionFee(tokenAddress),
                // TODO: mixr decimals!
            ).dividedBy(10 ** 24).toString();
        }
        return baseFee;
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const { mixrContract, userAccount } = props;
        // TODO: working, but we might want a better way of doing it
        // this prevents bignumber to exponentiate and result int something like 1e+23
        BigNumber.config({ EXPONENTIAL_AT: 25 });
        if (event.target.name === 'baseFeeDeposit') {
            (mixrContract as IMIXRContractType).setTransactionFee(
                baseFeeDepositToken,
                new BigNumber(baseFeeDepositValue).multipliedBy(10 ** 24).toString(),
                FeeType.DEPOSIT,
                { from: userAccount },
            );
        } else if (event.target.name === 'baseFeeRedemption') {
            (mixrContract as IMIXRContractType).setTransactionFee(
                baseFeeRedemptionToken,
                new BigNumber(baseFeeRedemptionValue).multipliedBy(10 ** 24).toString(),
                FeeType.REDEMPTION,
                { from: userAccount },
            );
        }
        event.preventDefault();
    }

    /**
     * Get token information async to render
     */
    async function getAvailableTokens() {
        const { mixrContract } = props;

        const tokensAndNames: [{ address: string, name: string }] = [{} as any];
        tokensAndNames.pop();
        const approved: [[string], number] = await mixrContract.getRegisteredTokens();
        const approvedTokensAddress: [string] = approved[0];
        const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            const name = await mixrContract.getName(approvedTokensAddress[i]);
            tokensAndNames.push({ address: approvedTokensAddress[i], name });
        }
        return tokensAndNames;
    }

    /**
     * Render available tokens from state
     */
    function renderTokensNames() {
        const { web3 } = props;
        if (tokensNames.length < 1 || tokensNames[0].address === undefined) {
            return null;
        }
        return tokensNames.map((token) => {
            return (
                <option value={token.address} key={token.address}>{web3.utils.hexToUtf8(token.name)}</option>
            );
        });
    }

    return (
        <div>
            Base fee deposit
            <form name="baseFeeDeposit" onSubmit={handleSubmit}>
                <select
                    name="baseFeeDepositToken"
                    value={baseFeeDepositToken}
                    onChange={handleChange}
                    required={true}
                >
                    <option disabled={true} value="default">Select Token</option>
                    {renderTokensNames()}
                </select>
                <input
                    type="text"
                    name="baseFeeDepositValue"
                    value={baseFeeDepositValue}
                    onChange={handleChange}
                />
                <input type="submit" value="send" />
            </form>
            Base fee redemption
            <form name="baseFeeRedemption" onSubmit={handleSubmit}>
                <select
                    name="baseFeeRedemptionToken"
                    value={baseFeeRedemptionToken}
                    onChange={handleChange}
                    required={true}
                >
                    <option disabled={true} value="default">Select Token</option>
                    {renderTokensNames()}
                </select>
                <input
                    type="text"
                    name="baseFeeRedemptionValue"
                    value={baseFeeRedemptionValue}
                    onChange={handleChange}
                />
                <input type="submit" value="send" />
            </form>
        </div>
    );
}

export default Admin;
