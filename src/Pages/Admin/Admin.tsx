import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'rimble-ui';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState } from '../../Common/CommonInterfaces';


/**
 * Admin Interface
 */
interface IAdmin extends IBlockchainState {
    erc20Address: string;
    erc20Name: string;
    erc20Decimals: string;
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
            erc20Address: '',
            erc20Decimals: '',
            erc20Name: '',
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
            }, this.updateRegisteredTokens);
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
        // TODO: verify if userAccount is in governors list
        // and if true, return a message saying the user is not allowed
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Address"
                        name="erc20Address"
                        onChange={this.handleChange}
                    /><br />
                    <Input
                        type="text"
                        placeholder="Name"
                        name="erc20Name"
                        onChange={this.handleChange}
                    /><br />
                    <Input
                        type="number"
                        placeholder="Decimals"
                        name="erc20Decimals"
                        onChange={this.handleChange}
                    /><br />
                    <Input type="submit" value="SUBMIT" />
                </form>
                <ul id="tokensList" />
            </div>
        );
    }

    /**
     * Handle interface user changes
     */
    private handleChange = (event: any) => {
        if (event.target.name === 'erc20Address') {
            this.setState({ erc20Address: event.target.value });
        } else if (event.target.name === 'erc20Name') {
            this.setState({ erc20Name: event.target.value });
        } else if (event.target.name === 'erc20Decimals') {
            this.setState({ erc20Decimals: event.target.value });
        }
    }

    /**
     * Handle interface user submit
     */
    private handleSubmit = (event: any) => {
        const { mixrContract, userAccount, erc20Address } = this.state;
        if (mixrContract === undefined) {
            return;
        }
        mixrContract.registerToken(erc20Address, {
            from: userAccount,
        }).then(() => {
            console.log('registered!');
        });
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
            const tokenElements = tokenMap.map((token) => <li key={token}>{token}</li>);
            ReactDOM.render(tokenElements, document.getElementById('tokensList'));
        });
    }
}

export default Admin;
