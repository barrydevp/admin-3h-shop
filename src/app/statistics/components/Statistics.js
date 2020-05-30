import React, {Component} from 'react'
import moment from 'moment'
import {statisticOrder} from '../../../services/api/StatisticAdminServices'
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
    week: ['week', 'This week'],
    seven_days: ['seven_days', 'Last 7 days'],
    month: ['month', 'This month'],
    threeMonth: ['threeMonth', '3 months'],
    allTime: ['allTime', 'All time'],
    custom: ['custom', 'Custom'],
}

const ranges = {
    yesterday: {
        created_at_from: new Date(
            moment(moment().subtract(1, 'day')).startOf('day'),
        ),
        created_at_to: new Date(moment().startOf('day')),
    },
    today: {
        created_at_from: new Date(moment().startOf('day')),
        created_at_to: new Date(),
    },
    month: {
        created_at_from: new Date(moment().startOf('month')),
        created_at_to: new Date(),
    },
    week: {
        created_at_from: new Date(moment().startOf('week')),
        created_at_to: new Date(),
    },
    seven_days: {
        created_at_from: new Date(moment().subtract(7, 'day')),
        created_at_to: new Date(),
    },
    threeMonth: {
        created_at_from: new Date(moment().subtract(3, 'month')),
        created_at_to: new Date(),
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
            'pending': 0,
            'paid': 0,
            'in_production': 0,
            'shipped': 0,
            'cancelled': 0,
            'fulfilled': 0,
            'total_order': 0,
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
                created_at_from: start,
                created_at_to: end,
            },
        })
    }

    _toggleCustomRange = () => {
        const {toggleCustomRange} = this.state
        this.setState({
            query: {
                created_at_from: new Date(),
                created_at_to: new Date(),
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
            () => this._fetchStatistics(),
        )
    }

    _fetchStatistics = async () => {
        const {query, loading} = this.state
        if (loading) return
        this.setState({
            loading: true,
        })
        try {
            const {success, data, message} = await statisticOrder(query)
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
        console.log(data)
        return Object.entries(data).map(([key, value]) => ({
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
        const {created_at_from, created_at_to} = query
        // console.log(query)
        const selected = {
            start: created_at_from || new Date(),
            end: created_at_to || new Date(),
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
        // const {payment_status, fulfillment_status} = statistics
        const statuses = this._makeDescriptionList(statistics)
        // const fulfillment = this._makeDescriptionList(fulfillment_status.result)
        const filterGroups = this._renderFilterGroups()
        const datePicker = this._renderDatePicker()

        return (
            <>
                <div className="mb-4">
                    <ButtonGroup segmented>{filterGroups}</ButtonGroup>
                    {datePicker}
                </div>
                <Layout>
                    <Layout.Section>
                        <Card title="Status" sectioned>
                            <DescriptionList items={statuses}/>
                        </Card>
                    </Layout.Section>
                    {/*<Layout.Section oneHalf>*/}
                    {/*    <Card title="Fulfillment" sectioned>*/}
                    {/*        <DescriptionList items={fulfillment} />*/}
                    {/*    </Card>*/}
                    {/*</Layout.Section>*/}
                </Layout>
            </>
        )
    }
}

export default Statistics
