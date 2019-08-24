import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';
import {VictoryChart, VictoryLine} from 'victory';

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
        this.state = { item: "", priceData: [] };
    }


    componentDidUpdate (prevProps) {
        if (prevProps.itemName !== this.props.itemName) {
            this.api.getItemInfo(this.props.itemName).then(response => {
                console.log("got response " + response);
                this.setState({item : response});
                console.log(`Grabbing price information for ${this.state.item.name} (id #${this.state.item.id})`);
                this.api.getItemGraph(this.state.item.id).then(returnable => {
                    if (!returnable[0]) {
                        console.log("No pricing data was returned...");
                        return;
                    }
                    console.log(`Got graphical data for ${this.state.item.name}!`);
                    let formatData = [];
                    returnable.forEach(element => {
                        let time = new Date(element.date);
                        let price = element.daily/1000;
                        formatData.push({x: time, y: price});
                    });
                    this.setState({priceData: formatData});
                });
            });
        }
    }

    render() {
        const item = this.state.item;
        console.log(item, this.state.priceData);
        if(item){
            if (this.state.priceData[0]) {
                return (
                    <div>
                        <div>
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                            <img src={item.icon} alt={item.name} />
                        </div>
                        <VictoryChart >
                            <VictoryLine 
                                data = {this.state.priceData}
                            />
                        </VictoryChart > 
                    </div>
                );
            } else {
                return (
                    <div>
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <img src={item.icon} alt={item.name} />
                    </div>
                );
            }
        }
        return "";
    }
}

export default Item;