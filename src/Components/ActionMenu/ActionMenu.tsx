import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BlockchainGeneric from '../../Common/BlockchainGeneric';
import {
    IBlockchainState,
    IWeb3Type,
} from '../../Common/CommonInterfaces';

import plusButton from '../../Assets/img/wallet/wallet-menu/action-plus.svg';
import copyAddressButton from '../../Assets/img/wallet/wallet-menu/copy-eth-address-button.svg';
import helpButton from '../../Assets/img/wallet/wallet-menu/help-button.svg';
import logoutButton from '../../Assets/img/wallet/wallet-menu/logout-button.svg';
import minusButton from '../../Assets/img/wallet/wallet-menu/minus.svg';

import './ActionMenu.css';


interface IMenuState extends IBlockchainState {
    displayMenu: boolean;
    copied: boolean;
    userAccount?: string;
    web3?: IWeb3Type;
}

class ActionMenu extends Component<{}, IMenuState> {
    constructor(props: any) {
        super(props);
        this.state = {
            assetClick: '',
            copied: false,
            displayMenu: false,
            userAccount: '',
        };
    }

    public async componentDidMount() {
        await BlockchainGeneric.onLoad().then((result) => {
            this.setState({
                IERC20ABI: result.IERC20ABI,
                mixrContract: result.mixrContract,
                userAccount: result.userAccount,
                walletInfo: result.walletInfo,
                web3: result.web3,
                assetClick: '',
            });
        });
    }


    public render() {
        const { displayMenu } = this.state;
        return (
            <div>
                <div>
                    {displayMenu === false ? (this.hideMenu()) : (this.showMenu())}
                </div>
            </div>
        );
    }

    /**
     * Method to show or hide the action menu
     */

    private menuStatus = () => {
        const { displayMenu } = this.state;
        this.setState({ displayMenu: !displayMenu });
    }

    private logoutClickHandler = () => {
        window.location.href = '/';
    }

    /**
     * Method to return the hidden menu jsx
     */
    private hideMenu = () => {
        return (
        <React.Fragment>
                <img
                    className="Action-Menu__plus"
                    src={plusButton}
                    onClick={this.menuStatus}
                />
        </React.Fragment>
        );
    }

    /**
     * Method to return the menu open jsx
     */
    private showMenu = () => {
        return (
            <React.Fragment>
                    <div>
                        <img className="Action-Menu__minus" onClick={this.menuStatus} src={minusButton} />
                        <CopyToClipboard
                            text={this.state.userAccount}
                            onCopy={() => this.setState({copied: true})}
                        >
                            <img className="Action-Menu__copy-address" src={copyAddressButton} />
                        </CopyToClipboard>
                        <img className="Action-Menu__help" src={helpButton} />
                        <img className="Action-Menu__logout" onClick={this.logoutClickHandler} src={logoutButton} />
                    </div>
            </React.Fragment>
        );
    }
}

export default ActionMenu;
