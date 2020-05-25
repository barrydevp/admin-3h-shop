import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    DisplayText,
    InlineError,
    Modal,
    TextContainer,
    TextStyle,
} from '@shopify/polaris'

class UserEliminationModal extends Component {
    state = {
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

    _clickSave = async () => {
        const {save /*, user: {name}*/} = this.props

        try {
            await save()

            // alert(`Eliminated ${name}'s account successfully!`)
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
        const {
            open,
            toggle,
            loading,
            user: {name},
        } = this.props
        const {message} = this.state
        return (
            <Modal
                title="Elimination"
                open={open}
                onClose={toggle}
                primaryAction={{
                    content: 'Eliminate',
                    onAction: this._clickSave,
                    loading: loading,
                    destructive: true,
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
                    <TextContainer>
                        <DisplayText size="small">
                            <TextStyle variation="negative">
                                Are you sure to eliminate{' '}
                                <TextStyle variation="strong">{name}</TextStyle>
                                's account?
                            </TextStyle>
                        </DisplayText>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        )
    }
}

UserEliminationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
}

export default UserEliminationModal
