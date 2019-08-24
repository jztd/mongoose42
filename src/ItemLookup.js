import React, { Component } from 'react';
import SearchBox from './SearchBox';
import './App.css';

class ItemLookup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentItemSearch: ''
        };
    }

    handleItemChange = (itemName) => {
        this.setState({ currentItemSearch: itemName });
    }

    render() {
        return (
            <div class="h-100 row align-items-center">
                <SearchBox id="searchBox" label="Item Name" parentFunction={this.handleItemChange}/>
            </div>
        );
    }
}

export default ItemLookup;