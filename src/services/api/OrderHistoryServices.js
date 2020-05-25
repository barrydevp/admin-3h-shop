import createAPIServices from './createApiServices'

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? '/api/order/orderHistory'
        : 'https://bo-tile.merch8.com/api/order/orderHistory'

const api = createAPIServices({baseUrl})

export const getOrderHistory = (orderId) => {
    return api.makeRequest({
        url: `/${orderId}`,
        method: 'get',
    })
}
