import React from 'react'
import {ChoiceList, DatePicker, Filters} from '@shopify/polaris'
import PropTypes from 'prop-types'
import keys from '../static/keys'
import moment from 'moment'

const _queryValueKeys = {
    name: 'Name',
    email: 'Email',
}

const _queryDateLabels = {
    created_at: 'Created at',
    updated_at: 'Updated at',
}

const _formatDate = (format) => (dateTime) => {
    return dateTime ? moment(dateTime).format(format) : ''
}

class FilterTableUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBy: 'name',
            datePicker: {
                month: (props[`start_date`] || new Date()).getMonth(),
                year: (props[`end_date`] || new Date()).getFullYear(),
            },
        }
    }

    onMonthChange = (newMonth, newYear) => {
        this.setState(({datePicker}) => {
            return {
                datePicker: {...datePicker, month: newMonth, year: newYear},
            }
        })
    }

    onChangeDateSelected = ({start, end}) => {
        this.props.onChangeQuery({
            [`start_date`]: start,
            [`end_date`]: end,
        })
    }

    onChangeChoiceList = (key) => ([v]) => {
        this.props.onChangeQuery({[key]: v})
    }

    onChangeChoiceListMul = (key) => (v) => this.props.onChangeQuery({[key]: v})

    onChangeText = (key) => (v) => this.props.onChangeQuery({[key]: v}, true)

    onClearQuery = (key) => (v) => this.props.onChangeQuery({[key]: ''}, true)

    onQueryClearAll = () => {
        const {onChangeQuery} = this.props

        const newQuery = {
            name: '',
            email: '',
            role: '',
            status: '',
            start_date: '',
            end_date: '',
        }

        // const newPaging = {
        //     page: 1,
        //     limit: 20,
        // }

        onChangeQuery(newQuery, true)
        // onChangePaging(newPaging, true)
    }

    getFilter = () => {
        const {query} = this.props
        const {datePicker, searchBy} = this.state

        const selectedDate = {
            start: query[`start_date`] || new Date(),
            end: query[`end_date`] || new Date(),
        }

        return [
            {
                key: 'searchBy',
                label: 'Search By',
                filter: (
                    <ChoiceList
                        title="Search By"
                        titleHidden
                        choices={Object.keys(_queryValueKeys).map((key) => ({
                            value: key,
                            label: _queryValueKeys[key],
                        }))}
                        selected={searchBy}
                        onChange={([v]) => this.setState({searchBy: v})}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'role',
                label: 'Role',
                filter: (
                    <ChoiceList
                        title="Role"
                        titleHidden
                        choices={[
                            {label: 'User', value: 'user'},
                            {label: 'Admin', value: 'admin'},
                        ]}
                        selected={query.role}
                        onChange={this.onChangeChoiceList('role')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'status',
                label: 'Status',
                filter: (
                    <ChoiceList
                        title="Status"
                        titleHidden
                        choices={[
                            {label: 'Active', value: 'active'},
                            {label: 'In Active', value: 'in_active'},
                        ]}
                        selected={query.status}
                        onChange={this.onChangeChoiceList('status')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'createdAt',
                label: 'Created at',
                filter: (
                    <DatePicker
                        allowRange
                        month={datePicker.month}
                        year={datePicker.year}
                        onChange={this.onChangeDateSelected}
                        onMonthChange={this.onMonthChange}
                        selected={selectedDate}
                    />
                ),
            },
        ]
    }

    getAppliedFilters = () => {
        const {query: filter} = this.props

        const result = []

        Object.keys(filter).forEach((key) => {
            if (key === 'end_date' || key === 'start_date') return

            const label = keys[key]
            if (!label) return ``

            const value = filter[key]
            if (!value) return

            result.push({
                key,
                label: `${label}: ${value.toString()}`,
                onRemove: this.onClearQuery(key),
            })
        })

        const queryDate = 'created_at'

        if (filter[`start_date`]) {
            const appliedDatePicker = {
                key: 'date_picker',
                onRemove: () => {
                    this.props.onChangeQuery({
                        [`start_date`]: '',
                        [`end_date`]: '',
                    })
                },
            }

            const dateFrom = _formatDate('DD/MM/YYYY')(filter[`start_date`])

            if (filter[`end_date`]) {
                const dateTo = _formatDate('DD/MM/YYYY')(filter[`end_date`])

                appliedDatePicker.label = `${_queryDateLabels[queryDate]}: ${
                    dateTo !== dateFrom ? `${dateFrom} - ${dateTo}` : dateFrom
                }`
            } else {
                appliedDatePicker.label = `${_queryDateLabels[queryDate]}: ${dateFrom}`
            }

            result.push(appliedDatePicker)
        }

        return result
    }

    render() {
        const {loading, query} = this.props
        const {searchBy} = this.state

        const filter = this.getFilter()
        const appliedFilters = this.getAppliedFilters()

        return (
            <Filters
                disabled={loading}
                queryValue={query[searchBy]}
                filters={filter}
                queryPlaceholder={`Find by ${_queryValueKeys[searchBy]}`}
                appliedFilters={appliedFilters}
                onQueryChange={this.onChangeText(searchBy)}
                onQueryClear={() => this.props.onChangeQuery({[searchBy]: ''})}
                onClearAll={this.onQueryClearAll}
            />
        )
    }
}

FilterTableUser.propTypes = {
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onChangePaging: PropTypes.func.isRequired,
}

export default FilterTableUser
