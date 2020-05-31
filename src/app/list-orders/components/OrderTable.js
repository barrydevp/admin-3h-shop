import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Badge, DataTable, TextStyle} from '@shopify/polaris'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import moment from 'moment'

const fulfillmentStatusStyleStatus = {
    'pending': '',
    'fulfilled': 'success',
    'in-production': 'attention',
    'shipped': 'info',
    'cancelled': 'critical',
}

const tableCol = [
    'Code',
    'Status',
    'Note',
    'Payment',
    'Fulfillment',
    'Total Price',
    'Paid At',
    'Fulfilled At',
    'Cancelled At',
]

const columnContentTypes = [
    'text',
    'text',
    'text',
    'text',
    'text',
    'text',
    'text',
    'text',
    'text',
]

class OrderTable extends Component {
    _upper = (value) => value.charAt(0).toUpperCase() + value.slice(1)

    _formatDate = (date, format = 'llll') =>
        date ? moment(date).format(format) : ''

    _getDetailLink = (order) => {
        const {_id} = order
        return `/orders/${_id}`
    }

    _mapRows = (orders) => {
        // const query = {...this.props.query}
        const rows = []

        orders.forEach((order) => {
            const {
                _id,
                note = '',
                total_price,
                status,
                payment_status,
                fulfillment_status,
                paid_at,
                fulfilled_at,
                cancelled_at,
            } = order

            const codeEl = (
                <span className="cursor-pointer text-blue-500">
                    <Link to={this._getDetailLink(order)}>{_id}</Link>
                </span>
            )

            const paymentEl = payment_status && (
                <Badge status={payment_status === 'pending' ? '' : 'success'}
                       progress={payment_status === 'pending' ? 'incomplete' : 'complete'}>{payment_status}</Badge>
            )

            const fulfillmentEl = fulfillment_status && (
                <Badge status={fulfillmentStatusStyleStatus[fulfillment_status] || ''}>{fulfillment_status}</Badge>
            )

            const statusEl = status && (
                <TextStyle
                    variation={
                        status === 'pending'
                            ? 'subdued'
                            : status === 'cancelled'
                            ? 'negative'
                            : 'positive'
                    }
                >
                    {status}
                </TextStyle>
            )

            const noteEl = note.length < 40 ? note : note.slice(0, 40) + '...'

            const totalPrice = total_price && (
                <TextStyle
                    variation={'positive'}
                >
                    {total_price}
                </TextStyle>
            )

            const paidAtEl = paid_at && this._formatDate(paid_at)
            const fulfilledAtEl = fulfilled_at && this._formatDate(fulfilled_at)
            const cancelledAtEl = cancelled_at && this._formatDate(cancelled_at)

            // const when = []
            // if (payment_status === 'paid') {
            //     when.push(this._formatDate(paid_at))
            // }
            // if (fulfillment_status === 'fulfilled') {
            //     when.push(this._formatDate(paid_at))
            // }
            //
            // if (fulfillment_status === 'fulfilled') {
            //     when.push(this._formatDate(paid_at))
            // }

            rows.push([
                codeEl,
                statusEl,
                noteEl,
                paymentEl,
                fulfillmentEl,
                totalPrice,
                paidAtEl,
                fulfilledAtEl,
                cancelledAtEl,
                // ...when,
            ])
        })

        return rows
    }

    _makeColumns = () => {
        // const query = {...this.props.query}

        const vHeading = [...tableCol]
        const vColumnContentTypes = [...columnContentTypes]

        // if (query.payment_status === 'paid') {
        // vHeading.push('Paid')
        // vColumnContentTypes.push('text')
        // } else {
        //     if (query.payment_status === 'pending') {
        //         vHeading.push('Created')
        //         vColumnContentTypes.push('text')
        //     } else {
        //         vHeading.push('Created', 'Paid')
        //         vColumnContentTypes.push('text', 'text')
        //     }
        // }

        return {
            heading: vHeading.map((text) => <b>{text}</b>),
            columnContentTypes: vColumnContentTypes,
        }
    }

    render() {
        const {page, limit, total, orders} = this.props
        const rows = this._mapRows(orders)
        const {heading, columnContentTypes} = this._makeColumns()
        const footer = `Showing ${(page - 1) * limit + 1} - ${
            page * limit
        } of ${total} results`

        return (
            <DataTable
                headings={heading}
                rows={rows}
                columnContentTypes={columnContentTypes}
                footerContent={footer}
            />
        )
    }
}

OrderTable.propTypes = {
    orders: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    displayOrderItem: PropTypes.bool.isRequired,
}

export default withRouter(OrderTable)
