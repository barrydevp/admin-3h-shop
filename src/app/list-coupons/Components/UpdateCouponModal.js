import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DatePicker, Form, InlineError, Modal, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import moment from 'moment'
import {updateCoupon} from '../../../services/api/CouponAdminServices'

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

class UpdateCouponModal extends Component {
    constructor(props) {
        super(props)

        const coupon = props.coupons && props.coupons.find(e => e._id === props.couponId)

        this.state = {
            ...coupon,
            datePicker: {
                month: (coupon ? new Date(coupon.expires_at) : new Date()).getMonth(),
                year: (coupon ? new Date(coupon.expires_at) : new Date()).getFullYear(),
            },
            loading: false,
            message: {
                success: '',
                error: '',
            }
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.couponId !== prevProps.couponId) {
            const coupon = this.props.coupons && this.props.coupons.find(e => e._id === this.props.couponId)

            if(!coupon) return

            this.setState({
                ...coupon,
                datePicker: {
                    month: (coupon ? new Date(coupon.expires_at) : new Date()).getMonth(),
                    year: (coupon ? new Date(coupon.expires_at) : new Date()).getFullYear(),
                },
                message: {
                    success: '',
                    error: '',
                },
                loading: false,
            })
        }
    }

    _clickSave = async () => {
        const {couponId} = this.props

        if(!couponId) {
            return
        }

        const {
            code,
            description,
            discount,
            expires_at,
        } = this.state

        this.setState({
            loading: true,
            message: {
                success: '',
                error: '',
            }
        })
        
        try {
            const {success, data, message} = await updateCoupon(couponId, _parseCoupon({
                code,
                description,
                discount,
                expires_at,
            }))

            if(!success) throw new Error(message)

            this.setState({
                loading: false,
                message: {
                    success: '',
                    error: '',
                }
            })

            this.props.onUpdateCoupon(couponId, data)
            this.props.toggle()

        } catch (e) {
            this.setState({
                loading: false,
                message: {
                    success: '',
                    error: '',
                }
            })
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
        const {couponId, toggle} = this.props
        const open = !!couponId
        
        const {
            code,
            description,
            discount,
            expires_at,
            datePicker,
            loading,
            message,
        } = this.state

        const canAdd =
            this._canAdd({
                code,
                description,
                discount,
                expires_at,
            }) && !loading

        // console.log(this.state)

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={toggle}
                    title="Update Coupon"
                    primaryAction={{
                        content: 'Save',
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
                            selected={expires_at ? new Date(expires_at) : new Date()}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

UpdateCouponModal.propTypes = {
    couponId: PropTypes.number.isRequired,
    toggle: PropTypes.func.isRequired,
    onUpdateCoupon: PropTypes.func.isRequired,
    coupons: PropTypes.array.isRequired,
}

export default UpdateCouponModal
