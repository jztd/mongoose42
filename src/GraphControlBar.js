import React, { Component } from 'react';
import './App.css';

class GraphControlBar extends Component {

    componentDidUpdate = (prevProps) => {
        if (!this.sameIds(prevProps.options.itemIds)) this.uncheckCheckBoxes();
    }

    sameIds = (prevItemIds) => {
        return  prevItemIds.reduce((prev,curr) => {
            if (!this.props.options.itemIds.includes(curr)) return false;
            return true && prev;
        }, true);
    }

    uncheckCheckBoxes = () => {
        let numCheckBoxes = Object.keys(this.props.options.itemIds).length;

        for (let i = 0; i < numCheckBoxes; i++) {
            let element = document.getElementById(`graphId${this.props.options.graphId}-${i}`);
            if (element.checked) element.checked = false;
        }
    }

    makeCheckBoxes = () => {
        let numCheckBoxes = Object.keys(this.props.options.itemIds).length;
        let madeCheckBoxes = [];

        for (let i = 0; i < numCheckBoxes; i++) {
            let inputId = `graphId${this.props.options.graphId}-${i}`;
            let labelId = `graph-${this.props.options.graphId}_checkbox-${i}`;
            let onClickFunc = () => this.props.funcs.changeDisplayData(this.props.options.itemIds[i]);
            madeCheckBoxes.push(
                <>
                    <div className={`checkBox checkBox-${i}`}>
                        <input type="checkbox" id={inputId} onClick={onClickFunc}></input>
                        <label id={labelId} htmlFor={inputId}></label>
                    </div>
                </>
            );
        }

        return madeCheckBoxes;
    }

    makeButtons = () => {
        let names = Object.keys(this.props.options.rangeToTime);
        let madeButtons = [];

        names.forEach(name => {
            let className = `btn ${this.props.options.selectedButton === name ? "graph-nav-active" : "graph-nav"}`;
            let onClickFunc = () => this.props.funcs.changeChartRange(name);
            madeButtons.push(<button className={className} id={name} type="button" onClick={onClickFunc}>{name}</button>);          
        });

        return madeButtons;
    }

    render () {
        return (
            <div className="col-sm-12 blah row">
                <div className="col-sm-7 justify-content-end">
                    {this.makeCheckBoxes()}
                </div>
                <div className="col-sm-5 justify-content-end btn-group pt-2">
                    {this.makeButtons()}
                </div>
            </div>
        );
    }

}

export default GraphControlBar;