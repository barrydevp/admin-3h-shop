import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/admin/products` : `${DEFAULT_API}/admin/products`

const api = createAPIServices({baseUrl})

export const updateProduct = (_id, product) => {
    return api.makeAuthRequest({
        url: `/${_id}/update`,
        method: 'post',
        data: product,
    })
}

export const insertProduct = (product) => {
    return api.makeAuthRequest({
        url: ``,
        method: 'post',
        data: product,
    })
}