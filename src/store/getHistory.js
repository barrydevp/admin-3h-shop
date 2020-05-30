import {createBrowserHistory} from 'history'

const _history = createBrowserHistory()

export default () => _history

export const handleGoto = (path) => () => {
    console.log('test')
    _history.push(`${path}`)
}
