import React from 'react'
import withAuthContext from './withAuthContext'
import {Redirect} from 'react-router-dom'
import {isAuthenticated as _isAuthenticated} from '../../services/AuthServices'

const withAuthentication = (WrappedComponent) => {
    function _withAuthentication(props) {
        const {authContext} = props
        const {isAuthenticated} = authContext

        return isAuthenticated && _isAuthenticated() ? (
            <WrappedComponent {...props} />
        ) : (
            <Redirect
                to={{
                    pathname: '/login',
                    state: {from: props.location},
                }}
            />
        )
    }

    const wrappedComponentName =
        WrappedComponent.displayName || WrappedComponent.name || 'Component'

    _withAuthentication.displayName = `withAuthentication(${wrappedComponentName})`

    return withAuthContext(_withAuthentication)
}

export default withAuthentication
