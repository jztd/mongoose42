import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withAuth } from '@okta/okta-react';
import './App.css';

class UserBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: null,
            user: null
        };
    }

    componentDidMount = () => {
        this.checkAuthentication();
    }

    componentDidUpdate = () => {
        this.checkAuthentication();
    }

    login = () => {
        this.props.auth.login();
    }

    logout = () => {
        this.props.auth.logout();
    }

    checkAuthentication = async() => {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            const user = await this.props.auth.getUser();
            this.setState({ authenticated, user });
        }
    }

    render() {
        const { authenticated, user } = this.state;
        if (authenticated == null) {
            return null;
        }

        if (!authenticated) {
            return (
                <button type="button" class="btn btn-primary float-right" onClick={this.login} > Login! </button>
            );
        }

        return (
            <>
                {user.Name}
                <button type="button" class="btn btn-primary float-right" onClick={this.logout}> Logout! </button>
            </>
        );
    }

}

export default withAuth(UserBar);