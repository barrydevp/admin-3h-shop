import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DescriptionList, TextStyle} from '@shopify/polaris'

class OrderInvoice extends Component {
    _renderNumber = (number, postfix = true) => {
        if (!number || number < 0)
            return <TextStyle variation="subdued">0</TextStyle>

        return `${Number(number).toLocaleString()}${postfix ? '$' : ''}`
    }

    _calculateInvoice = (_items, _shipping, total_price) => {
        const {quantity, discount, total} = _items.reduce((acc, item) => {
            const {order_item: orderItem, product} = item
            const {quantity} = orderItem
            const {out_price, discount} = product

            const vRawPrice = out_price * quantity
            const vDiscount = vRawPrice * discount

            return {
                quantity: acc.quantity + quantity,
                discount: acc.discount + vDiscount,
                total: acc.total + vRawPrice,
            }
        }, {quantity: 0, discount: 0, total: 0})

        // console.log(_shipping)
        const shipping = _shipping.reduce((acc, ship) => {
            const {price} = ship

            return acc + price
        }, 0)

        return {
            quantity: Math.floor(quantity * 10) / 10,
            discount: Math.floor(((total_price ? (total_price - total) : discount)) * 10) / 10,
            shipping: Math.floor(shipping * 10) / 10,
            total: Math.floor((total_price || total) * 10) / 10,
        }
    }

    render() {
        const {items, shipping: _shipping, total: total_price} = this.props

        // console.log(_shipping)
        const {quantity, shipping, discount, total} = this._calculateInvoice(items, _shipping, total_price)
        const invoiceDetails = [
            {
                term: 'Quantity',
                description: this._renderNumber(quantity, false),
            },
            {
                term: 'Shipping',
                description: this._renderNumber(shipping),
            },
            {
                term: 'Discount',
                description: this._renderNumber(discount),
            },
            {term: 'Total', description: this._renderNumber(total)},
        ]

        return <DescriptionList items={invoiceDetails} />
    }
}

OrderInvoice.propTypes = {
    items: PropTypes.array.isRequired,
    shipping: PropTypes.array.isRequired,
}

export default OrderInvoice
