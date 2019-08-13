import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RuneApi from './RunescapeApi';
import './App.css';

class Item extends Component {
    r = new RuneApi();
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
            this.r.getItem(this.props.itemName).then((result) => {
                this.setState({ results: result });
            });
        }
    }

    render() {
        const itemName = this.state.results;
        console.log(itemName);
        return (
            <div>
                {itemName}
            </div>
        );
    }
}

export default Item;