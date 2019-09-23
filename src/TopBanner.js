import React, { Component } from 'react';
import SearchBox from './SearchBox.js'
import './App.css';

class TopBanner extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div class="col-4">
                    <SearchBox id="searchBox" label="Item Name"/>
                </div>
            </>
        );
    }

}

export default TopBanner;