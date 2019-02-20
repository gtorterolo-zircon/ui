/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

import Logo from '../../Assets/img/cement-logo.svg';
import MenuIcon from '../../Assets/img/hamburger-menu-icon.svg';

import './Navbar.css';

class Navbar extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <React.Fragment>
                <div className="Navbar">
                    <div>
                        <img className="Navbar__Logo" src={Logo} alt="cementDAO logo" />
                    </div>
                    <div className="Navbar__items-container">
                        <Link to="/mixr" className="Navbar__item">MIXR</Link>
                        <Link to="/bild" className="Navbar__item">BILD</Link>
                        <Link to="/risk" className="Navbar__item">RISK</Link>
                    </div>
                    <div className="Navbar__menu-icon-container">
                        <img className="Navbar__menu-icon" src={MenuIcon} />
                    </div>
                </div>
                <Sidebar />
            </React.Fragment>
        );
    }
}

export default Navbar;
