import React, {Component} from 'react'
import {logoutUser} from '../../../services/AuthServices'
import getHistory from '../../../store/getHistory'

class LogoutPage extends Component {
    componentDidMount() {
        this._logout()
    }

    _logout = () => {
        logoutUser()

        const history = getHistory()
        history.push('/login')
    }

    render() {
        return (
            <div className="Logout">
                <p>Logging out...</p>
            </div>
        )
    }
}

export default LogoutPage
