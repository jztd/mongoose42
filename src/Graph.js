import React, { Component } from 'react';
import {VictoryChart, VictoryLine} from 'victory';

class Graph extends Component {
    render() {
        return (
            <VictoryChart >
                <VictoryLine />
            </VictoryChart >
            );
    }
}

export default Graph;