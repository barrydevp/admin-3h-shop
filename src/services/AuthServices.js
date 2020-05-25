import {getLocalData, setLocalData} from './LocalStorageServices'

const _store = {
    state: {
        accessToken: getLocalData('accessToken', ''),
        refreshToken: getLocalData('refreshToken', ''),
        user: getLocalData('user', {}),
    },
    subscribers: [],
}

const _broadcast = () => {
    setTimeout(() => {
        // console.log(_store.subscribers)
        _store.subscribers.forEach((subscriber) => {
            subscriber(_store.state)
        })
    }, 0)
}

export const notifyUpdate = _broadcast

export const subscribe = (subscriber) => {
    if (typeof subscriber !== 'function') return
    if (_store.subscribers.indexOf(subscriber) !== -1) return

    _store.subscribers = [].concat(_store.subscribers, subscriber)
}

export const unsubscribe = (subscriber) => {
    _store.subscribers = _store.subscribers.filter((sub) => sub !== subscriber)
}

export const isAuthenticated = () => {
    const {state} = _store

    return !!state.accessToken
}

export const setUserId = (userId) => {
    const updatedUserId = userId

    _store.user = {
        ..._store.user,
        userId: updatedUserId,
    }

    setLocalData('userId', updatedUserId)
}

export const setUserData = (user) => {
    const updatedUser = {
        ..._store.state.user,
        ...user,
    }
    _store.state = {
        ..._store.state,
        user: updatedUser,
    }

    setLocalData('user', updatedUser)
    _broadcast()
}

export const updateUserProfile = (args = {}) => {
    const vArgs = Object.assign({}, args)

    const currentUser = Object.assign({}, _store.state.user)
    const currentProfile = Object.assign({}, currentUser.profile)

    const updatedUser = {
        ...currentUser,
        profile: {
            ...currentProfile,
            ...vArgs,
        },
    }

    _store.state = {
        ..._store.state,
        user: updatedUser,
    }

    setLocalData('user', updatedUser)
    _broadcast()
}

export const getUserData = () => getLocalData('user') || _store.state.user || {}

export const getUserId = () =>
    getLocalData('userId') || _store.state.user.userId || ''

export const setAccessToken = (accessToken) => {
    _store.state = {
        ..._store.state,
        accessToken,
    }

    setLocalData('accessToken', accessToken)
}

export const setRefreshToken = (refreshToken) => {
    _store.state = {
        ..._store.state,
        refreshToken,
    }

    setLocalData('refreshToken', refreshToken)
}

export const getAccessToken = () =>
    getLocalData('accessToken') || _store.state.accessToken || ''

export const getRefreshToken = () =>
    getLocalData('refreshToken') || _store.state.refreshToken || ''

export const logoutUser = (message = '') => {
    // const accessToken = getAccessToken()
    // const refreshToken = getRefreshToken()

    // setTimeout(async () => {
    //     await logoutCurrentUser({accessToken, refreshToken, message})
    // }, 0)

    setAccessToken('')
    setRefreshToken('')
    setLocalData('user', {})
    setUserId('')
    _broadcast()

    return true
}

export const loginUser = ({token, payload, user_data}) => {
    const {userId, role} = payload
    setAccessToken(token)
    setUserId(userId)
    setUserData({...user_data, role})
    _broadcast()
}

export const hasScopes = (...requestScopes) => {
    const {scopes} = getUserData()
    if (!scopes) return false

    for (const scope of requestScopes) {
        if (scope && scopes.indexOf(scope) !== -1) return true
    }

    return false
}

export const hasRoles = (...requestRoles) => {
    const {roles, role} = getUserData()

    if(role) {
        for (const _role of requestRoles) {
            if (_role && parseInt(_role) === parseInt(role)) return true
        }
    }

    if (!roles) return false

    for (const _role of requestRoles) {
        if (_role && roles.indexOf(_role) !== -1) return true
    }

    return false
}
