import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ChoiceList, InlineError, Modal, TextStyle} from '@shopify/polaris'
import roles from '../static/roles'
import {getStringValueOfRole, getValueFromStringValueOfRole} from '../../../static/userRoles'

class UpdateRoleModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            role: props.role || 0,
            message: {
                error: '',
                success: '',
            },
        }
    }

    _clickSave = async () => {
        const {save} = this.props
        const {role} = this.state

        this.setState({
            message: {
                error: '',
                success: '',
            },
        })

        try {
            await save({role})

            this.setState({
                message: {
                    error: '',
                    success: 'Update role successfully.',
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
        const {open, toggle, role, loading} = this.props
        const {message, role: _role} = this.state

        return (
            <Modal
                open={open}
                onClose={toggle}
                title="Change Role"
                primaryAction={{
                    content: 'Save',
                    onAction: this._clickSave,
                    loading: loading,
                    disabled: role === _role,
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
                    <ChoiceList
                        title="Role"
                        choices={roles}
                        selected={getStringValueOfRole(_role)}
                        onChange={([value]) => this.setState({role: getValueFromStringValueOfRole(value)})}
                    />
                </Modal.Section>
            </Modal>
        )
    }
}

UpdateRoleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    role: PropTypes.number.isRequired,
}

export default UpdateRoleModal
