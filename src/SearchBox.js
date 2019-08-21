import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import LevenschteinSearch from './LevenschteinSearch';
import Autosuggest from 'react-autosuggest';



class SearchBox extends Component {
    static propTypes = {
        value: PropTypes.string,
        parentFunction: PropTypes.func
    };

    static defaultProps = {
        value: '',
        parentFunction: () => { return '' }
    };

    constructor(props) {
        super(props);
        
        this.state = {
            value: props.value || '',
            suggestions: []
        };
    }
    getSuggestionValue = (suggestion) => suggestion;
    renderSuggestion = (suggestion) => {
        return (<div style={{color:"white"}}>{suggestion}</div>);
    }
    getSuggestions = (value) => {
        let suggestions = LevenschteinSearch.getCloseNames(value);
        return suggestions.names;
    }
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({ suggestions: this.getSuggestions(value) });
    }
    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    }

    onChange = (event, { newValue }) => {
        this.setState({ value: newValue });
    }

    render() {
        const { value, suggestions } = this.state;
        let inputProps = {
            placeholder: 'Type an Item Name',
            value,
            onChange: this.onChange
        }
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />

        );
    }
}

export default SearchBox;