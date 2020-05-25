import React, {createContext} from 'react'

const DashboardContext = createContext({})

export const {Provider: DashboardContextProvider, Consumer} = DashboardContext

export const useDashboardContext = (
    WrappedComponent,
    contextPropsName = 'dashboard'
) => {
    class DashboardContextConsumer extends React.Component {
        render() {
            return (
                <Consumer>
                    {(dashboardContext) => {
                        const combinedProps = {
                            ...this.props,
                            [contextPropsName]: dashboardContext,
                        }

                        return <WrappedComponent {...combinedProps} />
                    }}
                </Consumer>
            )
        }
    }

    return DashboardContextConsumer
}
