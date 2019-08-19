import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import LevenschteinSearch from './LevenschteinSearch';



class SearchBox extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        focussed: PropTypes.bool,
        value: PropTypes.string,
        label: PropTypes.string,
        parentFunction: PropTypes.func
    };

    static defaultProps = {
        focussed: false,
        value: '',
        label: '',
        parentFunction: () => { return '' }
    };

    constructor(props) {
        super(props);
        
        this.state = {
            focussed: false,
            value: props.value || '',
            label: props.label || '',
            matches: new Array(1),
            priorSpaces: 0,
        };
    }

    onChange = (event) => {
        const { id } = this.props;
        const value = event.target.value;
        const [matchArr, space] = LevenschteinSearch.getCloseNames(value, this.state.priorSpaces, this.state.matches);
        this.setState({ value: value, matches: matchArr, priorSpaces: space });
        
       // this.state.matches.forEach(item => console.log(item));
        return this.props.parentFunction(id, value);
    }

    render() {
        const { focussed, value, label, matches } = this.state;
        Object.keys(matches).forEach(key => console.log(matches[key]));
        const { id } = this.props;
        const searchClassName = `searchBoxContainer ${(focussed ? 'focussed' : '')}`
        return (
            <div className={searchClassName} >
                <input
                    id={id}
                    type="text"
                    value={value}
                    placeholder={label}
                    onChange={this.onChange}
                    onFocus={() => this.setState({ focussed: true })}
                    onBlur={() => this.setState({focussed: false})}
                />

                <label htmlFor={id} >
                    {label}
                </label>
            </div>
        );
    }
}

export default SearchBox;