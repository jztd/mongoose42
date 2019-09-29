import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';
import Graph from './Graph';

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
    componentDidMount() {
        this.api.getItemInfo(this.props.itemName).then(response => {
            this.setState({ item: response });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.itemName !== this.props.itemName) {
            this.api.getItemInfo(this.props.itemName).then(response => {
                this.setState({ item: response });
            });
        }
    }
    
    render() {
        const item = this.state.item;
        if(item){
            return (
                <>
                    <div class="row">
                        <div class="col-1">{item.name}</div>
                        <div class="col-1">{item.description}</div>
                        <img class="col-2" src={item.icon} alt={item.name} />
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <Graph itemName={[item.name, 'Steadfast Boots']} itemId={[item.id, 21787]} />
                        </div>
                    </div>
                </>
            );
        }
        return "No Item Information avaliable";
    }
}

export default Item;