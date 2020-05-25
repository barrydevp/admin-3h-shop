import React from 'react'
import PropTypes from 'prop-types'
import {CalloutCard} from '@shopify/polaris'
import {deleteUserById} from '../../../services/api/UserAdminServices'
import UserEliminationModal from './UserEliminationModal'
import getHistory from '../../../store/getHistory'

class UserElimination extends React.Component {
    state = {
        toggle: false,
    }

    _deleteUserById = async () => {
        const {user, loading, updateProps} = this.props
        const history = getHistory()
        if (loading) return
        updateProps({
            loading: true,
        })
        try {
            const {success, /*data,*/ message} = await deleteUserById(user._id)

            if (!success) throw new Error(message)

            updateProps({
                loading: false,
            })

            history.goBack()
        } catch (e) {
            updateProps({
                loading: false,
            })

            throw e
        }
    }

    _toggleModal = () => {
        this.setState((state) => ({
            toggle: !state.toggle,
        }))
    }

    render() {
        const {toggle} = this.state
        const {user, loading} = this.props
        const {name} = user

        return (
            <React.Fragment>
                <UserEliminationModal
                    open={toggle}
                    loading={loading}
                    toggle={this._toggleModal}
                    save={this._deleteUserById}
                    user={user}
                />
                <CalloutCard
                    title="Eliminate account"
                    primaryAction={{
                        content: 'Eliminate account',
                        onAction: this._toggleModal,
                        destructive: true,
                    }}
                >
                    <p>
                        Eliminate the <strong>{name || 'user'}</strong>'s
                        account.
                    </p>
                </CalloutCard>
            </React.Fragment>
        )
    }
}

UserElimination.propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func,
    updateProps: PropTypes.func.isRequired,
}

export default UserElimination
