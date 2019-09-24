import React, { Component } from 'react';
import Item from './Item';
import TopBanner from './TopBanner';
import './App.css';

class ItemPage extends Component {

    constructor(props) {
        super(props);
        this.state = { itemName: this.props.match.params.name };
    }
    
    componentDidUpdate(prevProps) {

        if (prevProps.match.params.name !== this.props.match.params.name) {
            console.log("setting state");
            this.setState({ itemName: this.props.match.params.name });
        }
    }
    componentDidMount() {
        this.setState({ itemName: this.props.match.params.name });
    }

    render() {
        return (
            <>
                <div class="col-sm-2 sidebar h-100">
                    fdsfsdfsdf
                </div>
                <div class="col-sm-10">
                    <div class="row">
                        <TopBanner />
                    </div>
                        <Item itemName={this.state.itemName} />
                </div>
            </>
        );
    }
}

export default ItemPage;