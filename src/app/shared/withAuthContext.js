import React from 'react'
import AuthContext from './AuthContext'

const withAuthContext = (WrappedComponent) => {
    function _withAuthContext(props) {
        return (
            <AuthContext.Consumer>
                {(authContext) => (
                    <WrappedComponent {...props} authContext={authContext} />
                )}
            </AuthContext.Consumer>
        )
    }

    const wrappedComponentName =
        WrappedComponent.displayName || WrappedComponent.name || 'Component'

    _withAuthContext.displayName = `withAuthContext(${wrappedComponentName})`

    return _withAuthContext
}

export default withAuthContext
