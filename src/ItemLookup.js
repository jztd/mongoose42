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
            <div class="row h-100 justify-content-center align-items-center w-100">
                <SearchBox id="searchBox" label="Item Name" parentFunction={this.handleItemChange}/>
            </div>
        );
    }
}

export default ItemLookup;