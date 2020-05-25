import React, {Component} from 'react'
import {
    Button,
    Card,
    Form,
    FormLayout,
    Layout,
    TextField,
} from '@shopify/polaris'
import {auth} from '../../../services/api/GlobalServices'
import {loginUser} from '../../../services/AuthServices'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            isSubmit: false,
        }
    }

    handleSubmit = async (_event) => {
        const {email, password} = this.state

        this.setState((state) => {
            const {isSubmit} = state
            if (isSubmit === false)
                return {
                    isSubmit: true,
                }

            return {}
        })

        try {
            const {success, data, message} = await auth({email, password})

            if (!success) {
                throw new Error(message)
            }

            const {access_token, user} = data

            loginUser({token: access_token, payload: {userId: user._id, role: user.role}, user_data: user})
            // this.setState({
            //     password: '',
            //     isSubmit: false
            // })
        } catch (e) {
            this.setState((state) => {
                const {isSubmit} = state
                if (isSubmit)
                    return {
                        isSubmit: false,
                    }

                return {}
            })
            return alert(e.message)
        }
    }

    handleValueChange = (field) => (value) => this.setState({[field]: value})
    handleClearButton = (field) => () => this.setState({[field]: ''})

    render() {
        const {email, password, isSubmit} = this.state

        const canSubmit = email !== '' && password !== ''

        return (
            <Layout>
                <Layout.Section>
                    <Card title="Login" sectioned>
                        <Form onSubmit={this.handleSubmit}>
                            <FormLayout>
                                <TextField
                                    value={email}
                                    onChange={this.handleValueChange('email')}
                                    label="Email"
                                    type="email"
                                    autoFocus
                                    minLength={1}
                                />
                                <TextField
                                    value={password}
                                    onChange={this.handleValueChange(
                                        'password'
                                    )}
                                    label="Password"
                                    type="password"
                                    minLength={1}
                                />
                                <Button
                                    disabled={!canSubmit}
                                    loading={isSubmit}
                                    submit
                                >
                                    Submit
                                </Button>
                            </FormLayout>
                        </Form>
                    </Card>
                </Layout.Section>
            </Layout>
        )
    }
}

export default Login
