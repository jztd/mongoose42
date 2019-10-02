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
            let element = document.getElementById(`graphId${this.props.options.graphId}-${i+1}`);
            if (element.checked) element.checked = false;
        }
    }

    getCheckBoxes = (numCheckBoxes) => {
        if (!numCheckBoxes) return;
        
        let inputId = `graphId${this.props.options.graphId}-${numCheckBoxes}`;
        let labelId = `graph-${this.props.options.graphId}_checkbox-${numCheckBoxes}`;
        let onClickFunc = () => this.props.funcs.changeDisplayData(this.props.options.itemIds[numCheckBoxes-1]);

        return (
            <>
                {this.getCheckBoxes(numCheckBoxes-1)}
                <div className={`checkBox checkBox-${numCheckBoxes}`}>
                    <input type="checkbox" id={inputId} onClick={onClickFunc}></input>
                    <label id={labelId} htmlFor={inputId}></label>
                </div>
            </>
        )
    }

    getButtons = (name) => {
        let names = Object.keys(this.props.options.rangeToTime);
        let className = `btn ${this.props.options.selectedButton === name ? "graph-nav-active" : "graph-nav"}`;
        let onClickFunc = () => this.props.funcs.changeChartRange(name);
        let newButton = <button className={className} id={name} type="button" onClick={onClickFunc}>{name}</button>;

        if (names[names.length-1] === name) return newButton;

        return (
            <>
                {newButton}
                {this.getButtons(this.findNextName(names, name))}
            </>
        );
    }

    findNextName = (names, name) => {
        let nextName = '';

        names.reduce((prev,curr) => {
            if (prev) nextName = curr;
            if (curr === name) return true;
            return false;
        }, false);

        return nextName;
    }

    render () {
        let numCheckBoxes = Object.keys(this.props.options.itemIds).length;
        let startButton = Object.keys(this.props.options.rangeToTime)[0];
        return (
            <div className="col-sm-12 blah row">
                <div className="col-sm-7 justify-content-end">
                    {this.getCheckBoxes(numCheckBoxes)}
                </div>
                <div className="col-sm-5 justify-content-end btn-group pt-2">
                    {this.getButtons(startButton)}
                </div>
            </div>
        );
    }

}

export default GraphControlBar;