import React, { Component } from 'react';
import { Card, Heading, Input, PublicAddress, Text } from 'rimble-ui';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState } from '../../Common/CommonInterfaces';

interface IProfile extends IBlockchainState {
    addressToApprove: string;
    amountToApprove: string;
    inTokenToApprove: string;
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
        const { userAccount } = this.state;
        if (userAccount === undefined) {
            return null;
        }
        return (
            <div>
                <PublicAddress address={userAccount} />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Address to approve"
                        name="addressToApprove"
                        onChange={this.handleChange}
                    /><br />
                    <Input
                        type="text"
                        placeholder="Address to approve"
                        name="addressToApprove"
                        onChange={this.handleChange}
                    /><br />
                    <Input
                        type="number"
                        placeholder="Amount to approve"
                        name="inTokenToApprove"
                        onChange={this.handleChange}
                    /><br />
                    <Input type="submit" value="SUBMIT" />
                </form>
                <Card>
                    <Heading.h3>Approvals</Heading.h3>
                    <Text.span>xx tokens</Text.span>
                </Card>
            </div>
        );
    }

    /**
     * Handle interface user changes
     */
    private handleChange = (event: any) => {
        if (event.target.name === 'addressToApprove') {
            this.setState({ addressToApprove: event.target.value });
        } else if (event.target.name === 'amountToApprove') {
            this.setState({ amountToApprove: event.target.value });
        } else if (event.target.name === 'inTokenToApprove') {
            this.setState({ inTokenToApprove: event.target.value });
        }
    }

    /**
     * Handle interface user submit
     */
    private handleSubmit = (event: any) => {
        const {
            mixrContract,
            userAccount,
            addressToApprove,
            amountToApprove,
            inTokenToApprove,
            IERC20ABI,
            web3,
        } = this.state;
        if (
            mixrContract === undefined ||
            IERC20ABI === undefined ||
            inTokenToApprove === undefined ||
            web3 === undefined
        ) {
            return;
        }
        const ERC = new web3.eth.Contract(IERC20ABI, inTokenToApprove);
        ERC.methods.approve(addressToApprove, amountToApprove).send({
            from: userAccount,
        });
        event.preventDefault();
    }
}

export default Profile;
