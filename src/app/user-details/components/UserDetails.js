import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Layout, Page} from '@shopify/polaris'
import UserProfile from './UserProfile'
import UserSecurity from './UserSecurity'
import UserElimination from './UserElimination'
import getHistory, {handleGoto} from '../../../store/getHistory'
import {getUserById} from '../../../services/api/UserAdminServices'

class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            user: null,
            _id: props.userId,
        }
    }

    _setState = (args) => this.setState(args)

    _updateUser = (updateUser) => {
        this.setState(({user}) => ({
            user: {
                ...user,
                ...updateUser,
            },
        }))
    }

    _fetchUser = async (userId) => {
        const {success, message, data} = await getUserById(userId)

        if (!success) throw new Error(message)

        this.setState({
            user: data,
        })

        return data
    }

    _initView = async () => {
        const history = getHistory()

        if (!this.state._id) {
            history.push('/d')

            return
        }

        try {
            const user = await this._fetchUser(this.state._id)
            this.setState({loading: false, user: user})
        } catch (e) {
            alert(e.message)
            history.push('/d')
        }
    }

    componentDidMount() {
        this._initView()
    }

    render() {
        const {loading, user} = this.state

        return (
            <Page
                fullWidth
                separator
                breadcrumbs={[
                    {
                        content: 'List Users',
                        onAction: handleGoto('/users'),
                    },
                ]}
                className="UserDetails"
            >
                {!loading && (
                    <Layout>
                        <Layout.Section>
                            <UserProfile
                                user={user}
                                loading={loading}
                                fetchUser={this.fetchUser}
                                updateProps={this._setState}
                            />
                        </Layout.Section>
                        <Layout.Section secondary>
                            <UserSecurity
                                user={user}
                                loading={loading}
                                fetchUser={this.fetchUser}
                                updateProps={this._setState}
                            />
                            <UserElimination
                                user={user}
                                loading={loading}
                                fetchUser={this.fetchUser}
                                updateProps={this._setState}
                            />
                        </Layout.Section>
                    </Layout>
                )}
            </Page>
        )
    }
}

UserDetails.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default UserDetails
