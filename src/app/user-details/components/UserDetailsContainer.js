import React, {Component} from 'react'
import UserDetails from './UserDetails'

class UserDetailsContainer extends Component {
    render() {
        const {match} = this.props
        const userId = match.params.userId

        return <UserDetails userId={userId} />
    }
}

export default UserDetailsContainer
