import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {InlineError, Modal, TextField, TextStyle} from '@shopify/polaris'

class ResetPasswordModal extends Component {
    state = {
        newPassword: '',
        confirmPassword: '',
        message: {
            error: '',
            success: '',
        },
    }

    _setMessage = (message) => {
        this.setState({
            message,
        })
    }

    setField = (field) => (value) =>
        this.setState({
            [field]: value,
        })

    _clickSave = async () => {
        const {save} = this.props
        const {newPassword} = this.state

        try {
            await save({newPassword})

            this.setState({
                message: {
                    error: '',
                    success: 'Reset password successfully.',
                },
            })
        } catch (e) {
            this.setState({
                message: {
                    error: e.message || 'Error.',
                    success: '',
                },
            })
            alert(e.message || 'Error.')
        }
    }

    render() {
        const {open, toggle, loading} = this.props
        const {message, newPassword, confirmPassword} = this.state
        return (
            <Modal
                open={open}
                onClose={toggle}
                title="Reset password"
                primaryAction={{
                    content: 'Save',
                    onAction: this._clickSave,
                    loading: loading,
                    disabled:
                        !newPassword ||
                        !confirmPassword ||
                        newPassword !== confirmPassword,
                }}
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: toggle,
                        disabled: loading,
                    },
                ]}
            >
                <Modal.Section>
                    <InlineError message={message.error} />
                    <TextStyle variation="positive">
                        {message.success}
                    </TextStyle>
                    <TextField
                        type="password"
                        label="New password"
                        value={newPassword}
                        onChange={this.setField('newPassword')}
                        minLength={6}
                    />
                    <TextField
                        type="password"
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={this.setField('confirmPassword')}
                        minLength={6}
                    />
                </Modal.Section>
            </Modal>
        )
    }
}

ResetPasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default ResetPasswordModal
