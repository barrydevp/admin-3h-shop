import React from 'react'
import {Card, Loading, Page} from '@shopify/polaris'
import {getListProduct} from '../../../services/api/ProductServices'
import ProductTable from './ProductTable'
import Pagination from '../../shared/Pagination'
import FilterTableProduct from './FilterTableProduct'
import InsertProduct from './InsertProduct'

const _parseQuery = (
    {name, tags},
    page,
    limit
) => {
    const query = {}

    if (name) {
        query.name = (name + '').trim()
    }    
    if (tags) {
        query.tags = (tags + '').trim()
    }

    const _page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    query.page = _page
    const _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit)
    query.limit = _limit

    return query
}

class ListProduct extends React.Component {
    _timeout = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            query: {
                name: '',
                tags: '',
            },
            page: 1,
            limit: 20,
            products: {
                total: 0,
                data: [],
            },
        }
    }

    componentDidMount() {
        this.fetchListProduct()
    }

    onSwitchPage = (page) => () => {
        if (page <= 0) {
            page = 1
        }
        this.setState(
            {
                page,
            },
            () => this.fetchListProduct()
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
                this.fetchListProduct(!disableLoading)
            }
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
                this.fetchListProduct(!disableLoading)
            }
        )
    }

    onInsertProduct = (product) => {
        if (product) {
            this.setState((state) => {
                const {data, total} = state.products
                return {
                    products: {
                        data: [product, ...data],
                        total: total + 1,
                    },
                }
            })
        }
    }

    fetchListProduct = (loading = true) => {
        const {query, page, limit} = this.state

        const parsedQuery = _parseQuery(query, page, limit)
        console.log(parsedQuery)
        this.setState({loading: loading, products: {data: [], total: 0}})

        if (this._timeout) {
            clearTimeout(this._timeout)
        }

        this._timeout = setTimeout(async () => {
            try {
                const {success, data, message} = await getListProduct(parsedQuery)
                if (!success) {
                    throw new Error(message)
                }

                this.setState({
                    products: {data: data.data || [], total: data.total || 0},
                    loading: false,
                })
            } catch (e) {
                this.setState({loading: false})
                alert(e.message || e)
            }
        }, 1000)
    }

    render() {
        const {loading, query, limit, page, products} = this.state
        const totalPage = Math.ceil(products.total / limit)
        const label = (totalPage > 0 && page + '/' + totalPage) || null

        return (
            <Page fullWidth title="Products">
                {loading && <Loading />}
                <InsertProduct insert={this.onInsertProduct} />
                <Card sectioned>
                    <Card.Subsection>
                        <FilterTableProduct
                            query={query}
                            onChangeQuery={this.onChangeQuery}
                            onChangePaging={this.onChangePaging}
                            loading={loading}
                        />
                        <ProductTable
                            query={query}
                            products={products.data}
                            limit={limit}
                            total={products.total}
                            page={page}
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

export default ListProduct
