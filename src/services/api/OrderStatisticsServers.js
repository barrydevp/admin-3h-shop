import createAPIServices from './createApiServices'

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? '/api/order/statistics'
        : 'https://bo-tile.merch8.com/api/order/statistics'

const api = createAPIServices({baseUrl})

export const getStatistics = (query) => {
    return api.makeRequest({
        url: '/',
        params: query,
    })
}
