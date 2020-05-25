import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from '@shopify/polaris'
import InsertUserModal from './InsertUserModal'
import {insertUser} from '../../../services/api/UserAdminServices'
import {CirclePlusMajorMonotone} from '@shopify/polaris-icons'

class InsertUser extends Component {
    state = {
        toggle: false,
        loading: false,
        message: {
            error: '',
            success: '',
        },
    }

    _toggle = () => {
        if (this.state.loading) return
        this.setState({toggle: !this.state.toggle})
    }

    _save = async (user) => {
        // console.log(user)
        if (this.state.loading) return
        this.setState({loading: true})

        const {success, data, message} = await insertUser(user)

        if (!success) {
            this.setState({
                loading: false,
                message: {error: message || 'Error.', success: ''},
            })
            throw new Error(message)
        }
        this.props.insert(data)
        this.setState(
            {
                loading: false,
                message: {error: '', success: 'Add user successfully.'},
            },
            this._toggle
        )
        return {success, data, message}
    }

    render() {
        const {toggle, loading, message} = this.state

        return (
            <div className="InsertUser mb-2 mr-4">
                <Button
                    primary
                    onClick={this._toggle}
                    icon={CirclePlusMajorMonotone}
                >
                    Add new
                </Button>
                <InsertUserModal
                    open={toggle}
                    toggle={this._toggle}
                    save={this._save}
                    loading={loading}
                    message={message}
                />
            </div>
        )
    }
}

InsertUser.propTypes = {
    insert: PropTypes.func.isRequired,
}

export default InsertUser
