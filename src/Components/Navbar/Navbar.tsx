/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';

import Logo from '../../Assets/img/cement-logo.svg';
import MenuIcon from '../../Assets/img/hamburger-menu-icon.svg';

import './Navbar.css';



class Navbar extends Component<any, any> {
    // eslint-disable-next-line no-useless-constructor
    constructor(props: any) {
        super(props);
        this.state = {
            sidebarOpen: false,
        };
    }

    public sidebar = () => {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }

    public reloadRoute = () => {
        window.location.href = '/mixr';
    }

    public render() {
        return (
            <React.Fragment>
                <div className="Navbar">
                    <div>
                        <img className="Navbar__Logo" src={Logo} alt="cementDAO logo" />
                    </div>
                    <div className="Navbar__items-container">
                        <span onClick={this.reloadRoute} className="Navbar__item">MIXR</span>
                        <Link to="/bild" className="Navbar__item">BILD</Link>
                        <Link to="/risk" className="Navbar__item">RISK</Link>
                    </div>
                    <div className="Navbar__menu-icon-container">
                        <img onClick={this.sidebar} className="Navbar__menu-icon" src={MenuIcon} />
                    </div>
                </div>

                {this.state.sidebarOpen ?  <Sidebar click={this.sidebar} /> : null}
            </React.Fragment>
        );
    }
}

export default Navbar;
