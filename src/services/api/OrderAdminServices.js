import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.PRIMARY_DOMAIN}/admin/orders` : `${DEFAULT_API}/admin/orders`

const api = createAPIServices({baseUrl})

export const getApiUrl = baseUrl

export const getOrders = (query) => {
    return api.makeAuthRequest({
        url: '',
        method: 'get',
        params: query,
    })
}

export const deleteOrderById = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}/delete`,
        method: 'post',
    })
}

export const changeOrder = (_id, order) => {
    return api.makeAuthRequest({
        url: `/${_id}`,
        method: 'post',
        data: order,
    })
}

export const updateOrder = (_id, order) => {
    return api.makeAuthRequest({
        url: `/${_id}/update`,
        method: 'post',
        data: order,
    })
}

export const insertOrderShipping = (_id, order) => {
    return api.makeAuthRequest({
        url: `/${_id}/shipping`,
        method: 'post',
        data: order,
    })
}

export const changeOrderNote = (orderId, order) => {
    return api.makeAuthRequest({
        url: `/${orderId}/note/change`,
        method: 'post',
        data: order,
    })
}

export const changeOrderAddress = (orderId, orderDetails) => {
    return api.makeAuthRequest({
        url: `/${orderId}/address`,
        method: 'post',
        data: orderDetails,
    })
}

export const changeOrderTags = (orderId, order) => {
    return api.makeAuthRequest({
        url: `/${orderId}/tags`,
        method: 'post',
        data: order,
    })
}

export const changeOrderFulfillmentStatus = (_id, order) => {
    return api.makeAuthRequest({
        url: `/${_id}/fulfillment-status/change`,
        method: 'post',
        data: order,
    })
}

export const changeOrderPaymentStatus = (_id, order) => {
    return api.makeAuthRequest({
        url: `/${_id}/payment-status/change`,
        method: 'post',
        data: order,
    })
}

export const getOrderItems = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}/items`,
        method: 'get',
    })
}

export const getOrderHistory = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}/histories`,
        method: 'get',
    })
}

export const deleteOrder = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}`,
        method: 'delete',
    })
}

export const sendOrderToShipping = (orderId, shipping) => {
    return api.makeAuthRequest({
        url: `/${orderId}/shipping`,
        method: 'post',
        data: shipping,
    })
}

export const markOrderPaidManually = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}/paid`,
        method: 'post',
    })
}

export const changeOrderStyle = (orderId, args) => {
    return api.makeAuthRequest({
        url: `/${orderId}/style`,
        method: 'post',
        data: args,
    })
}

export const getGhtkLabel = (orderId) => {
    return api.makeAuthRequest({
        url: `/${orderId}/shipping/label`,
        method: 'get',
    })
}
