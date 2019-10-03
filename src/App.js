import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ItemLookup from './ItemLookup';
import ItemPage from './ItemPage';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

const config = {
    issuer: 'https://dev-556527.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/implicit/callback',
    clientId: '',
    pkce: true
};

function Container() {
    
    return (
        <BrowserRouter>
            <Security {...config}>
                <div className="container-fluid h-100 ">
                    <div className="row h-100">
                        <Switch>
                            <Route exact path="/" component={ItemLookup} />
                            <Route path="/implicit/callback" component={ImplicitCallback} />
                            <SecureRoute path="/item/:name" component={ItemPage} />
                        </Switch>
                    </div>
                </div>
            </Security>
        </BrowserRouter>
    );
}

export default Container;
