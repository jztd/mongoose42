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
        console.log("Updating");
        if (prevProps.itemName !== this.props.itemName) {
            console.log("not the same so running queries");
            this.r.getItem(this.props.itemName).then((result) => {
                console.log('setting state');
                this.setState({ results: result });
            });
        }
    }

    render() {
        console.log("rendering");
        console.log(this.state.results);
        const itemName = this.state.results;
        return (
            <div>
                {itemName}
            </div>
        );
    }
}

export default Item;