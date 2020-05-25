import React from 'react'
import {CalloutCard} from '@shopify/polaris'
import {resetPasswordByUserId} from '../../../services/api/UserAdminServices'
import ResetPasswordModal from './ResetPasswordModal'
import PropTypes from 'prop-types'

class UserSecurity extends React.Component {
    state = {
        toggle: false,
    }

    _resetPasswordByUserId = async ({newPassword}) => {
        const {user, loading, updateProps} = this.props

        if (loading) return

        updateProps({
            loading: true,
        })

        try {
            const {
                success,
                /*data,*/ message,
            } = await resetPasswordByUserId(user._id, {newPassword})

            if (!success) {
                throw new Error(message)
            }

            updateProps({
                loading: false,
            })
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
                <ResetPasswordModal
                    open={toggle}
                    loading={loading}
                    toggle={this._toggleModal}
                    save={this._resetPasswordByUserId}
                />
                <CalloutCard
                    title="Security"
                    primaryAction={{
                        content: 'Reset password',
                        onAction: this._toggleModal,
                    }}
                >
                    <p>
                        Reset the <strong>{name || 'user'}</strong>'s password.
                    </p>
                </CalloutCard>
            </React.Fragment>
        )
    }
}

UserSecurity.propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func,
    updateProps: PropTypes.func.isRequired,
}

export default UserSecurity
