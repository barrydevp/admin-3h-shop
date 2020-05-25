import React from 'react'
import {TopBar} from '@shopify/polaris'
import TopBarUserMenu from './TopBarUserMenu'

const DashboardHeader = (props) => {
    return (
        <TopBar
            showNavigationToggle
            userMenu={<TopBarUserMenu />}
            onNavigationToggle={props.toggleNavigation}
        />
    )
}

export default DashboardHeader
