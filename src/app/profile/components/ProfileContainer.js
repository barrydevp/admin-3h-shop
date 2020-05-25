import React, {Component} from 'react'
import Profile from './Profile'

class ProfileContainer extends Component {
    render() {
        return <Profile {...this.props} className="ProfileContainer" />
    }
}

export default ProfileContainer
