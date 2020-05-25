import React from 'react'
import {
    Badge,
    Card,
    FormLayout,
    InlineError,
    SkeletonBodyText,
    Stack,
    TextContainer,
    TextField,
    TextStyle,
} from '@shopify/polaris'
import {getUserData, setUserData} from '../../../services/AuthServices'
import {updateMe} from '../../../services/api/UserAdminServices'
import safeTrim from '../../../helpers/safeTrim'
import humanizeTime from '../../../helpers/humanizeTime'
import {getLabelUserRole} from '../../../static/userRoles'

class LoadingProfileDetails extends React.Component {
    render() {
        return (
            <Card
                title="Details"
                sectioned
                secondaryFooterActions={[{content: 'Discard'}]}
                primaryFooterAction={{content: 'Save'}}
            >
                <Card.Section>
                    <FormLayout>
                        <SkeletonBodyText lines={5}/>
                    </FormLayout>
                </Card.Section>
            </Card>
        )
    }
}

class ProfileDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            name: '',
            email: '',
            isSubmit: false,
            message: {
                success: '',
                error: '',
            },
        }
    }

    _setUserDataState = (options) => {
        const userData = getUserData()

        this.setState({
            isLoading: false,
            name: userData.name,
            email: userData.email,
            ...options,
        })
    }

    componentDidMount() {
        this._setUserDataState()
    }

    onChangeField = (field) => (value) => {
        this.setState({
            [field]: value,
        })
    }

    _updateProfile = async ({name}) => {
        const {success, data, message} = await updateMe({name})

        if (!success) throw new Error(message)

        setUserData(data)
    }

    handleSave = async () => {
        const {name} = this.state
        this.setState({
            isSubmit: true,
        })
        try {
            const _name = safeTrim(name)
            await this._updateProfile({name: _name})
            this._setUserDataState()
            this.setState({
                message: {
                    success: 'Update successfully.',
                    error: '',
                },
            })
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

    handleDiscard = async () => {
        const {name} = getUserData()
        const {isSubmit} = this.state
        try {
            if (isSubmit) {
                await this._updateProfile({name})
                this._setUserDataState()
            } else {
                this.setState({
                    name,
                })
            }
        } catch (e) {
            this.setState({
                message: {
                    success: '',
                    error: e.message || 'Error.',
                },
            })
            return alert(e.message || 'Error.')
        }

        this.setState({
            isSubmit: false,
        })
    }

    render() {
        const {name, email, isLoading, isSubmit, message} = this.state
        const {
            name: _name,
            status: _status,
            role: _role,
            created_at: _created_at,
        } = getUserData()

        const roleLabel = getLabelUserRole(_role)

        return isLoading ? (
            <LoadingProfileDetails/>
        ) : (
            <Card
                title="Details"
                sectioned
                secondaryFooterActions={[
                    {
                        content: 'Discard',
                        onAction: this.handleDiscard,
                        disabled: _name === name,
                    },
                ]}
                primaryFooterAction={{
                    content: 'Save',
                    loading: isSubmit,
                    onAction: this.handleSave,
                    disabled: _name === name,
                }}
            >
                <FormLayout>
                    <TextField
                        type="text"
                        label="Name"
                        value={name}
                        onChange={this.onChangeField('name')}
                    />
                    <TextField
                        disabled
                        type="email"
                        label="Email"
                        value={email}
                        onChange={this.onChangeField('email')}
                        labelAction={{content: 'Change email'}}
                    />
                    <TextContainer>
                        <div>Role</div>
                        <Stack spacing="none">
                            <Badge
                                status={
                                    roleLabel === 'Admin'
                                        ? 'attention'
                                        : 'info'
                                }
                            >
                                {roleLabel}
                            </Badge>
                        </Stack>
                    </TextContainer>
                    <TextContainer>
                        <div>Status</div>
                        <Stack spacing="none">
                            <Badge
                                status={_status === 'active' ? 'success' : ''}
                                progress={
                                    _status === 'active'
                                        ? 'complete'
                                        : 'incomplete'
                                }
                            >
                                {_status}
                            </Badge>
                        </Stack>
                    </TextContainer>
                    <TextContainer>
                        <div>Created</div>
                        <div className="mt-2">
                            <TextStyle variation="strong">
                                {humanizeTime(_created_at)}
                            </TextStyle>
                        </div>
                    </TextContainer>
                    <TextStyle variation="positive">
                        {message.success}
                    </TextStyle>
                    <InlineError>{message.error}</InlineError>
                </FormLayout>
            </Card>
        )
    }
}

export default ProfileDetails
