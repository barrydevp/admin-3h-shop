import React from 'react'
import {DatePicker, Filters} from '@shopify/polaris'
import PropTypes from 'prop-types'
import keys from '../static/keys'
import moment from 'moment'

const _formatDate = (format) => (dateTime) => {
    return dateTime ? moment(dateTime).format(format) : ''
}


class FilterTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBy: 'name',
            datePicker: {
                month: (props.query[`expires_at_from`] || new Date()).getMonth(),
                year: (props.query[`expires_at_to`] || new Date()).getFullYear(),
            },
        }
    }

    onChangeText = (key) => (v) => this.props.onChangeQuery({[key]: v}, true)

    onClearQuery = (key) => (v) => this.props.onChangeQuery({[key]: ''}, true)

    onQueryClearAll = () => {
        const {onChangeQuery} = this.props

        const newQuery = {
            name: '',
            tags: '',
            created_at_from: '',
            created_at_to: '',
        }

        // const newPaging = {
        //     page: 1,
        //     limit: 20,
        // }

        onChangeQuery(newQuery, true)
        // onChangePaging(newPaging, true)
    }

    _makeAppliedFilterOfDate = (filter, dateType) => {
        let appliedDatePicker = null

        if (filter[`${dateType}_from`]) {
            appliedDatePicker = {
                key: `date_picker_${dateType}`,
                onRemove: () => {
                    this.props.onChangeQuery({
                        [`${dateType}_from`]: '',
                        [`${dateType}_to`]: '',
                    })
                },
            }

            const dateFrom = _formatDate('DD/MM/YYYY')(
                filter[`${dateType}_from`]
            )

            if (filter[`${dateType}_to`]) {
                const dateTo = _formatDate('DD/MM/YYYY')(
                    filter[`${dateType}_to`]
                )

                appliedDatePicker.label = `Expires At: ${
                    dateTo !== dateFrom ? `${dateFrom} - ${dateTo}` : dateFrom
                }`
            } else {
                appliedDatePicker.label = `Expires At: ${dateFrom}`
            }
        }

        return appliedDatePicker
    }

    _onChangeMonth = (month, year) => {
        // this._setPaidAtDisplayMonth(month, year)
        this.setState(({datePicker}) => {
            return {
                datePicker: {...datePicker, month, year},
            }
        })
    }

    _onChangeDateRange = ({start, end}) => {
        // if (key === 'paid_at') return this._onChangePaidAt(value)
        this.props.onChangeQuery({
            expires_at_from: start,
            expires_at_to: end,
        })
    }

    getFilter = () => {
        const {datePicker} = this.state
        const {query} = this.props

        return [
            {
                key: 'expires_at_date_filter',
                label: `Expires At`,
                filter: (
                    <DatePicker
                        allowRange
                        month={datePicker.month}
                        year={datePicker.year}
                        onMonthChange={this._onChangeMonth}
                        onChange={this._onChangeDateRange}
                        selected={{
                            start: query[`expires_at_from`] || new Date(),
                            end: query[`expires_at_to`] || new Date(),
                        }}
                    />
                ),
                shortcut: true,
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

        const applyExpires = this._makeAppliedFilterOfDate(filter, 'expires_at')

        applyExpires && result.push(applyExpires)

        return result
    }

    render() {
        const {loading, query} = this.props

        const filter = this.getFilter()
        const appliedFilters = this.getAppliedFilters()

        return (
            <Filters
                disabled={loading}
                queryValue={query.code}
                filters={filter}
                queryPlaceholder={`Find by Code`}
                appliedFilters={appliedFilters}
                onQueryChange={this.onChangeText('code')}
                onQueryClear={() => this.props.onChangeQuery({code: ''})}
                onClearAll={this.onQueryClearAll}
            />
        )
    }
}

FilterTable.propTypes = {
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onChangePaging: PropTypes.func.isRequired,
}

export default FilterTable
