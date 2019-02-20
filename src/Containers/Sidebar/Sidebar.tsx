/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import './Sidebar.css';


class Sidebar extends Component {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="Sidebar">
                <div className="Sidebar__container">
                    <div>
                        <p className="Sidebar__closebtn">&times;</p>
                        <p className="Sidebar_item">ABOUT</p>
                        <p className="Sidebar_item">LEGAL</p>
                        <p className="Sidebar_item">TERMS</p>
                        <p className="Sidebar_item">CONTACT</p>
                    </div>
                    <div>
                        <p className="Sidebar_copyright">
                            &#169; Copyright 2019 by 1A1Z Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
