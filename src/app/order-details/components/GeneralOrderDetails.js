import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DescriptionList, Button, TextStyle} from '@shopify/polaris'
import moment from 'moment'
import '../../../scss/app.scss'
import {changeOrderPaymentStatus, markOrderPaidManually} from '../../../services/api/OrderAdminServices'

class GeneralOrderDetails extends Component {

    _onChange = (key, value) => {
        this.setState({[key]: value}, () =>
            this.props.onChange({[key]: value}, key),
        )
    }

    _upper = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)
    _mapStyle = ({style, fulfillment_status}) =>
        this.setState({style, fulfillment_status})
    _formatDate = (date, format = 'llll') =>
        date ? moment(date).format(format) : ''

    _getPaidDate = () => {
        const {order} = this.props
        if (order.payment_status === 'paid') return ' at ' + this._formatDate(order.paid_at)

        return ''
    }

    _getFulfillDate = () => {
        const {order} = this.props
        if (order.fulfillment_status === 'fulfilled') return ' at ' + this._formatDate(order.fulfilled_at)
        if (order.fulfillment_status === 'cancelled') return ' at ' + this._formatDate(order.cancelled_at)

        return ''
    }

    _isPaid = () => {
        const {order} = this.props
        return order.payment_status === 'pending'
    }

    _markOrderPaidManually = async () => {
        const confirmPaidManually = window.confirm(
            'Are you sure with this change?',
        )
        if (confirmPaidManually) {
            // const {id} = this.props.match.params
            const {order} = this.props
            // const {success, data, message} = await changeOrderPaymentStatus(order._id, {payment_status: 'paid'})
            const {success, data, message} = await markOrderPaidManually(order._id, {payment_status: 'paid'})

            if (!success) return alert(message)

            this.props.fetchOrder()
        }
    }

    render() {
        const {order} = this.props
        const {payment_status, fulfillment_status, created_at, status} = order

        const statuses = [
            {
                term: 'Created At',
                description: (this._formatDate(created_at)),
            },
            {
                term: 'Status',
                description: (
                    <div>
                        {status && <b className="mr-1"><TextStyle
                            variation={
                                status !== 'pending' ? 'positive' : 'subdued'
                            }
                        >
                            {this._upper(status)}
                        </TextStyle></b>}
                    </div>
                ),
            },
            {
                term: 'Payment Status',
                description: (
                    <div>
                        {payment_status && <b className="mr-1"><TextStyle
                            variation={
                                payment_status === 'paid' ? 'positive' : 'subdued'
                            }
                        >
                            {this._upper(payment_status)}
                        </TextStyle></b>}
                        {this._getPaidDate()}
                    </div>
                ),
            },
            {
                term: 'Fulfilled Status',
                description: (
                    <div>
                        {fulfillment_status && <b className="mr-1"><TextStyle
                            variation={
                                fulfillment_status === 'fulfilled'
                                    ? 'positive'
                                    : fulfillment_status === 'cancelled'
                                    ? 'negative'
                                    : 'subdued'
                            }
                        >
                            {this._upper(fulfillment_status)}
                        </TextStyle></b>}
                        {this._getFulfillDate()}
                    </div>
                ),
            },
        ]

        const {traffic_source} = order
        if (traffic_source) {
            statuses.push({
                term: 'Source',
                description: traffic_source,
            })
        }

        return (
            <div className="clearfix">
                <DescriptionList items={statuses}/>
                <span style={{float: 'right'}}>
                    {this._isPaid() && (
                        <Button primary onClick={this._markOrderPaidManually}>
                            Mark Order Paid Manually
                        </Button>
                    )}
                </span>
            </div>
        )
    }
}

GeneralOrderDetails.propTypes = {
    onChange: PropTypes.func.isRequired,
    paidManually: PropTypes.func.isRequired,
    fetchOrder: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
}

export default GeneralOrderDetails
