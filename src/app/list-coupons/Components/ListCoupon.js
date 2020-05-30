import React from 'react'
import {Card, Loading, Page} from '@shopify/polaris'
import {getListCoupon} from '../../../services/api/CouponServices'
import CouponTable from './CouponTable'
import Pagination from '../../shared/Pagination'
import FilterTable from './FilterTable'
import InsertCoupon from './InsertCoupon'

const _parseQuery = (
    {
        code, 
        expires_at_from,
        expires_at_to,
    },
    page,
    limit,
) => {
    const query = {}

    if (code) {
        query.code = (code + '').trim()
    }
    
    if (expires_at_from) {
        query.expires_at_from = expires_at_from
    }

    if (expires_at_to) {
        query.expires_at_to = expires_at_to
    }

    const _page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    query.page = _page
    const _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit)
    query.limit = _limit

    return query
}

class ListCoupon extends React.Component {
    _timeout = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            query: {
                code: '',
                expires_at_from: '',
                expires_at_to: '',
            },
            page: 1,
            limit: 20,
            coupons: {
                total: 0,
                data: [],
            },
        }
    }

    componentDidMount() {
        this.fetchListCoupon()
    }

    onSwitchPage = (page) => () => {
        if (page <= 0) {
            page = 1
        }
        this.setState(
            {
                page,
            },
            () => this.fetchListCoupon(),
        )
    }

    onChangeQuery = (newQuery, disableLoading) => {
        this.setState(
            ({query}) => {
                return {
                    query: {
                        ...query,
                        ...newQuery,
                    },
                    page: 1,
                    limit: 20,
                }
            },
            () => {
                this.fetchListCoupon(!disableLoading)
            },
        )
    }

    onChangePaging = ({page, limit}, disableLoading) => {
        this.setState(
            (state) => {
                return {
                    page: page ? page : state.page,
                    limit: limit ? limit : state.limit,
                }
            },
            () => {
                this.fetchListCoupon(!disableLoading)
            },
        )
    }

    onInsertCoupon = (coupon) => {
        if (coupon) {
            this.setState((state) => {
                const {data, total} = state.coupons
                return {
                    coupons: {
                        data: [coupon, ...data],
                        total: total + 1,
                    },
                }
            })
        }
    }

    onUpdateCoupon = (couponId, coupon) => {
        if (coupon) {
            this.setState((state) => {
                const {data, total} = state.coupons
                return {
                    coupons: {
                        data: data.map(e => {
                            return e._id === couponId ? coupon : e
                        }),
                        total: total,
                    },
                }
            })
        }
    }

    fetchListCoupon = (loading = true) => {
        const {query, page, limit} = this.state

        const parsedQuery = _parseQuery(query, page, limit)
        console.log(parsedQuery)
        this.setState({loading: loading, coupons: {data: [], total: 0}})

        if (this._timeout) {
            clearTimeout(this._timeout)
        }

        this._timeout = setTimeout(async () => {
            try {
                const {success, data, message} = await getListCoupon(parsedQuery)
                if (!success) {
                    throw new Error(message)
                }

                this.setState({
                    coupons: {data: data.data || [], total: data.total || 0},
                    loading: false,
                })
            } catch (e) {
                this.setState({loading: false})
                alert(e.message || e)
            }
        }, 1000)
    }

    render() {
        const {loading, query, limit, page, coupons} = this.state
        const totalPage = Math.ceil(coupons.total / limit)
        const label = (totalPage > 0 && page + '/' + totalPage) || null

        return (
            <Page fullWidth title="Coupons">
                {loading && <Loading/>}
                <InsertCoupon insert={this.onInsertCoupon}/>
                <Card sectioned>
                    <Card.Subsection>
                        <FilterTable
                            query={query}
                            onChangeQuery={this.onChangeQuery}
                            onChangePaging={this.onChangePaging}
                            loading={loading}
                        />
                        <CouponTable
                            query={query}
                            coupons={coupons.data}
                            limit={limit}
                            total={coupons.total}
                            page={page}
                            onUpdateCoupon={this.onUpdateCoupon}
                        />
                    </Card.Subsection>
                    <Card.Subsection>
                        <Pagination
                            label={label}
                            showQuickJumper
                            onSwitchPage={this.onSwitchPage}
                            amount={totalPage}
                            current={Number(page)}
                        />
                    </Card.Subsection>
                </Card>
            </Page>
        )
    }
}

export default ListCoupon
