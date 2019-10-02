import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import RuneApi from './RunescapeApi';
import {default as ControlBar} from './GraphControlBar.js';
import './App.css';

class Graph extends Component {
    api = new RuneApi();
    static rangeToTime = {
        'Year': {sliceInd: 0, timeScale: 'month'}, 
        'Quarter': {sliceInd: -90, timeScale: 'month'}, 
        'Month': {sliceInd: -30, timeScale: 'week'},
        'Week': {sliceInd: -7, timeScale: 'day'},
        'Day': {sliceInd:-1, timeScale: 'hour'}
    };
    static graphCount = 0;

    constructor(props) {
        super(props);
        this.state = { 
            refreshCounter: 0,
            datasets: {},
            displayData: [],
            displayOptions: {},
            selectedButton: "Year"
        };
        this.id = Graph.graphCount++;
        this.itemIds = props.itemIds;
        this.itemNames = props.itemNames;
        this.labels = [];
        this.datasets = {};
        this.colors = props.colors ? props.colors : ['#ff7f0e', '#00cc00', '#ff66cc', '#0066ff', '#9966ff'];
    }

    componentDidMount() {
        this.setUpGraph();
    }

    componentDidUpdate(prevProps) {
        if (!this.sameItems(prevProps.itemNames)) {
            //document.getElementById(`graph-${this.id}_checkbox-1`).click(); //Forces an onClick() event
            //Somehow it refreshes the checkbox '::after' settings so that when the graph reloads
            //all lines are shown and the boxes are reset.....idk, it works
            //REALLY NEED TO UPDATE THIS SO THAT THERE IS A MORE DIRECT LINK BETWEEN CSS AND DATA SHOWN STATES!!!
            this.setUpGraph();  
        }
    }

    //Requires this.itemIds, this.itemNames, this.labels, this.datasets to be setup/nulled
    setUpGraph = () => {
        this.nullProps();
        let promises = [];

        this.itemIds.forEach(element => {
            promises.push(
                this.api.getItemGraph(element).then(returnable => {
                    if (!returnable[0]) {
                        console.log("No pricing data was returned...");
                        return;
                    }
                    let tempPriceArr = [];
                    returnable.forEach(datapoint => {
                        if (element === this.itemIds[0]) {
                            this.labels.push(new Date(datapoint.date));
                        }
                        tempPriceArr.push(datapoint.daily);
                    });
                    this.datasets[element] =  tempPriceArr.slice(0);
                })
            )
        });

        let sliceInd = Graph.rangeToTime[this.state.selectedButton].sliceInd;
        let timeScale = Graph.rangeToTime[this.state.selectedButton].timeScale;
        
        Promise.all(promises).then(() => 
            this.setState({
                refreshCounter: this.state.refreshCounter + 1,
                datasets: this.datasets,
                labels: this.labels,
                displayData: this.formatData(this.datasets, this.labels, sliceInd),
                displayOptions: this.createOptions(this.datasets, timeScale, this.getFillInd(sliceInd))
            })
        );
    }

    nullProps = () => {
        this.itemIds = this.props.itemIds;
        this.itemNames = this.props.itemNames;
        this.datasets = {};
        this.labels = [];
    }

    //Needed to compare each item name, comparing just the lists of items would trigger
    //the if-statement before the new item names/ids were actually passed...
    sameItems = (prevItemNames) => {
        return  prevItemNames.reduce((prev,curr) => {
            if (!this.props.itemNames.includes(curr)) {
                return false;
            }
            return true && prev;
        }, true);
    }

    formatData = (dataset = this.state.datasets, labels = this.state.labels, sliceInd = 0) => {
        return {
            labels: this.getFillArray(labels, sliceInd).concat(labels.slice(sliceInd)),
            datasets: this.formatDatasets(dataset, sliceInd)
        }
    }
    
    getFillArray = (array, sliceInd) => {
        let fillInd = this.getFillInd(sliceInd);
        return new Array(fillInd).fill(array[fillInd]);
    }

    getFillInd = (sliceInd) => {
        return sliceInd ? this.labels.length + sliceInd : 0;
    }
    
    formatDatasets = (dataset = this.state.datasets, sliceInd = 0) => {
        let formattedDatasets = [];
        Object.keys(dataset).forEach(key => {
            let color = this.getColorfromItemId(key);       //There's only 5 colors available
            formattedDatasets.push({
                label: this.getItemNamefromItemId(key),
                backgroundColor: 'transparent',     //Fill color from y = 0 to data points
                pointBackgroundColor: color,        //Fill color of data points
                pointHoverRadius: 3,
                borderColor: color,                 //Border color of data points
                data: this.getFillArray(dataset[key], sliceInd).concat(dataset[key].slice(sliceInd))
            })
        });
        return formattedDatasets;
    }

    getColorfromItemId = (itemId) => {
        let count = 0;
        let color = '';
        this.itemIds.forEach(id => {
            if (id == itemId) {
                color = this.colors[count];
            }
            count++;
        });
        return color;
    }

    getItemNamefromItemId = (itemId) => {
        let count = 0;
        let itemName = '';
        this.itemIds.forEach(id => {
            if (id == itemId) {
                itemName = this.itemNames[count];
            }
            count++;
        });
        return itemName;
    }

    createOptions = (dataset = this.state.datasets, timeScale = 'month', tooltipStartInd = 0) => {
        let postFix = this.getPostFix(dataset, tooltipStartInd);
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
                        callback: function(label) {
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
    
    getPostFix = (dataset = this.state.datasets, fillInd = 0) => {
        if (!Object.keys(dataset)[0]){
            return '';
        }
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

    getArrAvg = (arr = [0], fillInd = 0) => {
        let avg = arr.slice(fillInd).reduce((acc,element) => {
            acc += element;
            return acc;
        });
        avg /= (arr.length - fillInd);
        return Math.floor(avg);
    }

    changeChartRange = (range = 'Year') => {
        let timeData = Graph.rangeToTime[range];
        this.setState({
            refreshCounter: this.state.refreshCounter + 1,
            displayData: this.formatData(this.state.datasets, this.state.labels, timeData.sliceInd),
            displayOptions: this.createOptions(this.state.datasets, timeData.timeScale, this.getFillInd(timeData.sliceInd)), 
            selectedButton: range
        });
    }

    changeDisplayData = (itemId, dataset = this.state.datasets) => {
        let timeData = Graph.rangeToTime[this.state.selectedButton];
        let modifiedDatasets = JSON.parse(JSON.stringify(dataset));
        let foundItem = false;
        Object.keys(dataset).forEach(key => {
            if (key == itemId) {
                delete modifiedDatasets[key];
                foundItem = true;
            }
        });

        if (!foundItem) {
            modifiedDatasets[itemId] = this.datasets[itemId];
        }

        this.setState({
            refreshCounter: this.state.refreshCounter + 1,
            datasets: modifiedDatasets,
            displayData: this.formatData(modifiedDatasets, this.state.labels, timeData.sliceInd),
            displayOptions: this.createOptions(modifiedDatasets, timeData.timeScale, this.getFillInd(timeData.sliceInd))
        });
    }

    // getCheckBox = (amt) => {
    //     if (amt < 1 || !amt) {
    //         return;
    //     }
    //     return (
    //         <>
    //             {this.getCheckBox(amt-1)}
    //             <div className={`checkBox checkBox-${amt}`}>
    //                 <input type="checkbox" id={`graphId${this.id}-${amt}`} onClick={() => this.changeDisplayData(this.state.datasets, this.itemIds[amt-1])}></input>
    //                 <label id={`graph-${this.id}_checkbox-${amt}`} htmlFor={`graphId${this.id}-${amt}`}></label>
    //             </div>
    //         </>
    //     )
    // }

    // getButton = (name) => {
    //     let names = Object.keys(Graph.rangeToTime);
    //     if (names[names.length-1] === name) {
    //         return (
    //             <>
    //                 <button className={`btn ${this.state.selectedButton === name ? "graph-nav-active" : "graph-nav"}`} id={name} type="button" onClick={() => this.changeChartRange(name)}>{name}</button>
    //             </>
    //         );
    //     }
    //     return (
    //         <>
    //             <button className={`btn ${this.state.selectedButton === name ? "graph-nav-active" : "graph-nav"}`} id={name} type="button" onClick={() => this.changeChartRange(name)}>{name}</button>
    //             {this.getButton(this.findNextName(names, name))}
    //         </>
    //     );
    // }

    // findNextName = (names, name) => {
    //     let nextName = '';
    //     let flag = false;
    //     names.forEach(element => {
    //         if (flag) {
    //             nextName = element;
    //             flag = false;
    //         }
    //         if (element === name) {
    //             flag = true;
    //             return;
    //         }
    //     });
    //     return nextName;
    // }

    render() {
        let funcsToPass = {
            'changeDisplayData': this.changeDisplayData,
            'changeChartRange': this.changeChartRange
        };
        let optsToPass = {
            'graphId': this.id,
            'colors': this.colors.slice(0,this.props.itemIds.length),
            'itemIds': this.itemIds,
            'rangeToTime': Graph.rangeToTime,
            'selectedButton': this.state.selectedButton
        };
        return (
            <>
                <div className="col-sm-9 float-right mt-5">
                    <ControlBar funcs={funcsToPass} options={optsToPass}/>
                    {/* <div className="col-sm-12 blah row">
                        <div className="col-sm-7 justify-content-end">
                            {this.getCheckBox(Object.keys(this.datasets).length)}
                        </div>
                        <div className="col-sm-5 justify-content-end btn-group pt-2">
                            {this.getButton(Object.keys(Graph.rangeToTime)[0])}
                        </div>
                    </div> */}
                    <div className="row" id="graph">
                        <Line data={this.state.displayData} options={this.state.displayOptions}/>
                    </div>
                </div>
            </>
        );
    }
}

export default Graph;