import React from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {Navigation} from '@shopify/polaris'
import {
    AnalyticsMajorMonotone,
    CustomersMajorMonotone,
    OrdersMajorMonotone,
    ProfileMajorMonotone,
    SettingsMajorMonotone,
} from '@shopify/polaris-icons'
import {hasRoles} from '../../../services/AuthServices'

const routes = [
    // {label: 'Statistics', icon: AnalyticsMajorMonotone, path: '/statistics'},
    {label: 'Orders', icon: OrdersMajorMonotone, path: '/orders'},
]

const DashboardSidebar = (props) => {
    const route = useLocation()
    const history = useHistory()

    const handleGoto = React.useCallback(
        (path) => {
            history.push(path)
        },
        [history]
    )

    const routeItems = routes.map((route) => ({
        label: route.label,
        icon: route.icon,
        onClick: () => handleGoto(route.path || ''),
    }))

    const AccountBar = (
        <Navigation.Section
            title={'Account'}
            items={[
                {
                    // url: '/profile',
                    label: 'Profile',
                    icon: ProfileMajorMonotone,
                    onClick: () => handleGoto('/profile'),
                },
            ]}
        />
    )

    const TrackingBar = (
        <Navigation.Section title={'Tracking'} items={routeItems} />
    )

    const ManagerBar = hasRoles(1) && (
        <Navigation.Section
            title={'Manager'}
            items={[
                {
                    // url: '/profile',
                    label: 'Users',
                    icon: CustomersMajorMonotone,
                    onClick: () => handleGoto('/users'),
                },
                // {
                //     label: 'Store Settings',
                //     icon: SettingsMajorMonotone,
                //     onClick: () => handleGoto('/store-settings'),
                // },
            ]}
        />
    )

    return (
        <Navigation location={route.pathname}>
            {TrackingBar}
            {AccountBar}
            {ManagerBar}
        </Navigation>
    )
}

export default DashboardSidebar
