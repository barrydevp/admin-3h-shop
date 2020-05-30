import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from '@shopify/polaris'
import InsertCouponModal from './InsertCouponModal'
import {insertCoupon} from '../../../services/api/CouponAdminServices'
import {CirclePlusMajorMonotone} from '@shopify/polaris-icons'

class InsertCoupon extends Component {
    state = {
        toggle: false,
        loading: false,
        message: {
            error: '',
            success: '',
        },
    }

    _toggle = () => {
        if (this.state.loading) return
        this.setState({toggle: !this.state.toggle})
    }

    _save = async (coupon) => {
        // console.log(coupon)
        if (this.state.loading) return
        this.setState({loading: true})

        const {success, data, message} = await insertCoupon(coupon)

        if (!success) {
            this.setState({
                loading: false,
                message: {error: message || 'Error.', success: ''},
            })
            throw new Error(message)
        }
        this.props.insert(data)
        this.setState(
            {
                loading: false,
                message: {error: '', success: 'Add coupon successfully.'},
            },
            this._toggle
        )
        return {success, data, message}
    }

    render() {
        const {toggle, loading, message} = this.state

        return (
            <div className="InsertCoupon mb-2 mr-4">
                <Button
                    primary
                    onClick={this._toggle}
                    icon={CirclePlusMajorMonotone}
                >
                    Add new
                </Button>
                <InsertCouponModal
                    open={toggle}
                    toggle={this._toggle}
                    save={this._save}
                    loading={loading}
                    message={message}
                />
            </div>
        )
    }
}

InsertCoupon.propTypes = {
    insert: PropTypes.func.isRequired,
}

export default InsertCoupon
