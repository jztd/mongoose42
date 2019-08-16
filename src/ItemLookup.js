import React, { Component } from 'react';
import SearchBox from './SearchBox';
import Item from './Item';
import './App.css';
import { arrayExpression } from '@babel/types';

class ItemLookup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentItemSearch: ''
        };
    }

    handleItemChange = (componentName, itemName) => {
        this.setState({ currentItemSearch: itemName });
    }

    render() {
        return (
            <div>
                <SearchBox id="searchBox" label="Item Name" parentFunction={this.handleItemChange}/>
                <Item itemName={this.state.currentItemSearch} />
            </div>
        );
    }
}

export default ItemLookup;