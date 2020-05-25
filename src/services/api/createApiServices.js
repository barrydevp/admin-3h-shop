import Axios from 'axios'
import {getAccessToken} from '../AuthServices'

const _store = {
    errorSubscribers: [],
}

const _getHandleErrorRequest = (error) => (store = {errorSubscribers: []}) => {
    const {response} = error

    if (!response || typeof response !== 'object') {
        throw error
    }

    const {status, data, message} = response
    store.errorSubscribers.forEach((subscriber) => {
        subscriber({status, data, message})
    })
}

const _makeRequest = (createRequest) => async (args) => {
    const {_localStore} = createRequest
    const _headers = args.headers ? args.headers : {}

    const defaultHeaders = {}

    args = {
        ...args,
        headers: {
            ...defaultHeaders,
            ..._headers,
        },
    }

    try {
        const {data} = await createRequest(args)

        return data
    } catch (e) {
        const handleErrorRequest = _getHandleErrorRequest(e)
        handleErrorRequest(_store)
        handleErrorRequest(_localStore)

        throw e
    }
}

const _makeAuthRequest = (createRequest) => async (args) => {
    const {_localStore} = createRequest
    const accessToken = getAccessToken()
    // const refreshToken = getRefreshToken()
    const _headers = args.headers ? args.headers : {}

    const defaultHeaders = {
        Authorization: `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
    }

    // if (refreshToken) {
    //     defaultHeaders['X-Refresh-Token'] = refreshToken
    // }

    args = {
        ...args,
        headers: {
            ...defaultHeaders,
            ..._headers,
        },
    }

    try {
        const {data} = await createRequest(args)
        return data
    } catch (error) {
        const handleErrorRequest = _getHandleErrorRequest(error)
        handleErrorRequest(_store)
        handleErrorRequest(_localStore)

        throw error
    }
}

const _subscribeErrorRequest = (instance) => (subscriber = null) => {
    const {_localStore} = instance

    if (!subscriber || typeof subscriber !== 'function') return false
    if (_localStore.errorSubscribers.indexOf(subscriber) !== -1) return false

    _localStore.errorSubscribers = [].concat(_localStore.errorSubscribers, [
        subscriber,
    ])
}

const _unSubscribeErrorRequest = (instance) => (subscriber) => {
    const {_localStore} = instance

    _localStore.errorSubscribers = _localStore.errorSubscribers.filter(
        (sub) => sub !== subscriber
    )
}

const _clearSubscribeErrorRequest = (instance) => () => {
    const {_localStore} = instance

    _localStore.errorSubscribers = []
}

export const subscribeGlobalErrorRequest = (subscriber = null) => {
    if (!subscriber || typeof subscriber !== 'function') return false
    if (_store.errorSubscribers.indexOf(subscriber) !== -1) return false

    _store.errorSubscribers = [].concat(_store.errorSubscribers, [subscriber])
}

export const unSubscribeGlobalErrorRequest = (subscriber) => {
    _store.errorSubscribers = _store.errorSubscribers.filter(
        (sub) => sub !== subscriber
    )
}

export const clearSubscribeGlobalErrorRequest = () => {
    _store.errorSubscribers = []
}

export default (options = {}) => {
    const baseUrlValidated = options.baseUrl || '/api'
    const headers = Object.assign({}, options.headers)
    const instance = Axios.create({
        baseURL: baseUrlValidated,
        timeout: 30000,
        headers,
    })

    const _changeBaseURL = (baseURL) => {
        instance.defaults.baseURL = baseURL
    }

    const _getBaseURL = () => {
        return instance.defaults.baseURL
    }

    const _setDefault = (property, value = null) => {
        instance.defaults[property] = value
    }

    instance._localStore = {
        errorSubscribers: [],
    }

    return {
        setDefault: _setDefault,
        getBaseURL: _getBaseURL,
        changeBaseURL: _changeBaseURL,
        makeRequest: _makeRequest(instance),
        makeAuthRequest: _makeAuthRequest(instance),
        subscribeErrorRequest: _subscribeErrorRequest(instance),
        unSubscribeErrorRequest: _unSubscribeErrorRequest(instance),
        clearSubscribeErrorRequest: _clearSubscribeErrorRequest(instance),
    }
}
