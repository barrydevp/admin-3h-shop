const getQueryString = (queryString, key) => {
    const params = new URLSearchParams(queryString)
    return params.get(key)
}

export default getQueryString
