import React, {Component} from 'react'
import ListUsers from './ListUsers'

class ListUserContainer extends Component {
    render() {
        return <ListUsers {...this.props} />
    }
}

export default ListUserContainer
