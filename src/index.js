import React from 'react'
import ReactDOM from 'react-dom'
import enTranslations from '@shopify/polaris/locales/en.json'
import {AppProvider} from '@shopify/polaris'
import theme from './polarisTheme/index'
import {Router} from 'react-router-dom'
import getHistory from './store/getHistory'
import {AuthContextProvider} from './app/shared/AuthContext'
import App from './App'
import './scss/app.scss'

ReactDOM.render(
    <React.StrictMode>
        <AppProvider i18n={enTranslations} theme={theme}>
            <Router history={getHistory()}>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </Router>
        </AppProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
