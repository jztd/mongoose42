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
        this.postFix = '';
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

    formatPriceArray = (arr) => {
        //Determine the average price
        let avg = arr.reduce((acc,element) => {
            acc += element;
            return acc;
        });
        avg /= arr.length;
        let mapping = [1,''];
        if (avg > 1000000000) {
            mapping = [1000000000, 'B'];
        } else if (avg > 1000000) {
            mapping = [1000000, 'M'];
        } else if (avg > 1000) {
            mapping = [1000, 'k'];
        }
        this.postFix = mapping[1];
        return arr.map(element => element/mapping[0]);
    }

    formatData = () => {
        let priceData = this.state.priceData;
        return {
            labels: this.getArrayFromPrice(priceData, 'x'),
            datasets: [{
                //backgroundColor: 'rgba(255,99,132,0.2)',//This is the fill color from y = 0 to the data points
                pointStyle: 'star',
                borderColor: 'rgba(196,156,24,1)',//color of the border of the circles indicating datapoints
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',//color of the background of the small circle
                hoverBorderColor: 'rgba(255,99,132,1)',//color of the circle border when hovering
                data: this.formatPriceArray(this.getArrayFromPrice(priceData,'y'))
            }]
        }
    }

    createOptions = (postFix) => {
        return {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    type: 'time',
                    time: {
                        tooltipFormat: 'MMM Do',
                        unit: 'month',
                        unitStepSize: 1,
                        displayFormats: {
                            month: 'MMM YYYY'
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Price (gp)'
                    },
                    ticks: {
                        callback: function(label,index,labels) {
                            return `${label}${postFix}`;
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
                        <Line data={this.formatData()} options={this.createOptions(this.postFix)}/>
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