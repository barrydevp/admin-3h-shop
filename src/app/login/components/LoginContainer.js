import React, {Component} from 'react'
import {Page} from '@shopify/polaris'
import Login from './Login'
import withAuthContext from '../../shared/withAuthContext'
import {Redirect} from 'react-router-dom'
import {isAuthenticated as _isAuthenticated} from '../../../services/AuthServices'

class LoginContainer extends Component {
    render() {
        const {authContext} = this.props
        const {isAuthenticated} = authContext

        // console.log("hello")

        return isAuthenticated && _isAuthenticated() ? (
            <Redirect to={'/'} />
        ) : (
            <Page narrowWidth>
                <Login />
            </Page>
        )
    }
}

export default withAuthContext(LoginContainer)
