import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';

class Item extends Component {
    api = new RuneApi();

    static propTypes = {
        itemName: PropTypes.string
    };

    static defaultProps = {
        itemName: 'No Data Provided'
    };

    constructor(props) {
        super(props);
        this.state = { item: "" };
    }


    componentDidUpdate (prevProps) {
        if (prevProps.itemName !== this.props.itemName) {
            this.api.getItemInfo(this.props.itemName).then(response => {
                console.log("got response " + response);
                this.setState({item : response});
            });
        }
    }

    render() {
        const item = this.state.item;
        console.log(item);
        if(item){
            return (
                <div>
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <img src={item.icon} alt={item.name} />
                </div>
            );
        }
        return "";
    }
}

export default Item;