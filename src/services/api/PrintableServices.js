import createAPIServices from './createApiServices'

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? '/api/printable'
        : 'https://bo-tile.merch8.com/api/printable'

const api = createAPIServices({baseUrl})

export const getPrintableItem = (orderItemId) => {
    return api.makeRequest({
        url: `/order-items/${orderItemId}`,
        method: 'get',
    })
}

export const getLinkPrintableItem = (orderId, orderItemId) => {
    return `${api.getBaseURL()}/orders/${orderId}/items/${orderItemId}`
}
