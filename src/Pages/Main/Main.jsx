import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MIXR from '../MIXR/MIXR';
import BILD from '../BILD/BILD';
import RISK from '../RISK/RISK';

function Main() {
    return (
        <main>
            <Switch>
                <Route path="/mixr" component={MIXR} />
                <Route path="/bild" component={BILD} />
                <Route path="/risk" component={RISK} />
            </Switch>
        </main>
    );
}

export default Main;
