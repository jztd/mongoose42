import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ItemLookup from './ItemLookup';
import ItemPage from './ItemPage';

function Container() {
    return (
        <BrowserRouter>
            <div className="container-fluid h-100 ">
                <div className="row h-100">
                    <Switch>
                        <Route exact path="/" component={ItemLookup} />
                        <Route path="/item/:name" component={ItemPage} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Container;
