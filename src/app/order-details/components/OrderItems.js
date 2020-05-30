import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Button, DescriptionList, TextStyle} from '@shopify/polaris'

class OrderItems extends Component {
    _renderOrderItem = (item) => {
        const {order_item: orderItem, product, warranty} = item
        const {_id: order_item_id, quantity} = orderItem
        const {_id: product_id, discount, image_path, name, out_price} = product

        const orderItemDetails = [
            {term: 'Name', description: name},
            {term: 'Price', description: `${Number(out_price).toLocaleString()}$`},
            {term: 'Discount', description: `${Math.round(Number(discount).toLocaleString() * 100)}%`},
            {term: 'Quantity', description: `${Number(quantity).toLocaleString()}`},
            {
                term: 'Warranty',
                description: (
                    <div>
                        {warranty && <b className="mr-1"><TextStyle
                            variation={
                                'subdued'
                            }
                        >
                            {JSON.stringify(warranty)}
                        </TextStyle></b>}
                    </div>
                ),
            },
        ]

        return (
            <div className="flex mb-4" key={`order_item_${order_item_id}`}>
                <div className="w-1/3 flex items-center flex-wrap">
                    <img className="w-full h-auto" src={image_path} alt=""/>
                    <div className="pt-2 w-full">
                        <Button external url={`https://web-3h-shop.herokuapp.com/products/${product_id}`} fullWidth>
                            View
                        </Button>
                    </div>
                </div>
                <div className="w-2/3 pl-4">
                    <DescriptionList items={orderItemDetails}/>
                </div>
            </div>
        )
    }

    render() {
        const {items} = this.props
        const orderItems = items.map(this._renderOrderItem)

        return <Fragment>{orderItems}</Fragment>
    }
}

OrderItems.propTypes = {
    items: PropTypes.array.isRequired,
}

export default OrderItems
