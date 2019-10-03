import React, { Component } from 'react';
import SearchBox from './SearchBox.js'
import UserBar from './UserBar';
import './App.css';

class TopBanner extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="col-4">
                    <SearchBox id="searchBox" label="Item Name"/>
                </div>
                <div className="col">
                    <UserBar />
                </div>
            </>
        );
    }

}

export default TopBanner;