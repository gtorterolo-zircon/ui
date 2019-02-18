/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import './Sidebar.css';


class Sidebar extends Component {
    render() {
        return (
            <div className="Sidebar">
                <p className="Sidebar__closebtn">&times;</p>
                <p>About</p>
                <p>Services</p>
                <p>Clients</p>
                <p>Contact</p>
            </div>
        );
    }
}

export default Sidebar;
