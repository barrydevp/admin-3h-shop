import React from 'react'
import {
    Button,
    ButtonGroup,
    Card,
    Form,
    FormLayout,
    InlineError,
    TextField,
    TextStyle,
} from '@shopify/polaris'
import {
    editRoleByUserId,
    updateUserById,
} from '../../../services/api/UserAdminServices'
import safeTrim from '../../../helpers/safeTrim'
import UpdateRoleModal from './UpdateRoleModal'
import PropTypes from 'prop-types'
import {getLabelUserRole} from '../../../static/userRoles'

const _parseUser = ({email, name, status}) => {
    const user = {}
    if (safeTrim(email) !== '') user.email = email
    if (safeTrim(name) !== '') user.name = name
    // if (safeTrim(status) !== '') user.status = status

    return user
}

class UserProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isSubmit: false,
            roleModal: {
                toggle: false,
            },
            message: {
                error: '',
                success: '',
            },
            user: {
                ...props.user,
            },
        }
    }

    _setUserState = (updatedUser, callback) => {
        this.setState(
            (state) => ({
                user: {
                    ...state.user,
                    ...updatedUser,
                },
            }),
            callback,
        )
    }

    _onChangeUser = (field) => (value) => {
        this.setState((state) => ({
            user: {
                ...state.user,
                [field]: value,
            },
        }))
    }

    _changeRole = async ({role}) => {
        const {
            user: {_id},
        } = this.state
        const {updateProps, loading} = this.props

        if (loading) return
        this.setState({
            isSubmit: true,
        })

        try {
            const {success, /*data,*/ message} = await editRoleByUserId(_id, {
                role,
            })

            if (!success) throw new Error(message)

            this.setState({
                isSubmit: false,
            })

            this._setUserState({role}, () => {
                const {user} = this.state
                updateProps({user, loading: false})
            })
        } catch (e) {
            this.setState(
                {
                    isSubmit: false,
                },
                () => updateProps({loading: false}),
            )

            throw e
        }
    }

    handleSave = async () => {
        const {user} = this.state
        const {loading, updateProps} = this.props

        if (loading) return
        this.setState({
            isSubmit: true,
        })
        updateProps({
            loading: true,
        })

        try {
            const vUser = _parseUser(user)
            const {success, data, message} = await updateUserById(
                user._id,
                vUser,
            )

            if (!success) throw new Error(message)

            this.setState({
                isSubmit: false,
                message: {
                    error: '',
                    success: 'Updated successfully.',
                },
            })

            this._setUserState(data, () => {
                const {user} = this.state
                updateProps({user, loading: false})
            })
        } catch (e) {
            this.setState(
                {
                    isSubmit: false,
                    message: {
                        error: 'Error.',
                        success: '',
                    },
                },
                () => updateProps({loading: false}),
            )
            alert(e.message || 'Error.')
        }
    }

    handleDiscard = async () => {
        const {user} = this.props

        this._setUserState(user)
    }

    _canSave = ({name, email}) => {
        return name && email
    }

    _canDiscard = (
        {name: _name, email: _email, status: _status},
        {name, email, status},
    ) => {
        return _name !== name || _email !== email || _status !== status
    }

    _toggleChangeRoleModal = () => {
        this.setState((state) => ({
            roleModal: {
                ...state.roleModal,
                toggle: !state.roleModal.toggle,
            },
        }))
    }

    render() {
        const {roleModal, user, isSubmit, message} = this.state
        const {user: oldUser, loading} = this.props
        const {name, email, status, role} = user

        const canDiscard = this._canDiscard(oldUser, user) && !isSubmit
        const canSave = this._canSave(user) && canDiscard

        return (
            <React.Fragment>
                <UpdateRoleModal
                    open={roleModal.toggle}
                    loading={isSubmit || loading}
                    toggle={this._toggleChangeRoleModal}
                    save={this._changeRole}
                    role={role}
                />
                <Card title={'Details ' + name}>
                    <Card.Section>
                        <Form onSubmit={this.handleSave}>
                            <FormLayout>
                                <TextField
                                    type="text"
                                    label="Name"
                                    value={name}
                                    onChange={this._onChangeUser('name')}
                                />
                                <TextField
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={this._onChangeUser('email')}
                                />
                                <TextField
                                    disabled
                                    type="role"
                                    label="Role"
                                    value={getLabelUserRole(role)}
                                    labelAction={{
                                        content: 'Change Role',
                                        onAction: this._toggleChangeRoleModal,
                                        disabled: isSubmit,
                                    }}
                                />
                                <TextField
                                    type="text"
                                    label="Status"
                                    value={status}
                                    onChange={this._onChangeUser('status')}
                                    disabled
                                />
                                <InlineError message={message.error}/>
                                <TextStyle variation="positive">
                                    {message.success}
                                </TextStyle>
                            </FormLayout>
                            <div className="pt-6">
                                <ButtonGroup>
                                    <Button
                                        disabled={!canDiscard || loading}
                                        onClick={this.handleDiscard}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        submit
                                        primary
                                        loading={isSubmit}
                                        disabled={!canSave || loading}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Form>
                    </Card.Section>
                </Card>
            </React.Fragment>
        )
    }
}

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func,
    updateProps: PropTypes.func.isRequired,
}

export default UserProfile
