import React, { Component, useState } from 'react';
import { Card, Heading, Input, PublicAddress, Text } from 'rimble-ui';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState } from '../../Common/CommonInterfaces';

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
 * Class Admin
 * @dev This is the skeleton for W13, also known as Special Wallet
 * It's main objective is to handle governators requests.
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
                                data-id="approve"
                                onClick={this.handleClick}
                            >
                                Approve
                            </li>
                            <li
                                data-id="allowance"
                                onClick={this.handleClick}
                            >
                                Allowance
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
function ApproveHook(props: any) {
    const [addressToApprove, setAddressToApprove] = useState('');
    const [amountToApprove, setAmountToApprove] = useState('');
    const [inTokenToApprove, setInTokenToApprove] = useState('');

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
    }

    /**
     * Handle interface user submit
     */
    function handleSubmit(event: any) {
        const {
            userAccount,
            IERC20ABI,
            web3,
        } = props;
        const ERC = new web3.eth.Contract(IERC20ABI, inTokenToApprove);
        ERC.methods.approve(addressToApprove, amountToApprove).send({
            from: userAccount,
        });
        event.preventDefault();
    }

    return (<form onSubmit={handleSubmit}>
        <p className="Profile-Input__title">PUBLIC ADDRESSES TO APPROVE</p>

        <div className="Profile__inputs-grid">
            <input
                className="Profile__input-approvals"
                type="text"
                placeholder="Address to approve"
                name="addressToApprove"
                onChange={handleChange}
                required={true}
            />
            <input
                className="Profile__input-approvals"
                type="text"
                placeholder="Address to approve"
                name="addressToApprove"
                onChange={handleChange}
                required={true}
            />
            <p className="Profile-Input__title Profile-Input__title--padding">AMOUNT TO APPROVE</p>
            <div />
            <input
                className="Profile__input-approvals"
                type="number"
                placeholder="Amount to approve"
                name="inTokenToApprove"
                onChange={handleChange}
                required={true}
            />
            <div />
            <div />
            <div className="Profile__button-grid">
                <input className="Profile__button" type="submit" value="SUBMIT" />
            </div>
        </div>
    </form>);
}

/**
 * React Hook to handle allowance
 * @param props Properties sent to hook
 */
function AllowanceHook(props: any) {
    return (
        <form>
            <Input type="text" placeholder="Address to verify" />
            <input className="Profile__button" type="submit" value="SUBMIT" />
        </form>
    );
}

export default Profile;
