import createAPIServices from './createApiServices'

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? '/api/setting/store-settings'
        : 'https://bo-tile.merch8.com/api/setting/store-settings'
const api = createAPIServices({baseUrl})

export const getStoreSettings = (setting) => {
    return api.makeRequest({
        url: '',
        method: 'get',
        params : {setting}
    })
}

export const saveStoreSettings = (settings) => {
    return api.makeRequest({
        url: '',
        data: {settings},
        method: 'post',
    })
}
