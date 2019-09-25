import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import RuneApi from './RunescapeApi';
import Graph from './Graph';

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
        this.state = { item: "" };
    }


    componentDidMount () {
       
        this.api.getItemInfo(this.props.itemName).then(response => {
            this.setState({item : response});
        });
        
    }

    render() {
        const item = this.state.item;
        if(item){
            return (
                <div>
                    <div>
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <img src={item.icon} alt={item.name} />
                    </div>
                    <Graph itemName={[item.name, 'Steadfast Boots', 'Ring of Life', 'Elder Rune Ore Box', 'God Wars Teleport']} itemId={[item.id, 21787, 2570, 44797, 31665]}/>
                    <Graph itemName={['Steadfast Boots']} itemId={[21787]}/>
                </div>
            );
        }
        return "";
    }
}

export default Item;