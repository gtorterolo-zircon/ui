import BigNumber from 'bignumber.js';
import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
    SetTargetProportion = 2,
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
            if (result.userAccount === undefined || result.mixrContract === undefined) {
                return;
            }
            result.mixrContract.isGovernor(result.userAccount).then((isGovernor) => {
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
        const { mixrContract, userAccount, action, isGovernor } = this.state;
        if (userAccount === undefined || mixrContract === undefined || isGovernor === undefined) {
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
                        </ul>
                    </div>
                    <div className="Admin__main">
                        <div>
                            {actionRender}
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
        switch (actionId) {
            case 'addErc20StableCoin':
                this.setState({ action: TypeAction.RegisterToken });
                break;
            case 'setTargetProportion':
                this.setState({ action: TypeAction.SetTargetProportion });
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
            const tokenElements = tokenMap.map((token) => <li key={token}>{token}</li>);
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
                <div className="Admin__button-grid">
                    <input className="Admin__button" type="submit" value="SUBMIT" />
                </div>
            </div>
        </form>
    );
}

/**
 * React Hook to handle set target proportion
 * @param props Properties sent to hook
 */
function SetTargetProportionHook(props: any) {
    const [load, setLoad] = useState(false);
    const [tokensProportions, setTokensProportions] = useState([{}] as [{ address: string, proportion: number }]);

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
        // TODO:
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

        const tokensAndPorportions: [{ address: string, proportion: number }] = [{} as any];
        tokensAndPorportions.pop();
        const approved: [[string], number] = await mixrContract.getRegisteredTokens();
        const approvedTokensAddress: [string] = approved[0];
        const totalApprovedTokens: number = new BigNumber(approved[1]).toNumber();
        // iterate over accepted tokens to add them of state component for rendering
        for (let i = 0; i < totalApprovedTokens; i += 1) {
            // get token info
            const proportion = await mixrContract.getTargetProportion(approvedTokensAddress[i]);
            tokensAndPorportions.push({ address: approvedTokensAddress[i], proportion });
        }
        return tokensAndPorportions;
    }

    /**
     * Transform json array in HTML
     */
    function renderTokensProportions() {
        if (tokensProportions[0].address === undefined) {
            return null;
        }
        return tokensProportions.map((token) => {
            return (
                <li key={token.address}>
                    <p>{token.address}</p>
                    <input
                        name={token.address}
                        type="text"
                        value={token.proportion}
                        placeholder="proportion"
                        onChange={handleChange}
                    />;
                </li>
            );
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {renderTokensProportions()}
            </ul>
            <input type="submit" value="SUBMIT" />
        </form>
    );
}

export default Admin;
