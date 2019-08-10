import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';


class SearchBox extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        focussed: PropTypes.bool,
        value: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        focussed: false,
        value: '',
        label: '',
        onChange: () => { return '' }
    };

    constructor(props) {
        super(props);
        
        this.state = {
            focussed: false,
            value: props.value || '',
            label: props.label || '',
        };
    }

    onChange = (event) => {
        const { id } = this.props;
        const value = event.target.value;
        this.setState({ value: value });
        return this.props.onChange(id, value);
    }

    render() {
        const { focussed, value, label } = this.state;
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