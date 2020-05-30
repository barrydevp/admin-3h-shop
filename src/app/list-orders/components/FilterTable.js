import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ChoiceList, DatePicker, Filters, Loading} from '@shopify/polaris'
import fulfillmentStatuses from '../static/fulfillmentStatuses'
import paymentStatuses from '../static/paymentStatuses'
import keys from '../static/keys'
import moment from 'moment'

const queryValueKeys = {
    code: 'Code',
    note: 'Note',
    status: 'Status'
}

const queryDateLabels = {
    created_at: 'Created at',
    paid_at: 'Paid at',
}

const dateFilters = [{key: 'paid_at', label: 'Paid At'}, {key: 'fulfilled_at', label: 'Fulfilled At'}, {key: 'cancelled_at', label: 'Cancelled At'}]

const _formatDate = (format) => (dateTime) => {
    return dateTime ? moment(dateTime).format(format) : ''
}

class FilterTable extends Component {
    constructor(props) {
        super(props)

        const queryDate =
            (props.query &&
                props.query.payment_status === 'paid' &&
                'paid_at') ||
            'created_at'

        this.state = {
            queryBy: 'code',
            tagValue: '',
            datePicker: {
                queryDate: queryDate,
                month: (props[`${queryDate}_to`] || new Date()).getMonth(),
                year: (props[`${queryDate}_to`] || new Date()).getFullYear(),
                ...dateFilters.reduce((prev, dateType) => {
                    return {...prev, [dateType.key]: this._convertToDatePicker(props.query, dateType.key)}
                }, {}),
            },
            isQueryFieldFocus: false,
        }
    }

    _onChangeQueryBy = ([by]) => {
        this.setState({
            queryBy: by,
        })
    }

    _onChangeMonth = (key) => (month, year) => {
        // this._setPaidAtDisplayMonth(month, year)
        this.setState(({datePicker}) => {
            return {
                datePicker: {...datePicker, [key] : {month, year}},
            }
        })
    }

    _setPaidAtDisplayMonth = (newMonth, newYear) => {
        // const {month, year} = this.state.paidAt

        // const decreaseYear = month === 0 && newMonth === 11
        // const increaseYear = month === 11 && newMonth === 0
        // const newYear = decreaseYear ? year - 1 : increaseYear ? year + 1 : year

        this.setState(({datePicker}) => {
            return {
                datePicker: {...datePicker, month: newMonth, year: newYear},
            }
        })
    }

    _onChangeDateRange = (key) => ({start, end}) => {
        // if (key === 'paid_at') return this._onChangePaidAt(value)
        this.props.setQuery({
            [`${key}_from`]: start,
            [`${key}_to`]: end,
        })
    }

    _onChangePaidAt = ({start, end}) => {
        this.props.setQuery({
            paid_at_from: start,
            paid_at_to: end,
        })
    }

    _setPaymentStatus = (value) => {
        this.props.setQuery({
            payment_status: value,
        })
    }

    _onChangeChoiceList = (key) => ([v]) => {
        if (key === 'payment_status') {
            this._setPaymentStatus(v)
        }

        this.props.setQuery({[key]: v})
    }

    _onChangeChoiceListMul = (key) => (v) => this.props.setQuery({[key]: v})

    _onChangeText = (key) => {
        return (v) => this.props.setQuery({[key]: v}, true)
    }

    _onQueryClear = (key) => () => {
        if (key === 'payment_status') {
            this._setPaymentStatus('')
        }

        this.props.setQuery({[key]: ''})
    }
    _onClearTag = (index) => () => {
        const tags = [...this.props.query.tags]

        tags.splice(index, 1)

        if (tags.length === 0) {
            this.props.setQuery({tags: ''})
            return
        }

        this.props.setQuery({tags}, true)
    }

    onKeydownFilter = (event) => {
        const enterKeyPressed = event.keyCode === 13 // Enter key code

        if (
            this.state.isQueryFieldFocus &&
            enterKeyPressed &&
            this.state.queryBy === 'tags'
        ) {
            event.preventDefault()
            const tags = this.state.tagValue
                .split(/[,\s;.]/g)
                .map((ns) => (ns ? (ns + '').trim() : ''))
                .filter(Boolean)

            this.setState({
                tagValue: '',
            })

            if (tags.length) this._addNewTag(tags)
        }
    }

    _makeAppliedFilterOfDate = (filter, dateType) => {
        let appliedDatePicker = null

        if (filter[`${dateType}_from`]) {
            appliedDatePicker = {
                key: `date_picker_${dateType}`,
                onRemove: () => {
                    this.props.setQuery({
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

                appliedDatePicker.label = `${queryDateLabels[dateType]}: ${
                    dateTo !== dateFrom ? `${dateFrom} - ${dateTo}` : dateFrom
                }`
            } else {
                appliedDatePicker.label = `${queryDateLabels[dateType]}: ${dateFrom}`
            }
        }

        return appliedDatePicker
    }

    _makeAppliedFilters = (filter) => {
        const result = []

        Object.keys(filter).forEach((key) => {
            if (key === 'end_date' || key === 'start_date') return

            const label = keys[key]
            if (!label) return ``

            const value = filter[key]
            if (!value) return

            if (key === 'tags') {
                const tags = value

                result.push(
                    ...tags.map((tag, i) => ({
                        key: key + i,
                        label: `${label}: ${tag.toString()}`,
                        onRemove: this._onClearTag(i),
                    }))
                )

                return
            }

            if (key === 'fulfillment_status') {
                const fulfillment_statuses = value
                // console.log(fulfillment_statuses)
                result.push({
                    key: key,
                    label:
                        fulfillment_statuses &&
                        `${label}: ${fulfillment_statuses
                            .join(', ')}`,
                    onRemove: this._onQueryClear(key),
                })

                return
            }

            result.push({
                key,
                label: `${label}: ${value.toString()}`,
                onRemove: this._onQueryClear(key),
            })
        })

        // const appliedPaidFilter = this._makeAppliedFilterOfDate(filter, 'paid_at')
        // const appliedFulfilledFilter = this._makeAppliedFilterOfDate(filter, 'fulfilled_at')
        // const appliedCancelledFilter = this._makeAppliedFilterOfDate(filter, 'cancelled_at')

        result.push(...dateFilters.map(dateType => {
            return this._makeAppliedFilterOfDate(filter, dateType.key)
        }).filter(e => e))

        // if(appliedPaidFilter) result.push(appliedPaidFilter)
        // if(appliedFulfilledFilter) result.push(appliedFulfilledFilter)
        // if(appliedCancelledFilter) result.push(appliedCancelledFilter)

        return result
    }

    _clearFilter = () => {
        const {query} = this.props
        const result = {}

        Object.keys(query).forEach((key) => {
            if (key === 'limit' || key === 'page') return

            result[key] = ''
        })

        this.props.setQuery(result)
    }

    _addNewTag = (tags) => {
        const oldTags = Array.isArray(this.props.query.tags)
            ? this.props.query.tags
            : []

        const newTags = Object.keys(
            [...oldTags, ...tags].reduce((acc, e) => {
                e && (acc[e] = 1)

                return acc
            }, {})
        ).map((e) => e.toLowerCase())

        this.props.setQuery({tags: newTags})
    }

    _beforeChangeTag = (event) => {
        const enterKeyPressed = event.keyCode === 13 // Enter key code
        if (enterKeyPressed) {
            event.preventDefault()
            const tags = this.state.tagValue
                .split(/[,\s;.]/g)
                .map((ns) => (ns ? (ns + '').trim() : ''))
                .filter(Boolean)

            this.setState({
                tagValue: '',
            })

            if (tags.length) this._addNewTag(tags)
        }
    }

    _convertSelectedDate = (query, dateType) => {
        return {
            start: query[`${dateType}_from`] || new Date(),
            end: query[`${dateType}_to`] || new Date(),
        }
    }

    _convertToDatePicker = (query, dateType) => {
        return {
            month: (query[`${dateType}_to`] || new Date()).getMonth(),
            year: (query[`${dateType}_to`] || new Date()).getFullYear(),
        }
    }

    render() {
        const {query, loading} = this.props
        const {queryBy, datePicker} = this.state

        // console.log(datePicker)

        const filters = [
            {
                key: 'queryBy',
                label: 'Search by',
                filter: (
                    <ChoiceList
                        title="Search By"
                        choices={Object.keys(queryValueKeys).map((k) => ({
                            value: k,
                            label: queryValueKeys[k],
                        }))}
                        selected={[queryBy]}
                        onChange={this._onChangeQueryBy}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'payment_status',
                label: 'Payment status',
                filter: (
                    <ChoiceList
                        title="Payment status"
                        choices={paymentStatuses}
                        selected={query.payment_status || []}
                        onChange={this._onChangeChoiceList('payment_status')}
                    />
                ),
                shortcut: true,
            },
            {
                key: 'fulfillment_status',
                label: 'Fulfillment status',
                filter: (
                    <ChoiceList
                        title="Fulfillment status"
                        choices={fulfillmentStatuses}
                        selected={query.fulfillment_status || []}
                        onChange={this._onChangeChoiceListMul(
                            'fulfillment_status'
                        )}
                        allowMultiple
                    />
                ),
                shortcut: true,
            },
            ...dateFilters.map(dateType => {
                const selectedDate = this._convertSelectedDate(query, dateType.key)

                return {
                    key: `${dateType.key}_date_filter`,
                    label: `${dateType.label}`,
                    filter: (
                        <DatePicker
                            key={`${dateType.key}_date_picker`}
                            allowRange
                            month={datePicker[dateType.key].month}
                            year={datePicker[dateType.key].year}
                            onMonthChange={this._onChangeMonth(dateType.key)}
                            onChange={this._onChangeDateRange(dateType.key)}
                            selected={selectedDate}
                        />
                    ),
                }
            }),
            // {
            //     key: 'paid_at_date_filter',
            //     label: `Paid At`,
            //     filter: (
            //         <DatePicker
            //             allowRange
            //             month={datePicker.month}
            //             year={datePicker.year}
            //             onMonthChange={this._onChangeMonth(queryDate)}
            //             onChange={this._onChangeDateRange(queryDate)}
            //             selected={selectedDate}
            //         />
            //     ),
            // },
            // {
            //     key: 'fulfilled_date_filter',
            //     label: `Fulfilled At`,
            //     filter: (
            //         <DatePicker
            //             allowRange
            //             month={datePicker.month}
            //             year={datePicker.year}
            //             onMonthChange={this._onChangeMonth(queryDate)}
            //             onChange={this._onChangeDateRange(queryDate)}
            //             selected={selectedDate}
            //         />
            //     ),
            // },
            // {
            //     key: 'cancelled_date_filter',
            //     label: `Cancelled At`,
            //     filter: (
            //         <DatePicker
            //             allowRange
            //             month={datePicker.month}
            //             year={datePicker.year}
            //             onMonthChange={this._onChangeMonth(queryDate)}
            //             onChange={this._onChangeDateRange(queryDate)}
            //             selected={selectedDate}
            //         />
            //     ),
            // },
        ]

        const appliedFilters = this._makeAppliedFilters(query)
        // console.log(appliedFilters)
        // console.log(filters)
        return (
            <React.Fragment>
                {loading && <Loading />}
                <div onKeyDown={this.onKeydownFilter}>
                    <Filters
                        disabled={loading}
                        queryValue={query[queryBy]}
                        filters={filters}
                        appliedFilters={appliedFilters}
                        queryPlaceholder={`Find by ${queryValueKeys[queryBy]}`}
                        onQueryChange={this._onChangeText(queryBy)}
                        onQueryClear={this._onQueryClear(queryBy)}
                        onClearAll={this._clearFilter}
                        onQueryFocus={() =>
                            this.setState({isQueryFieldFocus: true})
                        }
                        onQueryBlur={() =>
                            this.setState({isQueryFieldFocus: false})
                        }
                    />
                </div>
            </React.Fragment>
        )
    }
}

FilterTable.propTypes = {
    query: PropTypes.object.isRequired,
    setQuery: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default FilterTable
