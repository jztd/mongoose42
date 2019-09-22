import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import RuneApi from './RunescapeApi';
import './App.css';

class Graph extends Component {
    api = new RuneApi();
    static rangeToTime = {
        'Year': {sliceInd: 0, timeScale: 'month'}, 
        'Quarter': {sliceInd: -90, timeScale: 'month'}, 
        'Month': {sliceInd: -30, timeScale: 'week'},
        'Week': {sliceInd: -7, timeScale: 'day'}
    };

    constructor(props) {
        super(props);
        this.state = { 
            refreshCounter: 0,
            displayData: [],
            displayOptions: {},
            selectedButton: "Year"
        };
        this.itemId = props.itemId;
        this.itemName = props.itemName;
        this.labels = [];
        this.datasets = {};
        this.colors = props.colors ? props.colors : ['#ff7f0e', '#00cc00', '#ff66cc', '#0066ff', '#9966ff'];
    }

    componentDidMount() {
        let promises = [];

        this.itemId.forEach(element => {
            promises.push(
                this.api.getItemGraph(element).then(returnable => {
                    if (!returnable[0]) {
                        console.log("No pricing data was returned...");
                        return;
                    }
                    let tempPriceArr = [];
                    returnable.forEach(datapoint => {
                        if (element === this.itemId[0]) {
                            this.labels.push(new Date(datapoint.date));
                        }
                        tempPriceArr.push(datapoint.daily);
                    });
                    this.datasets[element] =  tempPriceArr.slice(0);
                })
            )
        });
        
        Promise.all(promises).then(() => 
            this.setState({
                refreshCounter: this.state.refreshCounter + 1,
                displayData: this.formatData(),
                displayOptions: this.createOptions()
            })
        );
    }

    getFillInd = (sliceInd) => {
        return sliceInd ? this.labels.length + sliceInd : 0;
    }

    formatData = (dataset = this.datasets, labels = this.labels, sliceInd = 0) => {
        return {
            labels: this.getFillArray(labels, sliceInd).concat(labels.slice(sliceInd)),
            datasets: this.formatDatasets(dataset, sliceInd)
        }
    }

    getFillArray = (array, sliceInd) => {
        let fillInd = this.getFillInd(sliceInd);
        return new Array(fillInd).fill(array[fillInd]);
    }

    formatDatasets = (dataset = this.datasets, sliceInd = 0) => {
        let formattedDatasets = [];
        let count = 0;
        Object.keys(dataset).forEach(key => {
            let color = this.colors[count];
            formattedDatasets.push({
                label: this.itemName[count++],
                backgroundColor: 'transparent',     //Fill color from y = 0 to data points
                pointBackgroundColor: color,    //Fill color of data points
                pointHoverRadius: 3,
                borderColor: color,             //Border color of data points
                data: this.getFillArray(dataset[key], sliceInd).concat(dataset[key].slice(sliceInd))
            })
        });
        return formattedDatasets;
    }

    createOptions = (dataset = this.datasets, timeScale = 'month', tooltipStartInd = 0) => {
        let postFix = this.getPostFix(dataset);
        return {
            tooltips: {
                mode: 'nearest',
                intersect: false,
                filter: function(tooltipItem) {
                    if (tooltipItem.index < tooltipStartInd) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
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

    updateChart = (range = 'Year') => {
        let timeData = Graph.rangeToTime[range];
        this.setState({
            refreshCounter: this.state.refreshCounter + 1, 
            displayData: this.formatData(this.datasets, this.labels, timeData.sliceInd),
            displayOptions: this.createOptions(this.datasets, timeData.timeScale, this.getFillInd(timeData.sliceInd)), 
            selectedButton: range
        });
    }

    getPostFix = (dataset = this.datasets, fillInd = 0) => {
        let averages = [];
        Object.keys(dataset).forEach(key => averages.push(this.getArrAvg(dataset[key], fillInd)));
        let max = averages.reduce((prev,curr) => {
            return prev > curr ? prev : curr;
        });
        if (max > 1000000000) {
            return 'B';
        } else if (max > 1000000) {
            return 'M';
        } else if (max > 1000) {
            return 'k';
        } else {
            return '';
        }
    }

    getArrAvg = (arr = [0]) => {
        let avg = arr.reduce((acc,element) => {
            acc += element;
            return acc;
        });
        avg /= arr.length;
        return Math.floor(avg);
    }

    render() {
        return (
            <div className="col-sm-9 float-right mt-5">
                <div className="col-sm-12 graph-nav row justify-content-end btn-group pt-2">
                    <button className={`btn ${this.state.selectedButton === "Year" ? "graph-nav-active" : "graph-nav"}`} id="Year" type="button" onClick={() => this.updateChart("Year")}>Year</button>
                    <button className={`btn ${this.state.selectedButton === "Quarter" ? "graph-nav-active" : "graph-nav"}`} id="Quarter" type="button" onClick={() => this.updateChart("Quarter")}>Quarter</button>
                    <button className={`btn ${this.state.selectedButton === "Month" ? "graph-nav-active" : "graph-nav"}`} id="Month" type="button" onClick={() => this.updateChart("Month")}>Month</button>
                    <button className={`btn ${this.state.selectedButton === "Week" ? "graph-nav-active" : "graph-nav"}`} id="Week" type="button" onClick={() => this.updateChart("Week")}>Week</button>
                    <button className={`btn ${this.state.selectedButton === "Day" ? "graph-nav-active" : "graph-nav"}`} id="Day" type="button">Day</button>
                </div>
                <div className="row" id="graph">
                    <Line data={this.state.displayData} options={this.state.displayOptions}/>
                </div>
            </div>
        );
    }
}

export default Graph;