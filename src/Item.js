import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

class Item extends Component {
    static propTypes = {
        itemName: PropTypes.string
    };

    static defaultProps = {
        itemName: 'No Data Provided'
    };

    constructor(props) {
        super(props);
    
    }


    render() {
        const itemName = this.props.itemName;
        return (
            <div>
                {itemName}
            </div>
        );
    }
}

export default Item;