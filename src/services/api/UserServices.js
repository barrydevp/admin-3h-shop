import createAPIServices from './createApiServices'
import {getUserId} from '../AuthServices'
import {DEFAULT_API} from '../../store/env'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.PRIMARY_DOMAIN}/users` : `${DEFAULT_API}/users`
const api = createAPIServices({baseUrl})

export const auth = ({email, password}) => {
    return api.makeRequest({
        url: '/authenticate',
        method: 'post',
        data: {
            email,
            password,
        },
    })
}

export const getListUser = ({
    name,
    email,
    role,
    status,
    limit,
    page,
    start_date,
    end_date,
}) => {
    return api.makeAuthRequest({
        url: '',
        method: 'get',
        params: {name, email, role, status, limit, page, start_date, end_date},
    })
}

export const getUserById = (userId) => {
    return api.makeAuthRequest({
        url: `/${userId}`,
        method: 'get',
    })
}

export const updateMe = ({name, address}) => {
    const userId = getUserId()
    return api.makeAuthRequest({
        url: `/${userId}/update`,
        method: 'post',
        data: {name, address},
    })
}

export const changePass = ({oldPassword, newPassword}) => {
    const userId = getUserId()

    return api.makeAuthRequest({
        url: `/${userId}/password/change`,
        method: 'post',
        data: {old_password: oldPassword, new_password: newPassword},
    })
}

export default api
