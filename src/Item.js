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
    componentDidMount() {
        this.api.getItemInfo(this.props.itemName).then(response => {
            this.setState({ item: response });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.itemName !== this.props.itemName) {
            this.api.getItemInfo(this.props.itemName).then(response => {
                this.setState({ item: response });
            });
        }
    }
    
    render() {
        const item = this.state.item;
        if(item){
            return (
                <>
                    <div className="row">
                        <div className="col-1">{item.name}</div>
                        <div className="col-1">{item.description}</div>
                        <img className="col-2" src={item.icon} alt={item.name} />
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Graph itemNames={[item.name, 'Steadfast Boots', 'IS IT AN ITEM']} itemIds={[item.id, 21787, 2]} />
                        </div>
                    </div>
                </>
            );
        }
        return "No Item Information avaliable";
    }
}

export default Item;