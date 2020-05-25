export default (str) => {
    if (!str) return ''

    if (typeof str === 'number') return (str + '').trim()
    if (typeof str !== 'string') return ''

    return str.trim()
}
