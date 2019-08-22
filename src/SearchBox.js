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

    getSuggestionValue = (suggestion) => suggestion.name;

    renderSuggestion = (suggestion) => {
        return (<span>{suggestion.name}</span>);
    }

    getSuggestions = (value) => {
        let suggestions = LevenschteinSearch.getCloseNames(value);

        return suggestions.names.reduce((acc, name) => {
            acc.push({highlighted: false, name});
            return acc;
        }, []);
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
    onSuggestionSelected = (event, {suggestion, suggestionValue}) => {
        console.log("got selection " + suggestionValue);
        this.props.parentFunction(suggestionValue);
    }
    onSuggestionHighlighted = ({suggestion}) => {
        suggestion.highlighted = true;
    }
    render() {
        const { value, suggestions } = this.state;
        let inputProps = {
            placeholder: 'Type an Item Name',
            value,
            onChange: this.onChange
        }
        return (
            <div class="searchContainer">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelected}
                    inputProps={inputProps}
                />
            </div>


        );
    }
}

export default SearchBox;