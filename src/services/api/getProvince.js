import createAPIServices from './createApiServices'

const baseUrl =
    'https://raw.githubusercontent.com/hienvd/vietnam-cities-list/master/cities.json'

const api = createAPIServices({baseUrl})

export const getProvince = () => {
    return api.makeRequest({
        url: '',
        method: 'get',
    })
}
