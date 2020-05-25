import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Button, Card, Collapsible, TextStyle} from '@shopify/polaris'
import moment from 'moment'

class OrderHistory extends Component {
    state = {toggleDetails: {}}

    _formatDate = (date, format = 'llll') =>
        date ? moment(date).format(format) : ''

    _toggleDetails = (historyId) => {
        const {toggleDetails} = this.state
        this.setState({
            toggleDetails: {
                ...toggleDetails,
                [historyId]: !toggleDetails[historyId],
            },
        })
    }

    _renderHistory = (history) => {
        const {toggleDetails} = this.state
        const details = Object.entries(history.value).map(([key, value]) => (
            <div
                className="flex justify-between pt-2"
                key={`order_${key}_${history._id}`}
            >
                <TextStyle variation="subdued">{key}</TextStyle>
                <TextStyle variation="subdued">
                    {JSON.stringify(value)}
                </TextStyle>
            </div>
        ))

        return (
            <Card.Section key={history._id}>
                <div className="flex justify-between">
                    <div>
                        <TextStyle variation="strong">
                            {history.event}
                        </TextStyle>
                        <br />
                        <TextStyle variation="subdued">
                            {this._formatDate(history.created)}
                        </TextStyle>
                    </div>
                    <Button onClick={() => this._toggleDetails(history._id)}>
                        Details
                    </Button>
                </div>
                <Collapsible
                    open={toggleDetails[history._id]}
                    transition={{duration: '150ms', timingFunction: 'ease'}}
                    id={`toggle_${history._id}`}
                >
                    {details}
                </Collapsible>
            </Card.Section>
        )
    }

    render() {
        const {history} = this.props
        const orderHistory = history.map(this._renderHistory)

        return <Fragment>{orderHistory}</Fragment>
    }
}

OrderHistory.propTypes = {
    history: PropTypes.array.isRequired,
}

export default OrderHistory
