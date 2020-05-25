import qs from 'query-string'

export const setQueryString = (query) => {
    const qsValue = qs.stringify(query)
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?' +
        qsValue

    window.history.pushState({path: newUrl}, '', newUrl)
}

export const getQueryString = () => {
    return qs.parse(window.location.search)
}
