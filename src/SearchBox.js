import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
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
        console.log(this.props);
        this.state = {
            value: props.value || '',
            suggestions: [],
            redirect: false
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
    onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
        console.log('pushing stuff to history');
        this.setState({redirect:true});
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
        if (this.state.redirect === true) {
            this.state.redirect = false;
            return (<Redirect to={`/item/${this.state.value}`} push={true} />);
        }

        return (
            <>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelected}
                    inputProps={inputProps}
                />
            </>
        );
    }
}

export default SearchBox;