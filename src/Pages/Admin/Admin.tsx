import BigNumber from 'bignumber.js';
import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import {
    FeeType,
    IBILDState,
    IBlockchainState,
    IMIXRContractType,
    IWeb3Type,
} from '../../Common/CommonInterfaces';

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
    setMinimumStake = 4,
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
            action: TypeAction.None,
            isGovernor: false,
        };
    }

    /**
     * @ignore
     */
    public async componentDidMount() {
        await BlockchainGeneric.onLoad().then((result) => {
            if (
                result.userAccount === undefined ||
                result.whitelistContract === undefined ||
                result.mixrContract === undefined
            ) {
                return;
            }
            result.whitelistContract.isGovernor(result.userAccount).then((isGovernor) => {
                console.log((result.whitelistContract as any).address, result.userAccount, isGovernor);
                this.setState({
                    IERC20ABI: result.IERC20ABI,
                    bildContract: result.bildContract,
                    isGovernor,
                    mixrContract: result.mixrContract,
                    userAccount: result.userAccount,
                    walletInfo: result.walletInfo,
                    web3: result.web3,
                });
            });
        });
    }

    /**
     * @ignore
     */
    public render() {
        const {
            mixrContract,
            bildContract,
            userAccount,
            action,
            isGovernor,
            web3,
        } = this.state;
        if (
            userAccount === undefined ||
            bildContract === undefined ||
            mixrContract === undefined ||
            web3 === undefined ||
            isGovernor === undefined
        ) {
            return null;
        }
        if (isGovernor === false) {
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
                    web3={web3}
                />;
                break;
            case TypeAction.setBaseFee:
                actionRender = <SetBaseFeeHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                    web3={web3}
                />;
                break;
            case TypeAction.setMinimumStake:
                actionRender = <SetMinimumStakeHook
                    mixrContract={mixrContract}
                    bildContract={bildContract}
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
                            <li
                                className="Admin-Input__title Admin-Input__title--big"
                                data-id="setMinimumStake"
                                onClick={this.handleClick}
                            >
                                Set Minimum Stake
                            </li>
                        </ul>
                    </div>
                    <div className="Admin__main">
                        <div>
                            {actionRender}
                        </div>
                    </div>
                    <div />
                </div>

            </div>
        );
    }

    /**
     * handle click
     */
    private handleClick = (event: any) => {
        const actionId = event.target.dataset.id;
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
            case 'setMinimumStake':
                this.setState({ action: TypeAction.setMinimumStake });
                break;
        }
        event.preventDefault();
    }
}

/**
 * React Hook to handle token registry
 * @param props Properties sent to hook
 */
function RegisterTokensHook(props: { mixrContract: IMIXRContractType, userAccount: string }) {
    const [erc20Address, setErc20Address] = useState('');
    const [erc20Name, setErc20Name] = useState('');
    const [erc20Symbol, setErc20Symbol] = useState('');
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
        } else if (event.target.name === 'erc20Symbol') {
            setErc20Symbol(event.target.value);
        } else if (event.target.name === 'erc20Decimals') {
            setErc20Decimals(event.target.value);
        }
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const { mixrContract, userAccount } = props;
        mixrContract.registerStandardToken(erc20Address, erc20Name, erc20Symbol, erc20Decimals, {
            from: userAccount,
        }).then(() => {
            window.location.reload();
        }).catch((fail) => alert(fail.toString()));
        event.preventDefault();
    }

    /**
     * Update registered tokens.
     */
    function updateRegisteredTokens() {
        const { mixrContract } = props;
        mixrContract.getRegisteredTokens().then((tokens: [string]) => {
            const tokenMap = tokens;
            const tokenElements = tokenMap.map(
                (token) => <li className="Admin-Input__title Admin-Input__title--padding" key={token}>{token}</li>,
            );
            ReactDOM.render(tokenElements, document.getElementById('tokensList'));
        });
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
                        <p className="Admin-Input__title Admin-Input__title--padding">SYMBOL</p>
                        <input
                            className="Admin__input-approvals"
                            type="text"
                            placeholder="Symbol"
                            name="erc20Symbol"
                            value={erc20Symbol}
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
            <p
                className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding"
            >
                TOKEN ADDRESSES
            </p>
            <ul id="tokensList" />
            {updateRegisteredTokens()}
        </React.Fragment>
    );
}

/**
 * React Hook to handle set target proportion
 * @param props Properties sent to hook
 */
function SetTargetProportionHook(props: { mixrContract: IMIXRContractType, web3: IWeb3Type, userAccount: string }) {
    const [load, setLoad] = useState(false);
    const [tokensProportions, setTokensProportions] = useState(
        [{}] as [{ address: string, name: string, proportion: string }],
    );

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
        const localChanges: [{ address: string, name: string, proportion: string }] = [] as any;
        const totalTokens = tokensProportions.length;
        for (let i = 0; i < totalTokens; i++) {
            if (tokensProportions[i].address === event.target.name) {
                localChanges[i] = {
                    address: event.target.name,
                    name: tokensProportions[i].name,
                    proportion: event.target.value,
                };
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
        // TODO: working, but we might want a better way of doing it
        // this prevents bignumber to exponentiate and result int something like 1e+23
        BigNumber.config({ EXPONENTIAL_AT: 25 });
        const { mixrContract, userAccount } = props;
        const addresses: string[] = [];
        const proportions: string[] = [];
        mixrContract.decimals().then((BNdecimals) => {
            const decimals = new BigNumber(BNdecimals).toNumber();
            // collect addresses and proportions
            tokensProportions.forEach((token) => {
                addresses.push(token.address);
                proportions.push(new BigNumber(token.proportion).multipliedBy(10 ** decimals).toString());
            });
            // blockchain call
            mixrContract.setTokensTargetProportion(addresses, proportions, { from: userAccount }).then(() => {
                alert('done!');
            });
        });
        event.preventDefault();
    }

    /**
     * Get token information async to render
     */
    async function getTokenProportions() {
        const { mixrContract, web3 } = props;

        const tokensAndPorportions: [{ address: string, name: string, proportion: string }] = [{} as any];
        tokensAndPorportions.pop();
        const approvedTokensAddress: [string] = await mixrContract.getRegisteredTokens();
        const totalApprovedTokens: number = approvedTokensAddress.length;
        const mixrDecimals = new BigNumber(await mixrContract.decimals()).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            const proportion = new BigNumber(
                await mixrContract.getTargetProportion(approvedTokensAddress[i]),
            ).dividedBy(10 ** mixrDecimals).toString();
            const name = await mixrContract.getName(approvedTokensAddress[i]);
            tokensAndPorportions.push({ address: approvedTokensAddress[i], name, proportion });
        }
        return tokensAndPorportions;
    }

    /**
     * Transform json array in HTML
     */
    function renderTokensProportions() {
        if (tokensProportions.length < 1 || tokensProportions[0].address === undefined) {
            return;
        }
        return (
            tokensProportions.map((token) => {
                return (
                    <li key={token.address}>
                        <p className="Admin-Input__title">{token.name}</p>
                        <br />
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
                    key={'title'}
                    className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding"
                >
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
function SetBaseFeeHook(props: { mixrContract: IMIXRContractType, web3: IWeb3Type, userAccount: string }) {
    enum controlVarNames {
        baseFeeDepositValue = 'baseFeeDepositValue',
        baseFeeRedemptionValue = 'baseFeeRedemptionValue',
        baseFeeTransferValue = 'baseFeeTransferValue',
    }
    const [load, setLoad] = useState(false);
    const [baseFeeDepositValue, setBaseFeeDepositValue] = useState('');
    const [baseFeeRedemptionValue, setBaseFeeRedemptionValue] = useState('');
    const [baseFeeTransferValue, setBaseFeeTransferValue] = useState('');

    useEffect(() => {
        if (load === false) {
            getBaseFeeValues().then((result) => {
                setBaseFeeDepositValue(result.deposit);
                setBaseFeeRedemptionValue(result.redemption);
                setBaseFeeTransferValue(result.transfer);
                setLoad(true);
            });
        }
    });

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        if (event.target.name === controlVarNames.baseFeeDepositValue) {
            setBaseFeeDepositValue(event.target.value);
        } else if (event.target.name === controlVarNames.baseFeeRedemptionValue) {
            setBaseFeeRedemptionValue(event.target.value);
        } else if (event.target.name === controlVarNames.baseFeeTransferValue) {
            setBaseFeeTransferValue(event.target.value);
        }
    }

    async function getBaseFeeValues(): Promise<{ deposit: string, redemption: string, transfer: string }> {
        const { mixrContract } = props;
        const mixrDecimals = new BigNumber(await mixrContract.decimals()).toNumber();
        const baseFeeDeposit = new BigNumber(
            await mixrContract.baseDepositFee(),
        ).dividedBy(10 ** mixrDecimals).toString();
        const baseFeeRedemption = new BigNumber(
            await mixrContract.baseRedemptionFee(),
        ).dividedBy(10 ** mixrDecimals).toString();
        const baseFeeTransfer = new BigNumber(
            await mixrContract.baseTransferFee(),
        ).dividedBy(10 ** mixrDecimals).toString();
        return { deposit: baseFeeDeposit, redemption: baseFeeRedemption, transfer: baseFeeTransfer };
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
            mixrContract.setBaseFee(
                new BigNumber(baseFeeDepositValue).multipliedBy(10 ** 24).toString(),
                FeeType.DEPOSIT,
                { from: userAccount },
            ).then((success) => {
                window.location.reload();
            }).catch((fail) => {
                const errorReason = fail.toString().match('Error: VM Exception .*: revert (.*)\\.');
                alert('Your transaction failed ' + errorReason[1]);
            });
        } else if (event.target.name === 'baseFeeRedemption') {
            mixrContract.setBaseFee(
                new BigNumber(baseFeeRedemptionValue).multipliedBy(10 ** 24).toString(),
                FeeType.REDEMPTION,
                { from: userAccount },
            ).then((success) => {
                window.location.reload();
            }).catch((fail) => {
                const errorReason = fail.toString().match('Error: VM Exception .*: revert (.*)\\.');
                alert('Your transaction failed ' + errorReason[1]);
            });
        } else if (event.target.name === 'baseFeeTransfer') {
            mixrContract.setBaseFee(
                new BigNumber(baseFeeTransferValue).multipliedBy(10 ** 24).toString(),
                FeeType.TRANSFER,
                { from: userAccount },
            ).then((success) => {
                window.location.reload();
            }).catch((fail) => {
                const errorReason = fail.toString().match('Error: VM Exception .*: revert (.*)\\.');
                alert('Your transaction failed ' + errorReason[1]);
            });
        }
        event.preventDefault();
    }

    return (
        <div>
            <p className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding">
                BASE FEE DEPOSIT
            </p>
            <form name="baseFeeDeposit" onSubmit={handleSubmit}>
                <div className="Admin__inputs-grid">
                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">AMOUNT</p>
                        <input
                            type="text"
                            name={controlVarNames.baseFeeDepositValue}
                            value={baseFeeDepositValue}
                            onChange={handleChange}
                            className="Admin__input-approvals"
                        />
                    </div>
                    <div />
                    <div className="Admin__button-grid">
                        <input className="Admin__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
            <p className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding">
                BASE FEE REDEMPTION
            </p>
            <form name="baseFeeRedemption" onSubmit={handleSubmit}>
                <div className="Admin__inputs-grid">
                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">AMOUNT</p>
                        <input
                            type="text"
                            name={controlVarNames.baseFeeRedemptionValue}
                            value={baseFeeRedemptionValue}
                            onChange={handleChange}
                            className="Admin__input-approvals"
                        />
                    </div>
                    <div />
                    <div className="Admin__button-grid">
                        <input className="Admin__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
            <p className="Admin-Input__title Admin-Input__title--big Admin-Input__title--padding">
                BASE FEE TRANSFER
            </p>
            <form name="baseFeeTransfer" onSubmit={handleSubmit}>
                <div className="Admin__inputs-grid">
                    <div>
                        <p className="Admin-Input__title Admin-Input__title--padding">AMOUNT</p>
                        <input
                            type="text"
                            name={controlVarNames.baseFeeTransferValue}
                            value={baseFeeTransferValue}
                            onChange={handleChange}
                            className="Admin__input-approvals"
                        />
                    </div>
                    <div />
                    <div className="Admin__button-grid">
                        <input className="Admin__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
        </div>
    );
}

/**
 * set minimum stake hook
 */
function SetMinimumStakeHook(props: {
    mixrContract: IMIXRContractType,
    bildContract: IBILDState,
    web3: IWeb3Type,
    userAccount: string,
}) {
    const [load, setLoad] = useState(false);
    const [minimumStake, setMinimumStake] = useState('');

    useEffect(() => {
        if (load === false) {
            getMinimumStake().then((result) => {
                setMinimumStake(result);
                setLoad(true);
            });
        }
    });

    async function getMinimumStake() {
        const { bildContract } = props;
        const currentMinimumStake = await bildContract.getMinimumStake();
        const bildDecimals = new BigNumber(await bildContract.decimals()).toNumber();
        return new BigNumber(currentMinimumStake)
            .dividedBy(10 ** bildDecimals)
            .toString();
    }

    /**
     * handle submit
     */
    function handleSubmit(event: any) {
        const { bildContract, userAccount } = props;
        bildContract.decimals().then((decimals) => {
            const stakeToBeSet = new BigNumber(minimumStake)
                .multipliedBy(10 ** new BigNumber(decimals).toNumber())
                .toString();
            bildContract.setMinimumStake(stakeToBeSet, { from: userAccount }).then(() => {
                //
            }).catch((fail) => {
                //
            });
        });
        event.preventDefault();
    }

    /**
     * handle change
     */
    function handleChange(event: any) {
        if (event.target.name === 'minimumStake') {
            setMinimumStake(event.target.value);
        }
    }

    return (
        <div>
            <p
                className="Admin-Input__title Admin-Input__title--big"
            >
                The required minimum stake for Rating Agent Nominations
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    className="Admin__input-approvals--full-width"
                    type="text"
                    name="minimumStake"
                    value={minimumStake}
                    onChange={handleChange}
                />
                <div className="Admin__button-grid">
                    <input className="Admin__button--small" type="submit" value="SUBMIT" />
                </div>
            </form>
        </div>
    );
}

export default Admin;
