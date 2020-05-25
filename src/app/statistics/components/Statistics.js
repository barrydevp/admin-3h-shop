import React, {Component} from 'react'
import moment from 'moment'
import {getStatistics} from '../../../services/api/OrderStatisticsServers'
import {
    Button,
    ButtonGroup,
    Card,
    DescriptionList,
    Layout,
    DatePicker,
} from '@shopify/polaris'

const queryTypes = {
    today: ['today', 'Today'],
    yesterday: ['yesterday', 'Yesterday'],
    seven_days: ['seven_days', 'Last 7 days'],
    week: ['week', 'This week'],
    month: ['month', 'This month'],
    threeMonth: ['threeMonth', '3 months'],
    allTime: ['allTime', 'All time'],
    custom: ['custom', 'Custom'],
}

const ranges = {
    yesterday: {
        start_date: new Date(
            moment(moment().subtract(1, 'day')).startOf('day')
        ),
        end_date: new Date(moment().startOf('day')),
    },
    today: {
        start_date: new Date(moment().startOf('day')),
        end_date: new Date(),
    },
    month: {
        start_date: new Date(moment().startOf('month')),
        end_date: new Date(),
    },
    week: {
        start_date: new Date(moment().startOf('week')),
        end_date: new Date(),
    },
    seven_days: {
        start_date: new Date(moment().subtract(7, 'day')),
        end_date: new Date(),
    },
    threeMonth: {
        start_date: new Date(moment().subtract(3, 'month')),
        end_date: new Date(),
    },
    allTime: {
        is_all_time: true,
    },
}

class Statistics extends Component {
    state = {
        query: ranges.today,
        queryType: queryTypes.today[0],
        loading: false,
        statistics: {
            payment_status: {result: [], total: 0},
            fulfillment_status: {result: [], total: 0},
        },
        toggleCustomRange: false,
        displayPicker: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        },
    }

    componentDidMount() {
        this._fetchStatistics().then()
    }

    _onChangeMonth = (month, year) => {
        this.setState({
            displayPicker: {
                month: month,
                year: year,
            },
        })
    }

    _onChangeDateRange = ({start, end}) => {
        // console.log(start, end)
        this.setState({
            query: {
                start_date: start,
                end_date: end,
            },
        })
    }

    _toggleCustomRange = () => {
        const {toggleCustomRange} = this.state
        this.setState({
            query: {
                start_date: new Date(),
                end_date: new Date(),
            },
            queryType: 'custom',
            toggleCustomRange: !toggleCustomRange,
        })
    }

    _changeQuery = (type) => () => {
        const {queryType} = this.state
        if (queryType === type) return

        this.setState(
            {
                query: ranges[type],
                queryType: type,
                toggleCustomRange: false,
            },
            () => this._fetchStatistics()
        )
    }

    _fetchStatistics = async () => {
        const {query, loading} = this.state
        if (loading) return
        this.setState({
            loading: true,
        })
        try {
            const {success, data, message} = await getStatistics(query)
            this.setState({loading: false})
            if (!success) return alert(message)
            this.setState({statistics: data})
        } catch (e) {
            this.setState({loading: false})
            // console.log(e)
        }
    }

    _upper = (value) => value.charAt(0).toUpperCase() + value.slice(1)

    _makeDescriptionList = (data) => {
        if (!data.length) return []
        return Object.entries(data[0]).map(([key, value]) => ({
            term: this._upper(key),
            description: value,
        }))
    }

    _renderFilterGroups = () => {
        const {queryType} = this.state

        return Object.entries(queryTypes).map(([key, [value, title]]) => {
            const action =
                key === 'custom'
                    ? this._toggleCustomRange
                    : this._changeQuery(value)
            return (
                <Button
                    key={key}
                    primary={queryType === value}
                    onClick={action}
                >
                    {title}
                </Button>
            )
        })
    }

    _renderDatePicker = () => {
        const {
            toggleCustomRange,
            query,
            displayPicker,
            loading,
            queryType,
        } = this.state
        if (!toggleCustomRange) return null
        const {start_date, end_date} = query
        // console.log(query)
        const selected = {
            start: start_date || new Date(),
            end: end_date || new Date(),
        }
        // console.log(selected)
        return (
            <div className="my-4">
                <Card sectioned>
                    <DatePicker
                        allowRange
                        month={displayPicker.month}
                        year={displayPicker.year}
                        onChange={this._onChangeDateRange}
                        onMonthChange={this._onChangeMonth}
                        selected={selected}
                    />
                    <div className="my-4">
                        <ButtonGroup>
                            <Button>Cancel</Button>
                            <Button
                                primary={queryType === queryTypes['custom'][0]}
                                loading={loading}
                                onClick={this._fetchStatistics}
                            >
                                OK
                            </Button>
                        </ButtonGroup>
                    </div>
                </Card>
            </div>
        )
    }

    render() {
        const {statistics} = this.state
        const {payment_status, fulfillment_status} = statistics
        const payments = this._makeDescriptionList(payment_status.result)
        const fulfillment = this._makeDescriptionList(fulfillment_status.result)
        const filterGroups = this._renderFilterGroups()
        const datePicker = this._renderDatePicker()

        return (
            <>
                <div className="mb-4">
                    <ButtonGroup segmented>{filterGroups}</ButtonGroup>
                    {datePicker}
                </div>
                <Layout>
                    <Layout.Section oneHalf>
                        <Card title="Payment" sectioned>
                            <DescriptionList items={payments} />
                        </Card>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <Card title="Fulfillment" sectioned>
                            <DescriptionList items={fulfillment} />
                        </Card>
                    </Layout.Section>
                </Layout>
            </>
        )
    }
}

export default Statistics
