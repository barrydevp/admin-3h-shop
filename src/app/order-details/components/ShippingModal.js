import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {
    DescriptionList,
    Modal,
    TextField,
} from '@shopify/polaris'
import {sendOrderToShipping} from '../../../services/api/OrderAdminServices'

class ShippingModal extends Component {
    state = {
        note: '',
        price: '',
        status: '',
        carrier: '',
        delivered_at: '',
        id: '',
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.order !== prevProps.order) {
            this._mapShipping(this.props.order)
        }
    }

    _mapShipping = (order) => {
        const {shipping: _shipping} = order
        const shipping = _shipping.length > 0 ? _shipping[0] : {}
        const {
            note,
            price,
            status,
            carrier,
            delivered_at,
        } = {note: '', price: 0, status: '', carrier: '', delivered_at: '', ...shipping}

        this.setState({
            note,
            price,
            status,
            carrier,
            delivered_at,
        })
    }

    _onClickSubmit = () => {
        if (window.confirm('Are you sure to send this order to shipping?'))
            return this._submit()
    }

    _validateForm = () => {
        const {carrier, price} = this.state
        if (!carrier || !price)
            return 'Carrier, Price should not be empty!'

        return false
    }

    _submit = async () => {
        const err = this._validateForm()
        if (err) return alert(err)
        const {...form} = this.state
        const {orderId} = this.props

        try {
            const {success, data, message} = await sendOrderToShipping(
                orderId,
                form,
            )
            if (!success) return alert(message)

            this.props.setShipping(data && [data] || [])
        } catch (e) {
            alert(e.message)
        }
    }

    _setNumber = (key, value) => {
        const parsedValue = value.replace(/,/g, '')

        if (isNaN(parsedValue)) return
        this.setState({
            [key]: +parsedValue,
        })
    }

    _renderContent = () => {
        const {
            note,
            price,
            status,
            carrier,
            delivered_at,
        } = this.state

        return (
            <>
                <div className="mb-6">
                    <TextField
                        label="Carrier"
                        value={carrier}
                        // multiline
                        maxLength={50}
                        showCharacterCount
                        onChange={(carrier) => this.setState({carrier})}
                        clearButton
                        onClearButtonClick={() => this.setState({carrier: ''})}
                    />
                </div>
                <div className="mb-6">
                    <TextField
                        label="Note"
                        value={note}
                        multiline
                        maxLength={200}
                        showCharacterCount
                        onChange={(note) => this.setState({note})}
                        clearButton
                        onClearButtonClick={() => this.setState({note: ''})}
                    />
                </div>
                <div className="mb-6">
                    <TextField
                        suffix="$"
                        label="Price"
                        value={Number(price || 0).toLocaleString('en-US')}
                        onChange={(price) => this._setNumber('price', price)}
                        helpText="Shipping Cost"
                        clearButton
                        onClearButtonClick={() => this.setState({value: 0})}
                    />
                </div>
                <div className="mb-6">
                    <TextField
                        label="Status"
                        value={status}
                        disabled
                    />
                </div>
                <div className="mb-6">
                    <TextField
                        label="Delivered At"
                        value={delivered_at}
                        disabled
                    />
                </div>
            </>
        )
    }

    _renderOrderItem = (item) => {
        const {product, order_item: orderItem} = item
        const {quantity} = orderItem
        const {out_price, name} = product
        const orderItemDetails = [
            {
                term: 'Name',
                description: name,
            },
            {
                term: 'Price',
                description: Number(out_price).toLocaleString(),
            },
            {
                term: 'Quantity',
                description: Number(quantity).toLocaleString(),
            },
        ]

        return (
            <Modal.Section key={`order_item_ship_${orderItem._id}`}>
                <DescriptionList key={`order_item_ship_${orderItem._id}`} items={orderItemDetails}/>
            </Modal.Section>
        )
    }

    render() {
        const {open, orderItems: items} = this.props
        const orderItems = items.map(this._renderOrderItem)
        const content = this._renderContent()

        return (
            <Modal
                open={open}
                onClose={this.props.toggle}
                primaryAction={{
                    content: 'OK',
                    onAction: this._onClickSubmit,
                    disabled: !this.props.order || !this.props.order.total_price || this.props.order.shipping.length > 0,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            this.props.toggle()
                        },
                    },
                ]}
                title="Shipping information"
            >
                <Modal.Section>{content}</Modal.Section>
                {orderItems}
            </Modal>
        )
    }
}

ShippingModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    orderItems: PropTypes.array.isRequired,
    orderId: PropTypes.number.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
    order: PropTypes.object.isRequired,
    setShipping: PropTypes.func.isRequired,
}

export default ShippingModal
