/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import './Sidebar.css';


const Sidebar = (props: any) =>   (
            <div className="Sidebar">
                <div className="Sidebar__container">
                    <div>
                        <p onClick={props.click} className="Sidebar__closebtn">&times;</p>
                        <p className="Sidebar__item">ABOUT</p>
                        <p className="Sidebar__item">LEGAL</p>
                        <p className="Sidebar__item">TERMS</p>
                        <p className="Sidebar__item">CONTACT</p>
                    </div>
                    <div>
                        <p className="Sidebar__copyright">
                            &#169; Copyright 2019 by 1A1Z Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        );

export default Sidebar;
