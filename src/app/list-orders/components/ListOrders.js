import React, {Component} from 'react'
import {Card, Checkbox} from '@shopify/polaris'
import {getOrders} from '../../../services/api/OrderAdminServices'
import OrderTable from './OrderTable'
import Pagination from '../../shared/Pagination'
import FilterTable from './FilterTable'

const _parseQuery = ({
    code,
    status,
    payment_status,
    fulfillment_status,
    note,
    page,
    limit,
    paid_at_to,
    paid_at_from,
    cancelled_at_from,
    cancelled_at_to,
    fulfilled_at_from,
    fulfilled_at_to,
}) => {
    const query = {}

    if (code) {
        query._id = code.trim()
    }

    if (status) {
        query.status = status
    }

    if (note) {
        query.note = note.trim()
    }

    if (payment_status) {
        query.payment_status = payment_status.trim()
    }

    if (Array.isArray(fulfillment_status)) {
        query.fulfillment_status = fulfillment_status.join(',')
    }

    const _page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    query.page = _page
    const _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit)
    query.limit = _limit

    if (paid_at_to) {
        query.paid_at_to = paid_at_to
    }

    if (paid_at_from) {
        query.paid_at_from = paid_at_from
    }

    if (fulfilled_at_from) {
        query.fulfilled_at_from = fulfilled_at_from
    }

    if (fulfilled_at_to) {
        query.fulfilled_at_to = fulfilled_at_to
    }

    if (cancelled_at_from) {
        query.cancelled_at_from = cancelled_at_from
    }

    if (cancelled_at_to) {
        query.cancelled_at_to = cancelled_at_to
    }

    return query
}

class ListOrders extends Component {
    _timeout = null

    state = {
        loading: false,
        query: {
            code: '',
            note: '',
            status: '',
            payment_status: '',
            fulfillment_status: '',
            paid_at_from: '',
            paid_at_to: '',
            cancelled_at_from: '',
            cancelled_at_to: '',
            fulfilled_at_from: '',
            fulfilled_at_to: '',
            page: 1,
            limit: 10,
        },
        orders: {
            rows: [],
            count: 0,
        },
        displayOrderItem: false,
    }

    componentDidMount() {
        this._fetchOrders()
    }

    onChangeDisplayOrderItem = () => {
        this.setState((state) => {
            return {
                displayOrderItem: !state.displayOrderItem,
            }
        })
    }

    _switchPage = (page) => () => {
        const {query} = this.state
        if (page <= 0) {
            page = 1
        }
        this.setState(
            {
                query: {
                    ...query,
                    page,
                },
            },
            () => this._fetchOrders()
        )
    }

    _fetchOrders = (loading = true) => {
        const {query, orders} = this.state

        const validQuery = _parseQuery(query)

        this.setState({loading: loading, orders: {...orders, rows: []}})

        if (this._timeout) {
            clearTimeout(this._timeout)
        }

        this._timeout = setTimeout(async () => {
            try {
                const {success, data, message} = await getOrders(validQuery)
                if (!success) {
                    throw new Error(message)
                }

                const {data: rows, total: count} = data
                // console.log(rows)
                this.setState({orders: {rows: rows || [], count}, loading: false})
            } catch (e) {
                this.setState({loading: false})
                alert(e.message || e)
            }
        }, 1000)
    }

    _setQuery = (newQuery, disableLoading) => {
        this.setState(
            ({query}) => {
                return {
                    query: {
                        ...query,
                        ...newQuery,
                        page: 1,
                        limit: 10,
                    },
                }
            },
            () => {
                this._fetchOrders(!disableLoading)
            }
        )
    }

    render() {
        const {orders, query, loading, displayOrderItem} = this.state
        const totalPage = Math.ceil(orders.count / query.limit)
        const label = (totalPage > 0 && query.page + '/' + totalPage) || null

        return (
            <Card sectioned>
                <Card.Subsection>
                    <FilterTable
                        query={query}
                        setQuery={this._setQuery}
                        loading={loading}
                    />
                    {/*<div className="m-4">*/}
                    {/*    <Checkbox*/}
                    {/*        label="Display order items"*/}
                    {/*        checked={displayOrderItem}*/}
                    {/*        onChange={this.onChangeDisplayOrderItem}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <OrderTable
                        query={query}
                        orders={orders.rows}
                        limit={query.limit}
                        total={orders.count}
                        page={query.page}
                        displayOrderItem={displayOrderItem}
                    />
                </Card.Subsection>
                <Card.Subsection>
                    <Pagination
                        label={label}
                        showQuickJumper
                        onSwitchPage={this._switchPage}
                        amount={totalPage}
                        current={Number(query.page)}
                    />
                </Card.Subsection>
            </Card>
        )
    }
}

export default ListOrders
