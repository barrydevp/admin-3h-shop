import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/admin/coupons` : `${DEFAULT_API}/admin/coupons`

const api = createAPIServices({baseUrl})

export const updateCoupon = (_id, coupon) => {
    return api.makeAuthRequest({
        url: `/${_id}/update`,
        method: 'post',
        data: coupon,
    })
}

export const insertCoupon = (coupon) => {
    return api.makeAuthRequest({
        url: ``,
        method: 'post',
        data: coupon,
    })
}