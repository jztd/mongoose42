import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';
import { Line } from 'react-chartjs-2';
import { access } from 'fs';

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
        console.log("in item component" + this.props.itemName);
        this.state = { item: "", priceData: [] };
    }


    componentDidMount () {
       
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
                    let price = element.daily;
                    formatData.push({x: time, y: price});
                });
                this.setState({priceData: formatData});
            });
        });
        
    }

    getArrayFromPrice = (data, axis) => {
        return data.reduce((acc,element) => {
            acc.push(element[axis]);
            return acc;
        },[]);
    }

    formatData = () => {
        let priceData = this.state.priceData;
        return {
            labels: this.getArrayFromPrice(priceData, 'x'),
            datasets: [{
                label: 'Daily Price',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: this.getArrayFromPrice(priceData,'y')
            }]
        }
    }

    createOptions = () => {
        return {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'MMM Do',
                        unit: 'month',
                        unitStepSize: 1,
                        displayFormats: {
                            month: 'MMM YYYY'
                        }
                    }
                }]
            }
        }
    }

    render() {
        const item = this.state.item;
        if(item){
            if (this.state.priceData[0]) {
                return (
                    <div>
                        <div>
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                            <img src={item.icon} alt={item.name} />
                        </div>
                        <Line data={this.formatData()} options={this.createOptions()}/>
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