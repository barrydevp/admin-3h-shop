import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

// const baseUrl = 'https://api-3h-shop.herokuapp.com/products'
const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/coupons` : `${DEFAULT_API}/coupons`

const api = createAPIServices({baseUrl})

export const getListCoupon = (query) => {
    return api.makeRequest({
        url: '',
        method: 'get',
        params: query,
    })
}

export const getCouponById = (_id) => {
    return api.makeRequest({
        url: `/${_id}`,
        method: 'get',
    })
}