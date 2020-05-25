import React from 'react'
import {
    getUserData,
    isAuthenticated,
    logoutUser,
    subscribe,
    unsubscribe,
} from '../../services/AuthServices'
import {
    clearSubscribeGlobalErrorRequest,
    subscribeGlobalErrorRequest,
} from '../../services/api/createApiServices'

const defaultValue = {
    isAuthenticated: false,
    loading: true,
    user: {},
}

const AuthContext = React.createContext(defaultValue)

class AuthContextProvider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...defaultValue,
        }
    }

    _logout = () => {
        this.setState({isAuthenticated: false, user: {}}, logoutUser)
    }

    componentDidMount() {
        subscribeGlobalErrorRequest(({status}) => {
            if (status === 403) {
                this._logout()
            }
        })

        subscribe(this._handleAuthChange)

        this._handleAuthChange()
    }

    componentWillUnmount() {
        clearSubscribeGlobalErrorRequest()
        unsubscribe(this._handleAuthChange)
    }

    _hasRole = (role = '') => {
        const {user} = this.state
        const roles = Array.isArray(user.roles) ? user.roles : []

        return roles.indexOf(role) !== -1
    }

    _getProfile = (key = '') => {
        const {user} = this.state
        const profile = Object.assign({}, user.profile)

        if (!key) return profile

        return profile[key] || null
    }

    _getUserObject = () => {
        const user = getUserData()

        return Object.assign({}, user, {
            hasRole: this._hasRole,
            getProfile: this._getProfile,
        })
    }

    _handleAuthChange = () => {
        this.setState({
            isAuthenticated: isAuthenticated(),
            user: this._getUserObject(),
            loading: false,
        })
    }

    render() {
        const {loading} = this.state

        return loading ? (
            <div>Loading...</div>
        ) : (
            <AuthContext.Provider
                value={{
                    ...this.state,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export {AuthContextProvider}

export default AuthContext
