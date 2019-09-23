import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ItemLookup from './ItemLookup';
import ItemPage from './ItemPage';

function Container() {
    return (
        <BrowserRouter>
            <div className="container-flex">
                <div class="row">
                    <div class="col-3 sidebar">
                        STUFF GOES HERE
                    </div>
                    <div class="col-9">
                        <Switch>
                            <Route exact path="/" component={ItemLookup} />
                            <Route path="/item/:name" component={ItemPage} />
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Container;
