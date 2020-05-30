import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

// const baseUrl = 'https://api-3h-shop.herokuapp.com/categories'
const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/categories` : `${DEFAULT_API}/categories`

const api = createAPIServices({baseUrl})

export const getListCategory = (query) => {
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