import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, InlineError, Modal, Select, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import roles from '../static/roles'

const _parseUser = ({email, name, password, role, status}) => {
    const user = {password}
    if (safeTrim(email) !== '') user.email = email
    if (safeTrim(name) !== '') user.name = name
    if (safeTrim(status) !== '') user.status = status
    if (safeTrim(role) !== '') user.role = role

    return user
}

class InsertUserModal extends Component {
    state = {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    }

    _clickSave = async () => {
        const {email, name, password, role} = this.state
        try {
            await this.props.save(_parseUser({email, name, password, role}))
            this.setState({
                email: '',
                name: '',
                password: '',
                confirmPassword: '',
                role: 'user',
            })
        } catch (e) {
            return alert(e.message)
        }
    }

    _onChange = (key, value) => this.setState({[key]: value})

    _canAdd = ({email, name, password, confirmPassword}) => {
        return (
            email &&
            name &&
            password &&
            confirmPassword &&
            password === confirmPassword
        )
    }

    render() {
        const {open, toggle, loading, message} = this.props
        const {email, name, password, confirmPassword, role} = this.state

        const canAdd =
            this._canAdd({email, name, password, confirmPassword}) && !loading

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={toggle}
                    title="Add new User"
                    primaryAction={{
                        content: 'Add',
                        onAction: this._clickSave,
                        disabled: !canAdd,
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
                        <TextField
                            value={email}
                            type="email"
                            onChange={(value) => this._onChange('email', value)}
                            label="Email"
                        />
                        <TextField
                            value={name}
                            onChange={(value) => this._onChange('name', value)}
                            label="Name"
                        />
                        <TextField
                            value={password}
                            type={'password'}
                            onChange={(value) =>
                                this._onChange('password', value)
                            }
                            label="Password"
                        />
                        <TextField
                            value={confirmPassword}
                            type={'password'}
                            onChange={(value) =>
                                this._onChange('confirmPassword', value)
                            }
                            label="Confirm password"
                        />
                        <Select
                            label="Role"
                            options={roles}
                            onChange={(value) => this._onChange('role', value)}
                            value={role}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

InsertUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default InsertUserModal
