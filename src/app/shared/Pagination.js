import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Pagination as P, TextField} from '@shopify/polaris'

class Pagination extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quickJumperValue: props.current,
        }
    }

    _onClickPage = (page) => () => {
        if (isNaN(page)) return
        this._checkValue()
        const {quickJumperValue} = this.state
        this.props.onSwitchPage(page)()

        if (quickJumperValue !== page)
            this.setState({
                quickJumperValue: page,
            })
    }

    _calculatePagination = () => {
        const {amount, current} = this.props
        if (amount < 5) return Array.from({length: amount}, (v, i) => i + 1)
        if (current < 4)
            return [...Array.from({length: 4}, (v, i) => i + 1), '...', amount]
        if (current >= 4 && current <= amount - 3)
            return [
                1,
                '...',
                ...[current - 1, current, current + 1],
                '...',
                amount,
            ]
        return [1, '...', ...Array.from({length: 4}, (v, i) => amount - 3 + i)]
    }

    _onHandleQuickJumper = async (event) => {
        if (event.keyCode === 13) {
            // enterKeyPressed
            this._checkValue()
            event.preventDefault()
            this.props.onSwitchPage(Number(this.state.quickJumperValue))()
        }
    }

    _onChangeQuickJumper = (value) => {
        const totalPage = this.props.amount || 0

        if (value !== '') {
            value = Math.abs(parseInt(value))
        }
        if (Number(value) > totalPage) {
            this.setState({quickJumperValue: totalPage})
            return
        }
        this.setState({quickJumperValue: value})
    }

    _checkValue = () => {
        const quickJumperValue = this.state.quickJumperValue

        if (quickJumperValue === '' || quickJumperValue === 0) {
            this.setState({
                quickJumperValue: '1',
            })
        }
    }

    render() {
        const {current, label, showQuickJumper} = this.props

        const {quickJumperValue} = this.state
        const pagination = this._calculatePagination()
        const isFirst = current === 1
        const isLast = current === pagination[pagination.length - 1]
        const originalProps = {}
        if (typeof label === 'string') {
            originalProps.label = label
        }

        return (
            <div className="flex">
                <P
                    {...originalProps}
                    hasPrevious={!isFirst}
                    onPrevious={this._onClickPage(current - 1)}
                    hasNext={!isLast}
                    onNext={this._onClickPage(current + 1)}
                />
                {showQuickJumper && (
                    <form
                        className="w-40 ml-5 flex w-auto"
                        onKeyDown={this._onHandleQuickJumper}
                    >
                        <div className="w-48">
                            <TextField
                                type="number"
                                value={quickJumperValue + ''}
                                onChange={this._onChangeQuickJumper}
                                label=""
                            />
                        </div>
                        <div
                            className="ml-2"
                            onClick={this._onClickPage(quickJumperValue)}
                        >
                            <Button primary>Go</Button>
                        </div>
                    </form>
                )}
            </div>
        )
    }
}

Pagination.defaultProps = {
    loading: false,
}

Pagination.propTypes = {
    label: PropTypes.string,
    showQuickJumper: PropTypes.bool,
    amount: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    onSwitchPage: PropTypes.func.isRequired,
    loading: PropTypes.bool,
}

export default Pagination
