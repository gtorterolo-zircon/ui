/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


class Navbar extends Component {
    render() {
        return (
            <div className="Navbar">
                <div>
                    <img className="Navbar__Logo" src="https://pbs.twimg.com/profile_images/1081871727695724544/KkAFlmWi_400x400.jpg" alt="cementDAO logo" />
                </div>
                <div className="Navbar__items-container">
                    <Link to="/mixr" className="Navbar__item">MIXR</Link>
                    <Link to="/bild" className="Navbar__item">BILD</Link>
                    <Link to="/risk" className="Navbar__item">RISK</Link>
                </div>
                <div className="Navbar__menu-icon-container">
                    <i className="Navbar__menu-icon fas fa-bars fa-2x" />
                </div>
            </div>
        );
    }
}

export default Navbar;
