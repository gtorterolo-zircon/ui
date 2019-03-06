import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Admin from '../Admin/Admin';
import BILD from '../BILD/BILD';
import Login from '../Login/Login';
import MIXR from '../MIXR/MIXR';
import Profile from '../Profile/Profile';
import RISK from '../RISK/RISK';


function Main() {
    return (
        <main>
            <Switch>
                <Route exact={true} path="/" component={Login} />
                <Route path="/mixr" component={MIXR} />
                <Route path="/bild" component={BILD} />
                <Route path="/risk" component={RISK} />
                <Route path="/admin" component={Admin} />
                <Route path="/profile" component={Profile} />
            </Switch>
        </main>
    );
}

export default Main;
