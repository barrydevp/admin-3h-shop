import React from 'react'
import {TopBar} from '@shopify/polaris'
import {
    CircleChevronRightMinor,
    ProfileMajorMonotone,
} from '@shopify/polaris-icons'
import {getUserData} from '../../../services/AuthServices'
import {withRouter} from 'react-router-dom'

class TopBarUserMenu extends React.Component {
    state = {
        isOpen: false,
    }

    handleGoto = (path) => () => {
        const {history} = this.props
        history.push(`${path}`)
    }

    render() {
        const {isOpen} = this.state
        const user = getUserData()
        const {name} = {...user}

        return (
            <TopBar.UserMenu
                actions={[
                    {
                        items: [
                            {
                                content: 'Profile',
                                icon: ProfileMajorMonotone,
                                onAction: this.handleGoto('/profile'),
                            },
                        ],
                    },
                    {
                        items: [
                            {
                                content: 'Logout',
                                icon: CircleChevronRightMinor,
                                onAction: this.handleGoto('/logout'),
                            },
                        ],
                    },
                ]}
                open={isOpen}
                onToggle={() =>
                    this.setState((state) => {
                        return {
                            isOpen: !state.isOpen,
                        }
                    })
                }
                initials={''}
                name={name || 'Merchize'}
            />
        )
    }
}

export default withRouter(TopBarUserMenu)
