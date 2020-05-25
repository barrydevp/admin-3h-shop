import React, {Component} from 'react'
import {Page} from '@shopify/polaris'
import TrackingDetail from "./TrackingDetail"

class TrackingContainer extends Component {
    render() {
        return (
            <Page fullWidth
                breadcrumbs={[{content: 'Store Settings', url: '/d/store-settings'}]}>
               <TrackingDetail />
            </Page>
        )
    }
}

export default TrackingContainer
