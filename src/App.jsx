/* globals document */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './pages/Main';


export default function renderApp() {
    ReactDOM.render(
        <BrowserRouter>
            <div>
                <Route path="/" exact component={Main} />
            </div>
        </BrowserRouter>, document.getElementById('root'),
    );
}
