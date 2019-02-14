/* globals document */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './Containers/Navbar/Navbar';
import Main from './Pages/Main/Main';


export default function renderApp() {
    ReactDOM.render(
        <BrowserRouter>
            <div>
                <Navbar />
                <Main />
            </div>
        </BrowserRouter>, document.getElementById('root'),
    );
}
