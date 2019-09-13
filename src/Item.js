import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';
import { Line } from 'react-chartjs-2';
import { access } from 'fs';
import { thisExpression } from '@babel/types';

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
        this.chartReference = {};
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

        if (avg > 1000000000) {
            this.postFix = 'B';
        } else if (avg > 1000000) {
            this.postFix = 'M';
        } else if (avg > 1000) {
            this.postFix = 'k';
        }
        return arr;
    }

    formatData = () => {
        let priceData = this.state.priceData;
        return {
            labels: this.getArrayFromPrice(priceData, 'x'),
            datasets: [{
                label: 'Price',
                backgroundColor: 'transparent',//This is the fill color from y = 0 to the data points
                pointBackgroundColor: '#ff7f0e',//The fill color of the point
                pointHoverRadius: 3,//Radius of the point when hovered
                //pointBorderColor: '#fff',//The stroke color of the point
                //pointHoverBackgroundColor: '#fff',//The hover fill color of the point
                //pointHoverBorderColor: 'rgba(220,220,220,1)',//The hover stroke color of the point
                borderColor: '#ff7f0e',//color of the border of the circles indicating datapoints?
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
                    gridLines: {
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    type: 'time',
                    time: {
                        tooltipFormat: 'MMM Do',
                        unit: 'month',
                        unitStepSize: 1
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Price (gp)'
                    },
                    ticks: {
                        callback: function(label,index,labels) {
                            if (postFix === 'B') {
                                return `${label/1000000000}${postFix}`;
                            } else if (postFix === 'M') {
                                return `${label/1000000}${postFix}`;
                            } else if (postFix === 'k') {
                                return `${label/1000}${postFix}`;
                            }
                            return `${label}`;
                        }
                    }
                }]
            }
        }
    }

    updateChart = (range) => {
        let length = this.state.priceData.length;
        let newPriceArray = [];
        switch (range) {
            case "Quarter":
                newPriceArray = this.state.priceData.slice(length-1-91);
                this.chartReference.chartInstance.options.scales.xAxes[0].time.unit = "month";
                //console.log('New Price Array: ', newPriceArray);
                break;
            case "Month":
                newPriceArray = this.state.priceData.slice(length-1-30);
                this.chartReference.chartInstance.options.scales.xAxes[0].time.unit = "week";
                break;
            case "Week":
                newPriceArray = this.state.priceData.slice(length-1-7);
                this.chartReference.chartInstance.options.scales.xAxes[0].time.unit = "day";
                break;
            default:
                newPriceArray = this.state.priceData;
                this.chartReference.chartInstance.options.scales.xAxes[0].time.unit = "month";
                break;
        }
        //console.log("The chart reference is: ", this.chartReference.chartInstance);
        this.chartReference.chartInstance.config.data.datasets[0].data = this.formatPriceArray(this.getArrayFromPrice(newPriceArray, 'y'));
        this.chartReference.chartInstance.config.data.labels = this.getArrayFromPrice(newPriceArray, 'x');
        this.chartReference.chartInstance.update();
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
                        <div id={"graph"}>
                            <button id="Year" type="button" onClick={() => this.updateChart("Year")}>Year</button>
                            <button id="Quarter" type="button" onClick={() => this.updateChart("Quarter")}>Quarter</button>
                            <button id="Month" type="button" onClick={() => this.updateChart("Month")}>Month</button>
                            <button id="Week" type="button" onClick={() => this.updateChart("Week")}>Week</button>
                            <button id="Day" type="button">Day</button>
                            <div>
                                <Line  ref={(reference) => this.chartReference = reference} data={this.formatData()} options={this.createOptions(this.postFix)}/>
                            </div>
                        </div>
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