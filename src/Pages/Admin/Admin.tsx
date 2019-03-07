import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'rimble-ui';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import { IBlockchainState } from '../../Common/CommonInterfaces';

import Navbar from '../../Components/Navbar/Navbar';

import './Admin.css';


/**
 * Enum to define action type
 */
enum TypeAction {
    None = 0,
    RegisterToken = 1,
}
/**
 * Admin Interface
 */
interface IAdmin extends IBlockchainState {
    action: TypeAction;
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
        const { mixrContract, userAccount, action } = this.state;
        if (userAccount === undefined || mixrContract === undefined) {
            return null;
        }
        let actionRender = null;
        switch (action) {
            case TypeAction.RegisterToken:
                actionRender = <RegisterTokens
                    mixrContract={mixrContract}
                    userAccount={userAccount}
                />;
        }
        // TODO: verify if userAccount is in governors list
        // and if true, return a message saying the user is not allowed
        return (
            <div className="Admin">
            <Navbar />
            <div className="Admin__grid">
                <div className="Admin__main">
                    <ul>
                        <li
                            className="Admin-Input__title Admin-Input__title--big"
                            key="adderc20"
                            onClick={this.handleClick}
                        >
                        Add ERC20
                        </li>
                        <li
                            className="Admin-Input__title Admin-Input__title--big"
                            key="setTarget"
                            onClick={this.handleClick}
                        >
                        Set Target Proportion
                        </li>
                    </ul>
                </div>
                <div className="Admin__main">
                    <div>
                        {actionRender}
                        <ul id="tokensList" />
                    </div>
                </div>
                <div  />
            </div>

        </div>
        );
    }

    private handleClick = (event: any) => {
        this.setState({ action: TypeAction.RegisterToken });
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

/**
 * React Hook to handle token registry
 * @param props Properties sent to hook
 */
function RegisterTokens(props: any) {
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
    // TODO reorder
    return (
        <form onSubmit={handleSubmit}>
            <div className="Admin__inputs-grid">

                <input
                    className="Admin__input-approvals"
                    type="text"
                    placeholder="Address"
                    name="erc20Address"
                    value={erc20Address}
                    onChange={handleChange}
                />
                <input
                    className="Admin__input-approvals"
                    type="text"
                    placeholder="Name"
                    name="erc20Name"
                    value={erc20Name}
                    onChange={handleChange}
                />
                <input
                    className="Admin__input-approvals"
                    type="number"
                    placeholder="Decimals"
                    name="erc20Decimals"
                    value={erc20Decimals}
                    onChange={handleChange}
                />
                <div />
                <div />
                <div className="Admin__button-grid">
                    <button className="Admin__button" type="submit">SUBMIT</button>
                </div>
            </div>
        </form>
    );
}

export default Admin;
