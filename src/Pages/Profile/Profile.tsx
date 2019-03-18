import BigNumber from 'bignumber.js';
import React, { Component, useEffect, useState } from 'react';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState, IMIXRContractType, IWeb3Type } from '../../Common/CommonInterfaces';

import Navbar from '../../Components/Navbar/Navbar';

import './Profile.css';


/**
 * Enum to define action type
 */
enum TypeAction {
    None = 0,
    Approve = 1,
    Allowance = 2,
}
interface IProfile extends IBlockchainState {
    addressToApprove: string;
    amountToApprove: string;
    inTokenToApprove: string;
    action: TypeAction;
}
/**
 * Class Profile
 * @dev This class does the work for W9 and W19 requirements
 * Just like a private wallet.
 */
class Profile extends Component<{}, IProfile> {
    /**
     * @ignore
     */
    constructor(props: any) {
        super(props);
        this.state = {
            action: TypeAction.None,
            addressToApprove: '',
            amountToApprove: '',
            inTokenToApprove: '',
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

    /**
     * @ignore
     */
    public render() {
        const { mixrContract, userAccount, action, IERC20ABI, web3 } = this.state;
        if (userAccount === undefined || mixrContract === undefined || IERC20ABI === undefined || web3 === undefined) {
            return null;
        }
        let actionRender = null;
        switch (action) {
            case TypeAction.Approve:
                actionRender = <ApproveHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                    IERC20ABI={IERC20ABI}
                    web3={web3}
                />;
                break;
            case TypeAction.Allowance:
                actionRender = <AllowanceHook
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                    IERC20ABI={IERC20ABI}
                    web3={web3}
                />;
                break;
        }
        return (
            <div className="Profile">
                <Navbar />
                <div className="Profile__grid">
                    <div className="Profile__main">
                        <ul>
                            <li
                                className="Profile-Input__title--big Profile-Input__title--padding"
                                data-id="approve"
                                onClick={this.handleClick}
                            >
                                APPROVE
                            </li>
                            <li
                                className="Profile-Input__title--big Profile-Input__title--padding"
                                data-id="allowance"
                                onClick={this.handleClick}
                            >
                                ALLOWANCE
                            </li>
                        </ul>
                    </div>
                    <div className="Profile__main">
                        <div>
                            {actionRender}
                        </div>
                    </div>
                    <div className="MIXR__basket-composition" />
                </div>

            </div>

        );
    }

    private handleClick = (event: any) => {
        this.setState({
            action:
                (event.target.dataset.id === 'approve') ? TypeAction.Approve : TypeAction.Allowance,
        });
        event.preventDefault();
    }
}

/**
 * React Hook to handle approvals
 * @param props Properties sent to hook
 */
function ApproveHook(
    props: { mixrContract: IMIXRContractType, userAccount: string, IERC20ABI: object, web3: IWeb3Type },
) {
    const [load, setLoad] = useState(false);
    const [addressToApprove, setAddressToApprove] = useState('');
    const [amountToApprove, setAmountToApprove] = useState('');
    const [inTokenToApprove, setInTokenToApprove] = useState('default');
    const [availableTokens, setAvailableTokens] = useState([{}] as [{ address: string, name: string }]);

    useEffect(() => {
        if (load === false) {
            getAvailableTokens().then((result) => {
                setAvailableTokens(result);
            });
            setLoad(true);
        }
    });

    async function getAvailableTokens() {
        const { mixrContract } = props;

        const tokensAvailable: [{ address: string, name: string }] = [{} as any];
        tokensAvailable.pop();
        const approved: [[string], number] = await mixrContract.getRegisteredTokens();
        const approvedTokensAddress: [string] = approved[0];
        const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            const name = await mixrContract.getName(approvedTokensAddress[i]);
            tokensAvailable.push({ address: approvedTokensAddress[i], name });
        }
        return tokensAvailable;
    }

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        if (event.target.name === 'addressToApprove') {
            setAddressToApprove(event.target.value);
        } else if (event.target.name === 'amountToApprove') {
            setAmountToApprove(event.target.value);
        } else if (event.target.name === 'inTokenToApprove') {
            setInTokenToApprove(event.target.value);
        }
        event.preventDefault();
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const {
            mixrContract,
            userAccount,
            IERC20ABI,
            web3,
        } = props;
        const ERC = new web3.eth.Contract(IERC20ABI, inTokenToApprove);
        try {
            mixrContract.getDecimals(inTokenToApprove).then((decimals: string) => {
                ERC.methods.approve(
                    addressToApprove,
                    new BigNumber(amountToApprove).multipliedBy(10 ** parseInt(decimals, 10)).toString(),
                ).send({
                    from: userAccount,
                });
            });
        } catch (e) {
            alert('Token is not registered!');
        }
        event.preventDefault();
    }

    /**
     * Render available tokens from state
     */
    function renderAvailableTokens() {
        if (availableTokens.length < 1 || availableTokens[0].address === undefined) {
            return null;
        }
        return availableTokens.map((token) => {
            return (
                <option value={token.address} key={token.address}>{props.web3.utils.hexToUtf8(token.name)}</option>
            );
        });
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <p className="Profile-Input__title--big Profile-Input__title--padding">
                    APPROVE
                </p>
                <br />
                <p className="Profile-Input__title">PUBLIC ADDRESSES TO APPROVE</p>

                <div className="Profile__inputs-grid">
                    <select
                        value={inTokenToApprove}
                        name="inTokenToApprove"
                        onChange={handleChange}
                        required={true}
                        placeholder="Select Token"
                    >
                        <option disabled={true} value="default">Select Token</option>
                        {renderAvailableTokens()}
                    </select>
                    <input
                        className="Profile__input-approvals"
                        type="text"
                        placeholder="Address to approve"
                        name="addressToApprove"
                        value={addressToApprove}
                        onChange={handleChange}
                        required={true}
                    />
                    <div>
                        <p className="Profile-Input__title Profile-Input__title--padding">AMOUNT TO APPROVE</p>
                        <input
                            className="Profile__input-approvals"
                            type="number"
                            placeholder="Amount to approve"
                            name="amountToApprove"
                            value={amountToApprove}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div />
                    <div />
                    <div className="Profile__button-grid">
                        <input className="Profile__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
        </React.Fragment>);
}

/**
 * React Hook to handle allowance
 * @param props Properties sent to hook
 */
function AllowanceHook(props: any) {
    const [addressToVerify, setAddressToVerify] = useState('');
    const [inTokenToApprove, setInTokenToApprove] = useState('default');
    const [load, setLoad] = useState(false);
    const [availableTokens, setAvailableTokens] = useState([{}] as [{ address: string, name: string }]);

    useEffect(() => {
        if (load === false) {
            getAvailableTokens().then((result) => {
                setAvailableTokens(result);
            });
            setLoad(true);
        }
    });

    async function getAvailableTokens() {
        const { mixrContract } = props;

        const tokensAvailable: [{ address: string, name: string }] = [{} as any];
        tokensAvailable.pop();
        const approved: [[string], number] = await mixrContract.getRegisteredTokens();
        const approvedTokensAddress: [string] = approved[0];
        const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            const name = await mixrContract.getName(approvedTokensAddress[i]);
            tokensAvailable.push({ address: approvedTokensAddress[i], name });
        }
        return tokensAvailable;
    }

    /**
     * Handle interface user changes
     */
    function handleChange(event: any) {
        if (event.target.name === 'addressToVerify') {
            setAddressToVerify(event.target.value);
        } else if (event.target.name === 'inTokenToApprove') {
            setInTokenToApprove(event.target.value);
        }
        event.preventDefault();
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const {
            mixrContract,
            userAccount,
            IERC20ABI,
            web3,
        } = props;
        try {
            const ERC = new web3.eth.Contract(IERC20ABI, inTokenToApprove);
            ERC.methods.allowance(userAccount, addressToVerify).call().then(async (allowed: string) => {
                // TODO: let's have a proper popup
                alert(new BigNumber(allowed).dividedBy(10 **
                    new BigNumber(await mixrContract.getDecimals(inTokenToApprove)).toNumber(),
                ).toNumber());
            });
        } catch (e) {
            alert('Some error occurred!');
        }
        event.preventDefault();
    }

    /**
     * Render available tokens from state
     */
    function renderAvailableTokens() {
        if (availableTokens.length < 1 || availableTokens[0].address === undefined) {
            return null;
        }
        return availableTokens.map((token) => {
            return (
                <option value={token.address} key={token.address}>{props.web3.utils.hexToUtf8(token.name)}</option>
            );
        });
    }

    return (
        <React.Fragment>
            <p className="Profile-Input__title--big Profile-Input__title--padding">
                ALLOWANCE
            </p>
            <br />
            <form onSubmit={handleSubmit}>
                <p className="Profile-Input__title Profile-Input__title--padding">
                    TOKEN SELECT
                </p>
                <select
                    className="Profile__input-approvals--full-width"
                    value={inTokenToApprove}
                    name="inTokenToApprove"
                    onChange={handleChange}
                    required={true}
                    placeholder="Select Token"
                >
                    <option disabled={true} value="default">Select Token</option>
                    {renderAvailableTokens()}
                </select>
                <p className="Profile-Input__title Profile-Input__title--padding">
                    ADDRESS TO VERIFY
                </p>
                <input
                    className="Profile__input-approvals"
                    type="text"
                    name="addressToVerify"
                    value={addressToVerify}
                    onChange={handleChange}
                    placeholder="Address to verify"
                />
                <div className="Profile__inputs-grid">
                    <div />
                    <div className="Profile__button-grid">
                        <input className="Profile__button" type="submit" value="SUBMIT" />
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

export default Profile;
