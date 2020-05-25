import React, {Component} from 'react'
import {saveStoreSettings} from '../services/api/StoreSettingServices'
import {ContextualSaveBar} from '@shopify/polaris'
import PropTypes from 'prop-types'

class ConfirmChange extends Component {
    state = {
        loading: false
    }

    _submitChange = async () => {
        const {settings} = this.props
        const update = Object.values(settings)
        console.log(update)

        try {
            this.setState({loading: true})
            const {success, message} = await saveStoreSettings(update)
            if (!success) {
                this.setState({loading: false})
                return alert(message)
            }
            this.props._submitChange(settings)

        } catch (e) {
            this.setState({loading: false})
            alert(e.message)
        }
    }

    render() {
        const {loading} = this.state
        const contextBar = (
            <ContextualSaveBar
                message={'Unsaved change'}
                saveAction={{
                    onAction: this._submitChange,
                    loading,
                    disabled: false,
                }}
                discardAction={{
                    onAction: this.props._resetChange,
                }}
            />
        )
        return (
            <div>
                {contextBar}
            </div>
        )
    }
}

ConfirmChange.propTypes = {
    _submitChange: PropTypes.func.isRequired,
    _resetChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
}
export default ConfirmChange
