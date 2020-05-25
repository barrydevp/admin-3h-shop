import React, {Component} from 'react'
import OrderDetails from './OrderDetails'

class OrderDetailsContainer extends Component {
    render() {
        return <OrderDetails {...this.props} />
    }
}

export default OrderDetailsContainer
