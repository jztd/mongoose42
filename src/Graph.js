import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import RuneApi from './RunescapeApi';
import './App.css';

class Graph extends Component {
    api = new RuneApi();

    constructor(props) {
        super(props);
        this.state = { itemId: props.itemId, priceData: [], displayData: [], displayOptions: {}, selectedButton: "Year" };
        this.postFix = '';
    }

    componentDidMount() {
        this.api.getItemGraph(this.state.itemId).then(returnable => {
            if (!returnable[0]) {
                console.log("No pricing data was returned...");
                return;
            }
            let formatData = [];
            returnable.forEach(element => {
                let time = new Date(element.date);
                let price = element.daily;
                formatData.push({x: time, y: price});
            });
            this.setState({priceData: formatData, displayData: this.formatData(formatData), displayOptions: this.createOptions(this.postFix, 'month')});
        });

    }

    componentDidUpdate(prevProps) {
        console.log("GRAPH UPDATE");
        console.log("previous prop " + prevProps.itemId);
        console.log("current prop " + this.props.itemId)
        if (prevProps.itemId !== this.props.itemId) {
            console.log("GRAPH STTING NEW DATA");
            this.api.getItemGraph(this.state.itemId).then(returnable => {
                if (!returnable[0]) {
                    console.log("No pricing data was returned...");
                    return;
                }
                let formatData = [];
                returnable.forEach(element => {
                    let time = new Date(element.date);
                    let price = element.daily;
                    formatData.push({x: time, y: price});
                });
                this.setState({priceData: formatData, displayData: this.formatData(formatData), displayOptions: this.createOptions(this.postFix, 'month')});
            });
        }
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

    formatData = (data) => {
        return {
            labels: this.getArrayFromPrice(data, 'x'),
            datasets: [{
                label: 'Price',
                backgroundColor: 'transparent',//This is the fill color from y = 0 to the data points
                pointBackgroundColor: '#ff7f0e',//The fill color of the point
                pointHoverRadius: 3,//Radius of the point when hovered
                //pointBorderColor: '#fff',//The stroke color of the point
                //pointHoverBackgroundColor: '#fff',//The hover fill color of the point
                //pointHoverBorderColor: 'rgba(220,220,220,1)',//The hover stroke color of the point
                borderColor: '#ff7f0e',//color of the border of the circles indicating datapoints?
                data: this.formatPriceArray(this.getArrayFromPrice(data,'y'))
            }]
        }
    }

    createOptions = (postFix, timeScale) => {
        return {
            layout: {
                padding: {
                    left: 0,
                    right: 30,
                    top: 0,
                    bottom: 0
                }
            },
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
                        unit: timeScale,
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
        let timeScale = 'month';
        switch (range) {
            case "Quarter":
                newPriceArray = this.state.priceData.slice(length-1-91);
                break;
            case "Month":
                newPriceArray = this.state.priceData.slice(length-1-30);
                timeScale = "week";
                break;
            case "Week":
                newPriceArray = this.state.priceData.slice(length-1-7);
                timeScale = "day";
                break;
            default:
                newPriceArray = this.state.priceData;
                break;
        }
        this.setState({displayData: this.formatData(newPriceArray), displayOptions: this.createOptions(this.postFix, timeScale), selectedButton: range})
    }

    render() {
        console.log('RERENDIGNER GRAPH');
        return (
            <div class="col-sm-9 float-right mt-5">
                <div class="col-sm-12 graph-nav row justify-content-end btn-group pt-2">
                    <button className={`btn ${this.state.selectedButton === "Year" ? "graph-nav-active" : "graph-nav"}`} id="Year" type="button" onClick={() => this.updateChart("Year")}>Year</button>
                    <button className={`btn ${this.state.selectedButton === "Quarter" ? "graph-nav-active" : "graph-nav"}`} id="Quarter" type="button" onClick={() => this.updateChart("Quarter")}>Quarter</button>
                    <button className={`btn ${this.state.selectedButton === "Month" ? "graph-nav-active" : "graph-nav"}`} id="Month" type="button" onClick={() => this.updateChart("Month")}>Month</button>
                    <button className={`btn ${this.state.selectedButton === "Week" ? "graph-nav-active" : "graph-nav"}`} id="Week" type="button" onClick={() => this.updateChart("Week")}>Week</button>
                    <button className={`btn ${this.state.selectedButton === "Day" ? "graph-nav-active" : "graph-nav"}`} id="Day" type="button">Day</button>
                </div>
                <div class="row" id="graph">
                    <Line data={this.state.displayData} options={this.state.displayOptions}/>
                </div>
            </div>
        );
    }
}

export default Graph;