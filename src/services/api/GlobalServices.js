import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.PRIMARY_DOMAIN}` : `${DEFAULT_API}`
const api = createAPIServices({baseUrl})

export const auth = ({email, password}) => {
    return api.makeRequest({
        url: '/admin/authenticate',
        method: 'post',
        data: {
            email,
            password,
        },
    })
}