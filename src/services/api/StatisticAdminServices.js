import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

// const baseUrl = 'https://api-3h-shop.herokuapp.com/statistic'
const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/admin/statistic` : `${DEFAULT_API}/admin/statistic`

const api = createAPIServices({baseUrl})

export const statisticOrder = (query) => {
    return api.makeAuthRequest({
        url: '/order',
        params: query,
    })
}
