import React, { Component } from 'react';
import Item from './Item';
import './App.css';

class ItemPage extends Component {

    constructor(props) {
        super(props);
        this.state = { itemName: this.props.match.params.name };
    }

    render() {
        return (
            <Item itemName={this.state.itemName}/>
        );
    }
}

export default ItemPage;