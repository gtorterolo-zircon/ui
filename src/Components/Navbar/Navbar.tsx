/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';

import Logo from '../../Assets/img/cement-logo.svg';
import MenuIcon from '../../Assets/img/hamburger-menu-icon.svg';

import './Navbar.css';

const url = 'http://localhost:3000'
// TODO create the url for when the site is hosted

class Navbar extends Component<any, any> {
    // eslint-disable-next-line no-useless-constructor
    constructor(props: any) {
        super(props);
        this.state = {
            bildLinkColor: '#6B5F7A',
            mixrLinkColor: '#6B5F7A',
            riskLinkColor: '#6B5F7A',
            sidebarOpen: false,
        };
    }

    public componentDidMount() {
        this.navbarLinkTracker();
    }

    public sidebar = () => {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }

    public mixrRoute = () => {
        window.location.href = '/mixr';
    }

    public bildRoute = () => {
        window.location.href = '/bild';
    }

    public navbarLinkTracker = () => {
        switch (window.location.href) {
            case `${url}/mixr`:
                this.setState({
                    bildLinkColor: '#6B5F7A',
                    mixrLinkColor: '#0096A1',
                    riskLinkColor: '#6B5F7A',
                });
                break;
            case `${url}/bild`:
                this.setState({
                    bildLinkColor: '#0096A1',
                    mixrLinkColor: '#6B5F7A',
                    riskLinkColor: '#6B5F7A',
                });
                break;
            case `${url}/risk`:
                this.setState({
                    bildLinkColor: '#6B5F7A',
                    mixrLinkColor: '#6B5F7A',
                    riskLinkColor: '#0096A1',
                });
                break;
        }
    }

    public render() {
        const { mixrLinkColor, bildLinkColor, riskLinkColor } = this.state;
        return (
            <React.Fragment>
                <div className="Navbar">
                    <div>
                        <img className="Navbar__Logo" src={Logo} alt="cementDAO logo" />
                    </div>
                    <div className="Navbar__items-container">
                        <span
                            style={{color: mixrLinkColor}}
                            onClick={this.mixrRoute}
                            className="Navbar__item"
                        >
                            MIXR
                        </span>
                        <span
                            style={{color: bildLinkColor}}
                            className="Navbar__item"
                            onClick={this.bildRoute}
                        >
                            BILD
                        </span>
                        <Link style={{color: riskLinkColor}} to="/risk" className="Navbar__item">RISK</Link>
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
