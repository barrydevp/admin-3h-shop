import React, {Component} from 'react'
import Dashboard from './Dashboard'
import withAuthentication from '../../shared/withAuthentication'

class DashboardContainer extends Component {
    render() {
        return <Dashboard {...this.props} />
    }
}

export default withAuthentication(DashboardContainer)
