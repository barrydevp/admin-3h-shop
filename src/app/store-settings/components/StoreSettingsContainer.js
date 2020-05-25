import React, {Component} from 'react'
import StoreSettings from './StoreSettings'
import {Page} from '@shopify/polaris'

export default class StoreSettingsContainer extends Component {
    render() {
        return (
            <Page fullWidth title="Store Settings">
                <StoreSettings {...this.props} />
            </Page>
        )
    }
}
