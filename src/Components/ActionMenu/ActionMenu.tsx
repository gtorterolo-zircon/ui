import React, { Component } from 'react';

import plusButton from '../../Assets/img/wallet/wallet-menu/action-plus.svg';

import './ActionMenu.css';

interface IMenuState {
    displayMenu: boolean;
}

class ActionMenu extends Component<{}, IMenuState> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <img className="Action-Menu__plus" src={plusButton} />
            </div>
        );
    }
}

export default ActionMenu;
