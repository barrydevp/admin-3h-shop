import React from 'react'
import {Card, Loading, Page} from '@shopify/polaris'
import {getListUser} from '../../../services/api/UserAdminServices'
import UserTable from './UserTable'
import Pagination from '../../shared/Pagination'
import FilterTableUser from './FilterTableUser'
import InsertUser from './InsertUser'

const _parseQuery = (
    {email, name, role, status, start_date, end_date},
    page,
    limit
) => {
    const query = {}

    if (email) {
        query.email = (email + '').trim()
    }

    if (name) {
        query.name = (name + '').trim()
    }

    if (role) {
        query.role = role
    }

    if (status) {
        query.status = (status + '').trim()
    }

    if (start_date) {
        query.start_date = start_date
    }

    if (end_date) {
        query.end_date = end_date
    }

    const _page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    query.page = _page
    const _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit)
    query.limit = _limit

    return query
}

class ListUsers extends React.Component {
    _timeout = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            query: {
                name: '',
                email: '',
                role: '',
                status: '',
                start_date: '',
                end_date: '',
            },
            page: 1,
            limit: 20,
            users: {
                total: 0,
                data: [],
            },
        }
    }

    componentDidMount() {
        this.fetchListUser()
    }

    onSwitchPage = (page) => () => {
        if (page <= 0) {
            page = 1
        }
        this.setState(
            {
                page,
            },
            () => this.fetchListUser()
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
                this.fetchListUser(!disableLoading)
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
                this.fetchListUser(!disableLoading)
            }
        )
    }

    onInsertUser = (user) => {
        if (user) {
            this.setState((state) => {
                const {data, total} = state.users
                return {
                    users: {
                        data: [user, ...data],
                        total: total + 1,
                    },
                }
            })
        }
    }

    fetchListUser = (loading = true) => {
        const {query, page, limit} = this.state

        const parsedQuery = _parseQuery(query, page, limit)
        console.log(parsedQuery)
        this.setState({loading: loading, users: {data: [], total: 0}})

        if (this._timeout) {
            clearTimeout(this._timeout)
        }

        this._timeout = setTimeout(async () => {
            try {
                const {success, data, message} = await getListUser(parsedQuery)
                if (!success) {
                    throw new Error(message)
                }

                this.setState({
                    users: {data: data.data, total: data.total},
                    loading: false,
                })
            } catch (e) {
                this.setState({loading: false})
                alert(e.message || e)
            }
        }, 1000)
    }

    render() {
        const {loading, query, limit, page, users} = this.state
        const totalPage = Math.ceil(users.total / limit)
        const label = (totalPage > 0 && page + '/' + totalPage) || null

        return (
            <Page fullWidth title="Users">
                {loading && <Loading />}
                <InsertUser insert={this.onInsertUser} />
                <Card sectioned>
                    <Card.Subsection>
                        <FilterTableUser
                            query={query}
                            onChangeQuery={this.onChangeQuery}
                            onChangePaging={this.onChangePaging}
                            loading={loading}
                        />
                        <UserTable
                            query={query}
                            users={users.data}
                            limit={limit}
                            total={users.total}
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

export default ListUsers
