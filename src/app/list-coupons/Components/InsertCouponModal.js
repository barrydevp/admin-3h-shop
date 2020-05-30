import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DatePicker, Form, InlineError, Modal, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import moment from 'moment'

const _parseCoupon = ({code, discount, description, expires_at}) => {
    const coupon = {}
    if (safeTrim(code) !== '') coupon.code = safeTrim(code)
    if (safeTrim(description) !== '') coupon.description = safeTrim(description)
    if (discount) coupon.discount = parseFloat(discount)
    if (expires_at) coupon.expires_at = expires_at

    return coupon
}

const _formatDate = (date, format = 'llll') =>
    date ? moment(date).format(format) : ''

class InsertCouponModal extends Component {
    state = {
        code: '',
        description: '',
        discount: 1,
        expires_at: new Date(),
        datePicker: {
            month: (new Date()).getMonth(),
            year: (new Date()).getFullYear(),
        }
    }

    _clickSave = async () => {
        const {
            code,
            description,
            discount,
            expires_at,
        } = this.state

        try {
            await this.props.save(_parseCoupon({
                code,
                description,
                discount,
                expires_at,
            }))
            this.setState({
                code: '',
                description: '',
                discount: 1,
                expires_at: new Date(),
            })
        } catch (e) {
            return alert(e.message)
        }
    }

    _onChange = (key, value) => {
        this.setState({[key]: value})
    }

    _canAdd = ({code, discount, description, expires_at}) => {
        return (
            safeTrim(code) &&
            safeTrim(description) &&
            discount &&
            expires_at
        )
    }

    _onChangeMonth = (month, year) => {
        this.setState(({datePicker}) => {
            return {
                datePicker: {...datePicker, month, year},
            }
        })
    }

    _onChangeDate = ({start, end}) => {
        this.setState({
            expires_at: new Date(start)
        })
    }

    render() {
        const {open, toggle, loading, message} = this.props
        const {
            code,
            description,
            discount,
            expires_at,
            datePicker,
        } = this.state

        const canAdd =
            this._canAdd({
                code,
                description,
                discount,
                expires_at,
            }) && !loading

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={toggle}
                    title="Add new Coupon"
                    primaryAction={{
                        content: 'Add',
                        onAction: this._clickSave,
                        disabled: !canAdd,
                    }}
                    secondaryActions={[
                        {
                            content: 'Close',
                            onAction: toggle,
                            disabled: loading,
                        },
                    ]}
                >
                    <Modal.Section>
                        <InlineError message={message.error}/>
                        <TextField
                            value={code}
                            onChange={(value) => this._onChange('code', value.toUpperCase())}
                            label="Code"
                        />
                        <TextField
                            value={discount + ''}
                            type="number"
                            onChange={(value) =>
                                this._onChange('discount', value)
                            }
                            label="Discount"
                            min={1}
                            max={100}
                            step={1}
                        />
                        <TextField
                            value={description}
                            onChange={(value) =>
                                this._onChange('description', value)
                            }
                            label="Description"
                        />
                        <TextField
                            value={_formatDate(expires_at)}
                            disabled={true}
                            label="Expires at"
                        />
                        <DatePicker
                            month={datePicker.month}
                            year={datePicker.year}
                            onMonthChange={this._onChangeMonth}
                            onChange={this._onChangeDate}
                            selected={expires_at}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

InsertCouponModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default InsertCouponModal
