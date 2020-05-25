const store = localStorage

const prefix = '3h.shop.admin.'

const _generateKey = (key) => {
    return prefix + key
}

export const removeLocalData = (key, noPrefix = false) => {
    const _key = noPrefix ? key : _generateKey(key)

    return store.removeItem(_key)
}

export const getLocalData = (key, defaultValue = null, noPrefix = false) => {
    const _key = noPrefix ? key : _generateKey(key)
    const value = store.getItem(_key) || defaultValue

    try {
        return JSON.parse(value)
    } catch (e) {
        return value
    }
}

export const setLocalData = (key, value, noPrefix = false) => {
    const _key = noPrefix ? key : _generateKey(key)

    const type = typeof value
    if (type === 'object') {
        value = JSON.stringify(value)
    }

    store.setItem(_key, value)

    return value
}
