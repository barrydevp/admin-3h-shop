import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

// const baseUrl = 'https://api-3h-shop.herokuapp.com/orders'
const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/orders` : `${DEFAULT_API}/orders`

const api = createAPIServices({baseUrl})

export const getOrder = (_id) => {
    return api.makeRequest({
        url: `/${_id}`,
        method: 'get',
    })
}

export const getOrderItemByOrderId = (orderId) => {
    return api.makeRequest({
        url: `/${orderId}/items`,
        method: 'get'
    })
}

export const getOrderCustomerByOrderId = (orderId) => {
    return api.makeRequest({
        url: `/${orderId}/customer`,
        method: 'get'
    })
}

export const getOrderShippingByOrderId = (orderId) => {
    return api.makeRequest({
        url: `/${orderId}/shipping`,
        method: 'get'
    })
}

export const insertOrderItem = (orderId, item) => {
    return api.makeRequest({
        url: `/${orderId}/items`,
        method: 'post',
        data: item,
    })
}

export const checkoutOrder = (orderId, item) => {
    return api.makeRequest({
        url: `/${orderId}/checkout`,
        method: 'post',
        data: item,
    })
}