import React from 'react'
import {Card, Loading, Page} from '@shopify/polaris'
import {getListWarranty} from '../../../services/api/WarrantyServices'
import WarrantyTable from './WarrantyTable'
import Pagination from '../../shared/Pagination'
import FilterTable from './FilterTable'
import InsertWarranty from './InsertWarranty'

const _parseQuery = (
    {
        code,
        month,
        trial,
        status,
        category_id,
    },
    page,
    limit,
) => {
    const query = {}

    if (code) {
        query.code = (code + '').trim()
    }

    if (status) {
        query.status = (status + '').trim()
    }

    if (month) {
        query.month = parseInt(month)
    }

    if (trial) {
        query.trial = parseInt(trial)
    }
    
    if(category_id) {
        query.category_id = parseInt(category_id)
    }

    const _page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    query.page = _page
    const _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit)
    query.limit = _limit

    return query
}

class ListWarranty extends React.Component {
    _timeout = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            query: {
                code: '',
                month: 0,
                trial: 0,
                status: '',
                category_id: 0,
            },
            page: 1,
            limit: 20,
            warranties: {
                total: 0,
                data: [],
            },
        }
    }

    componentDidMount() {
        this.fetchListWarranty()
    }

    onSwitchPage = (page) => () => {
        if (page <= 0) {
            page = 1
        }
        this.setState(
            {
                page,
            },
            () => this.fetchListWarranty(),
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
                this.fetchListWarranty(!disableLoading)
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
                this.fetchListWarranty(!disableLoading)
            },
        )
    }

    onInsertWarranty = (warranty) => {
        if (warranty) {
            this.setState((state) => {
                const {data, total} = state.warranties
                return {
                    warranties: {
                        data: [warranty, ...data],
                        total: total + 1,
                    },
                }
            })
        }
    }

    onUpdateWarranty = (warrantyId, warranty) => {
        if (warranty) {
            this.setState((state) => {
                const {data, total} = state.warranties
                return {
                    warranties: {
                        data: data.map(e => {
                            return e._id === warrantyId ? warranty : e
                        }),
                        total: total,
                    },
                }
            })
        }
    }

    fetchListWarranty = (loading = true) => {
        const {query, page, limit} = this.state

        const parsedQuery = _parseQuery(query, page, limit)
        console.log(parsedQuery)
        this.setState({loading: loading, warranties: {data: [], total: 0}})

        if (this._timeout) {
            clearTimeout(this._timeout)
        }

        this._timeout = setTimeout(async () => {
            try {
                const {success, data, message} = await getListWarranty(parsedQuery)
                if (!success) {
                    throw new Error(message)
                }

                this.setState({
                    warranties: {data: data.data || [], total: data.total || 0},
                    loading: false,
                })
            } catch (e) {
                this.setState({loading: false})
                alert(e.message || e)
            }
        }, 1000)
    }

    render() {
        const {loading, query, limit, page, warranties} = this.state
        const totalPage = Math.ceil(warranties.total / limit)
        const label = (totalPage > 0 && page + '/' + totalPage) || null

        return (
            <Page fullWidth title="Warranties">
                {loading && <Loading/>}
                <InsertWarranty insert={this.onInsertWarranty}/>
                <Card sectioned>
                    <Card.Subsection>
                        <FilterTable
                            query={query}
                            onChangeQuery={this.onChangeQuery}
                            onChangePaging={this.onChangePaging}
                            loading={loading}
                        />
                        <WarrantyTable
                            query={query}
                            warranties={warranties.data}
                            limit={limit}
                            total={warranties.total}
                            page={page}
                            onUpdateWarranty={this.onUpdateWarranty}
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

export default ListWarranty
