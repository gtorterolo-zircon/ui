import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../Login/Login'
import MIXR from '../MIXR/MIXR';
import BILD from '../BILD/BILD';
import RISK from '../RISK/RISK';

function Main() {
    return (
        <main>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/mixr" component={MIXR} />
                <Route path="/bild" component={BILD} />
                <Route path="/risk" component={RISK} />
            </Switch>
        </main>
    );
}

export default Main;
