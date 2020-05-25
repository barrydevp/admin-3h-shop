import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import DashboardContainer from './app/dashboard/components/DashboardContainer'
import LoginContainer from './app/login/components/LoginContainer'
import LogoutContainer from './app/logout/components/LogoutContainer'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Switch>
                    <Route path={'/login'} component={LoginContainer} />
                    <Route path={'/logout'} component={LogoutContainer} />
                    <Route path={'/'} component={DashboardContainer} />
                    <Route path={'*'}>
                        <Redirect to={'/'} />
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default App
