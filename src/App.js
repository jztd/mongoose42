import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ItemLookup from './ItemLookup';
import ItemPage from './ItemPage';

function Container() {
    return (
        <BrowserRouter>
            <div className="container-flex">
                <Route exact path="/" component={ItemLookup} />
                <Route exact path="/item/:name" component={ItemPage} />
            </div>
        </BrowserRouter>
    );
}

export default Container;
