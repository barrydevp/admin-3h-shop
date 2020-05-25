import React, {Component} from 'react'
import {Page} from '@shopify/polaris'
import StoreDetail from "./StoreDetail"

class StoreDetailContainer extends Component {
    render() {
        return (
            <Page fullWidth
                  breadcrumbs={[{content: 'Store Settings', url: '/d/store-settings'}]}>
                <StoreDetail/>
            </Page>
        )
    }
}

export default StoreDetailContainer
