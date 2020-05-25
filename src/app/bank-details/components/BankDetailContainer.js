import React, {Component} from 'react'
import {Page} from '@shopify/polaris'
import BankDetail from './BankDetail'

class BankDetailContainer extends Component {
    render() {
        return (
            <Page fullWidth
                  breadcrumbs={[{content: 'Store Settings', url: '/d/store-settings'}]}>
                <BankDetail/>
            </Page>
        )
    }
}

export default BankDetailContainer
