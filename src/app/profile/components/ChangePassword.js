import React from 'react'
import {
    Button,
    Card,
    Form,
    FormLayout,
    InlineError,
    TextField,
    TextStyle,
} from '@shopify/polaris'
import {changePass} from '../../../services/api/UserServices'

class ChangePassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            message: {
                success: '',
                error: '',
            },
            isSubmit: false,
        }
    }

    onChangeField = (field) => (value) => {
        this.setState({
            [field]: value,
        })
    }

    handleSubmit = async () => {
        const {oldPassword, newPassword, confirmPassword} = this.state
        if (oldPassword === newPassword) {
            this.setState({
                message: {
                    success: '',
                    error: 'Old password and new password is the same.',
                },
            })

            return
        }

        if (confirmPassword !== newPassword) {
            this.setState({
                message: {
                    success: '',
                    error:
                        "Password confirmation doesn't match the new password.",
                },
            })

            return
        }

        this.setState({
            isSubmit: true,
        })

        try {
            const {success, message} = await changePass({
                oldPassword,
                newPassword,
            })

            if (!success) {
                throw new Error(message)
            } else {
                this.setState({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    message: {
                        success: 'Password changed successfully.',
                        error: '',
                    },
                })
            }
        } catch (e) {
            this.setState({
                message: {
                    success: '',
                    error: e.message || 'Error.',
                },
            })
            alert(e.message || 'Error.')
        }

        this.setState({
            isSubmit: false,
        })
    }

    _canSubmit = ({oldPassword, newPassword, confirmPassword}) => {
        return (
            oldPassword !== '' && newPassword !== '' && confirmPassword !== ''
        )
    }

    render() {
        const {
            oldPassword,
            newPassword,
            confirmPassword,
            isSubmit,
            message,
        } = this.state

        const canSubmit = this._canSubmit({
            oldPassword,
            newPassword,
            confirmPassword,
        })

        return (
            <Card title="Password">
                <Card.Section>
                    <Form onSubmit={this.handleSubmit}>
                        <FormLayout>
                            <TextField
                                id="old-password"
                                type="password"
                                label="Old password"
                                value={oldPassword}
                                onChange={this.onChangeField('oldPassword')}
                                minLength={6}
                            />
                            <TextField
                                type="password"
                                label="New password"
                                value={newPassword}
                                onChange={this.onChangeField('newPassword')}
                                minLength={6}
                            />
                            <TextField
                                type="password"
                                label="Confirm password"
                                value={confirmPassword}
                                onChange={this.onChangeField('confirmPassword')}
                                minLength={6}
                            />
                            <InlineError
                                message={message.error}
                                fieldID="old-password"
                            />
                            <TextStyle variation="positive">
                                {message.success}
                            </TextStyle>
                            <Button
                                loading={isSubmit}
                                disabled={!canSubmit}
                                submit
                            >
                                {' '}
                                Save{' '}
                            </Button>
                        </FormLayout>
                    </Form>
                </Card.Section>
            </Card>
        )
    }
}

export default ChangePassword
