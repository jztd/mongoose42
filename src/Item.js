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

        this.state = { results: "" };
    }


    componentDidUpdate (prevProps) {
        if (prevProps.itemName !== this.props.itemName) {

        }
    }

    render() {
        const itemName = this.state.results;
        return (
            <div>
                {itemName}
            </div>
        );
    }
}

export default Item;