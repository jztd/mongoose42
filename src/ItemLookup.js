import React, { Component } from 'react';
import RuneApi from './RunescapeApi';
import SearchBox from './SearchBox';
import Item from './Item';
import './App.css';
import { arrayExpression } from '@babel/types';

class ItemLookup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentItemSearch: ''
        };
    }

    handleItemChange = (componentName, itemName) => {
        this.setState({ currentItemSearch: itemName });
        this.getCloseNames(itemName);
    }
    
    //Compares two strings and returns an integer metric of similarity. 0 indicates exact match.
    levenshteinDistance = (searchTerm, existingTerm) => {
        const rowAbv = new Array(existingTerm.length + 1);
        const rowBel = new Array(existingTerm.length + 1);
        
        for (let i = 0; i < rowAbv.length; i++) {
            rowAbv[i] = i;
        }

        for (let i = 0; i < searchTerm.length; i++) {
            rowBel[0] = i + 1;

            for (let j = 0; j < existingTerm.length; j++) {
                //Min of (deletion, insertion, substitution) costs.
                rowBel[j+1] = Math.min(rowAbv[j+1] + 1, rowBel[j] + 1, ((searchTerm[i] == existingTerm[j]) ? rowAbv[j] : rowAbv[j] + 1));
            }
            for (let j = 0; j < rowAbv.length; j++) {
                rowAbv[j] = rowBel[j];
            }
        }
        return rowAbv[rowAbv.length - 1];
    }

    //Compares the searchTerm to a saved list of items and returns the closest matches.
    getCloseNames = (searchTerm) => {
        const closeItems = [[100,"a"], [101, "b"], [102, "c"], [103, "d"], [104, "e"]];
        const itemNames = new RuneApi().getItemNames();

        itemNames.forEach(element => {
            const distance = this.levenshteinDistance(searchTerm.toLowerCase(), element.toLowerCase());
            for (let i = 0; i < closeItems.length; i++) {
                if (distance < 5 && closeItems[0][i] >= distance) {
                    closeItems.splice(i,0,[distance,element]);
                    closeItems.pop();
                    break;
                }
            }
        });
        closeItems.forEach(item => console.log(item));
        return closeItems;
    }

    render() {
        return (
            <div>
                <SearchBox id="searchBox" label="Item Name" parentFunction={this.handleItemChange}/>
                <Item itemName={this.state.currentItemSearch} />
            </div>
        );
    }
}

export default ItemLookup;