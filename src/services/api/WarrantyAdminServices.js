import createAPIServices from './createApiServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/admin/warranties` : `${DEFAULT_API}/admin/warranties`

const api = createAPIServices({baseUrl})

export const updateWarranty = (_id, warranty) => {
    return api.makeAuthRequest({
        url: `/${_id}/update`,
        method: 'post',
        data: warranty,
    })
}

export const insertWarranty = (warranty) => {
    return api.makeAuthRequest({
        url: ``,
        method: 'post',
        data: warranty,
    })
}