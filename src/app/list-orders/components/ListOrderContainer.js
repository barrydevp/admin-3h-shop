import React, {Component} from 'react'
import ListOrders from './ListOrders'
import {Page} from '@shopify/polaris'

class ListOrderContainer extends Component {
    render() {
        return (
            <Page fullWidth title="Orders">
                <ListOrders {...this.props} />
            </Page>
        )
    }
}

export default ListOrderContainer
