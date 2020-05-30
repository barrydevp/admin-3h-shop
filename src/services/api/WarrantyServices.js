import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

// const baseUrl = 'https://api-3h-shop.herokuapp.com/products'
const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/warranties` : `${DEFAULT_API}/warranties`

const api = createAPIServices({baseUrl})

export const getListWarranty = (query) => {
    return api.makeRequest({
        url: '',
        method: 'get',
        params: query,
    })
}

export const getWarrantyById = (_id) => {
    return api.makeRequest({
        url: `/${_id}`,
        method: 'get',
    })
}