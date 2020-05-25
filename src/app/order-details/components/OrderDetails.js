import {Card, Layout, Page, PageActions} from '@shopify/polaris'
import React, {Component} from 'react'
import {
    changeOrder,
    changeOrderFulfillmentStatus,
    changeOrderNote,
    changeOrderStyle,
    changeOrderTags,
    deleteOrder,
    getGhtkLabel,
    getOrderHistory,
    deleteOrderById,
    changeOrderPaymentStatus,
    getApiUrl,
} from '../../../services/api/OrderAdminServices'
import {
    getOrder,
    getOrderItemByOrderId,
    getOrderCustomerByOrderId,
    getOrderShippingByOrderId,
} from '../../../services/api/OrderServices'
import getQueryString from '../../../services/QueryString'
import {displayEditableFulfillmentStatus as displayFulfillmentStatus} from '../../../static/fulfillmentStatuses'
import {displayOrderStyles} from '../../../static/orderStyles'
import {useDashboardContext} from '../../shared/DashboardContext'
import CustomerDetails from './CustomerDetails'
import CustomerDetailsModal from './CustomerDetailsModal'
import GeneralOrderDetails from './GeneralOrderDetails'
import OrderInvoice from './OrderInvoice'
import OrderItems from './OrderItems'
import OrderNote from './OrderNote'
import ShippingModal from './ShippingModal'
import {
    PageDownMajorMonotone,
    ShipmentMajorMonotone,
} from '@shopify/polaris-icons'

class OrderDetails extends Component {
    state = {
        order: {
            code: getQueryString(this.props.location.search, 'code') || '',
            _id: Number(this.props.match.params.id),
            item: [],
            customer: null,
            shipping: [],
        },
        orderHistory: [],
        orderItems: [],
        editOrder: {},
        isOrderFetched: false,
        editing: {},
        isOrderEdited: false,
        loading: false,
        toggleEditCustomer: false,
        toggleShipping: false,
        ghtkLabel: '',
    }

    componentDidMount() {
        this._fetchOrder().then()
        this._fetchOrderItems().then()
        this._fetchOrderCustomer().then()
        this._fetchOrderShipping().then()
    }

    _resetOrder = () => {
        this.setState(
            {
                isOrderEdited: false,
                editOrder: this.state.order,
            },
            () => this._changeOrder(),
        )
    }

    _changeOrder = () => {
        this.setState({isOrderFetched: true}, () => {
            this.setState({isOrderFetched: false})
        })
    }

    _fetchOrderHistory = async () => {
        const {id} = this.props.match.params
        const {success, data, message} = await getOrderHistory(id)

        if (!success) return console.log(message)
        this.setState({orderHistory: data})
    }

    _fetchOrderItems = async () => {
        const {id} = this.props.match.params
        const {success, data, message} = await getOrderItemByOrderId(id)
        if (!success) return console.log(message)
        this.setState(({order}) => {
            return {
                order: {
                    ...order,
                    items: data || [],
                },
            }
        }, () => this._changeOrder())
    }

    _fetchOrderCustomer = async () => {
        const {id} = this.props.match.params
        const {success, data, message} = await getOrderCustomerByOrderId(id)
        if (!success) return console.log(message)
        this.setState(({order}) => {
            return {
                order: {
                    ...order,
                    customer: data,
                },
            }
        }, () => this._changeOrder())
    }

    _fetchOrderShipping = async () => {
        const {id} = this.props.match.params
        const {success, data, message} = await getOrderShippingByOrderId(id)
        if (!success) return console.log(message)
        this.setState(({order}) => {
            return {
                order: {
                    ...order,
                    shipping: data || [],
                },
            }
        }, () => this._changeOrder())
    }

    _fetchOrder = async () => {
        const {id} = this.props.match.params
        const {success, data, message} = await getOrder(id)
        if (!success) return alert(message)

        this.setState(({order}) => {
                return {
                    order: {
                        ...order,
                        ...data,
                    },
                    editOrder: data,
                    isOrderEdited: false,
                    editing: {},
                }
            },
            () => this._changeOrder(),
        )
    }

    _onEditOk = (data) => {
        this.setState(
            {
                order: data,
                editOrder: data,
                isOrderEdited: false,
                editing: {},
            },
            () => this._changeOrder(),
        )
    }

    _onEditOrder = (order, editingAttribute) => {
        const {editOrder, editing} = this.state
        this.setState({
            editOrder: {
                ...editOrder,
                ...order,
            },
            editing: {
                ...editing,
                [editingAttribute]: true,
            },
            isOrderEdited: true,
        })
    }

    _getChangeMethods = () => {
        const {editOrder, editing} = this.state
        const result = []

        Object.keys(editing).forEach((key) => {
            if (key === 'fulfillment_status')
                return result.push(
                    changeOrderFulfillmentStatus(editOrder._id, editOrder),
                )
            if (key === 'notes')
                return result.push(changeOrderNote(editOrder._id, editOrder))
            if (key === 'tags')
                return result.push(changeOrderTags(editOrder._id, editOrder))
        })

        return result
    }

    _submitAddressChange = (address) => {
        const {order, editOrder} = this.state

        this.setState({
            order: {...order, address},
            editOrder: {...editOrder, address},
            toggleEditCustomer: false,
        })
    }

    _submitChange = async () => {
        this.setState({loading: true})
        const {editOrder} = this.state

        const worker = [
            ...this._getChangeMethods(),
            changeOrder(editOrder._id, editOrder),
        ]

        try {
            const resp = await Promise.all(worker)
            this.setState({loading: false})
            if (resp.some(({success}) => success)) console.log('Error')
            this._onEditOk(editOrder)
        } catch (e) {
            this.setState({loading: false})
            alert(e.message)
        }
    }

    _onDelete = () => {
        if (window.confirm('Are you sure to delete this order?'))
            return this._deleteOrder()
    }

    _deleteOrder = async () => {
        try {
            const {id} = this.props.match.params
            this.setState({disabled: true})
            const {success, message} = await deleteOrder(id)
            this.setState({disabled: false})
            if (!success) return alert(message)
            this.props.history.push('/orders')
        } catch (e) {
            this.setState({disabled: false})
            alert(e.message)
        }
    }

    _toggleEditCustomerDetails = () =>
        this.setState(({toggleEditCustomer}) => ({
            toggleEditCustomer: !toggleEditCustomer,
        }))

    _onClickShipping = (ghtk_label = false) => {
        const {order} = this.state
        this.setState(({toggleShipping}) => ({
            toggleShipping: !toggleShipping,
            ...(ghtk_label && typeof ghtk_label === 'string'
                ? {order: {...order, ghtk_label}}
                : {}),
        }))
    }

    _getGhtkLabel = async () => {
        const {order} = this.state
        const {success, data, message} = await getGhtkLabel(order._id)
        if (!success) return alert(message)
        const newWindow = window.open(`${getApiUrl}${data}`, 'SHIPPING')
        newWindow.focus()
    }

    _markOrderPaidManually = async () => {
        const confirmPaidManually = window.confirm(
            'Are you sure with this change?',
        )
        if (confirmPaidManually) {
            const {editOrder, order} = this.state
            const {success, data, message} = await changeOrderPaymentStatus(order._id, {payment_status: 'paid'})

            if (!success) return alert(message)

            this._fetchOrder()
        }
    }

    _changeOrderFulfillmentStatus = async (_fulfillment_status) => {
        const {order, editOrder} = this.state
        try {
            const {success, data, message} = await changeOrderFulfillmentStatus(
                order._id,
                {
                    fulfillment_status: _fulfillment_status,
                },
            )
            if (!success) return console.log(message)

            this._fetchOrder()
        } catch (e) {
            return console.log(e)
        }
    }

    _changeOrderStyle = async (style) => {
        const {order, editOrder} = this.state
        try {
            const {success, data, message} = await changeOrderStyle(order._id, {
                style,
            })
            if (!success) return console.log(message)
            this.setState({
                order: {
                    ...order,
                    ...data,
                },
                editOrder: {
                    ...editOrder,
                    ...data,
                },
            })
        } catch (e) {
            return console.log(e)
        }
    }

    _setShipping = (shipping) => {
        this.setState(({order}) => {
            return {
                order: {
                    ...order,
                    shipping,
                }
            }
        })
    }

    _renderStyleActions = () => {
        return displayOrderStyles.map(({value, label}) => ({
            content: label,
            onAction: () => this._changeOrderStyle(value),
        }))
    }

    _renderFulfillmentStatusActions = () => {
        return displayFulfillmentStatus.map(({value, label}) => ({
            content: label,
            onAction: () => this._changeOrderFulfillmentStatus(value),
        }))
    }

    _renderStyle = (style) => {
        const found = displayOrderStyles.find(({value}) => value === style)

        if (found) return found.label
        return ''
    }

    _renderFulfillmentStatus = (status) => {
        const found = displayFulfillmentStatus.find(
            ({value}) => value === status,
        )

        if (found) return found.label
        return 'Pending'
    }

    render() {
        const {
            editOrder,
            order,
            isOrderFetched,
            loading,
            toggleShipping,
        } = this.state
        
        const fulfillmentStatusActions = this._renderFulfillmentStatusActions()
        const fulfillmentStatus = this._renderFulfillmentStatus(
            editOrder.fulfillment_status,
        )

        return (
            <Page
                fullWidth
                title={order.code || ''}
                primaryAction={{
                    content: 'Shipping',
                    onAction: this._onClickShipping,
                    icon: ShipmentMajorMonotone,
                }}
                actionGroups={[
                    {
                        title: 'Fulfillment Status: ' + fulfillmentStatus,
                        accessibilityLabel:
                            'Change your order fulfillment status',
                        actions: fulfillmentStatusActions,
                    },
                ]}
                breadcrumbs={[{content: 'Orders', url: '/orders'}]}
            >
                <ShippingModal
                    open={toggleShipping}
                    toggle={this._onClickShipping}
                    orderItems={order.items || []}
                    orderId={order._id || 0}
                    order={order}
                    isOrderChanged={isOrderFetched}
                    setShipping={this._setShipping}
                />
                <Layout>
                    <Layout.Section>
                        <Card title="Order Details" sectioned>
                            <GeneralOrderDetails
                                isOrderChanged={isOrderFetched}
                                order={editOrder}
                                onChange={this._onEditOrder}
                                paidManually={this._markOrderPaidManually}
                                fetchOrder={this._fetchOrder}
                            />
                        </Card>
                        <Card title="Order Items" sectioned>
                            <OrderItems items={order.items || []}/>
                        </Card>
                        <Card title="Invoice" sectioned>
                            <OrderInvoice items={order.items || []} shipping={order.shipping || []} total={order.total_price || 0}/>
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card
                            title="Customer"
                            sectioned
                            // actions={customerDetailsActions}
                        >
                            <CustomerDetails
                                customer={order.customer || {}}
                                isOrderChanged={isOrderFetched}
                                onChange={this._onEditOrder}
                            />
                        </Card>
                        <Card title="Note" sectioned>
                            <OrderNote
                                orderId={order._id || 0}
                                note={editOrder.note || ''}
                                onChange={this._onEditOrder}
                                isOrderChanged={isOrderFetched}
                            />
                        </Card>
                    </Layout.Section>
                </Layout>
                <div className="mt-8"/>
                <PageActions
                    secondaryActions={[
                        {
                            content: 'Delete',
                            onAction: this._onDelete,
                            destructive: true,
                            disabled: loading,
                        },
                    ]}
                />
            </Page>
        )
    }
}

export default useDashboardContext(OrderDetails)
