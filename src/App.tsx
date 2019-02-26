/* globals document */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Main from './Pages/Main/Main';


export default function renderApp() {
    ReactDOM.render(
        <BrowserRouter>
            <div>
                <Main />
            </div>
        </BrowserRouter>, document.getElementById('root'),
    );
}
