import React, {Component} from 'react'
import Statistics from './Statistics'
import {Page} from '@shopify/polaris'

export default class StatisticsContainer extends Component {
    render() {
        return (
            <Page fullWidth title="Statistics">
                <Statistics {...this.props} />
            </Page>
        )
    }
}
