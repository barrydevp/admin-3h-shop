import React, {Component} from 'react'
import {Card} from '@shopify/polaris'
import FacebookTracking from './FacebookTracking'
import GoogleTracking from './GoogleTracking'
import ConfirmChange from "../../../helpers/ConfirmChange"
import getStoreInformation from "../../store-settings/static/GetStoreInformation"
import {keyTracking} from '../../store-settings/static/KeySetting'

class TrackingDetail extends Component {
    state = {
        settings: {},
        oriSettings: [],
        edited: false,
    }

    componentDidMount() {
        this._fetchTrackingInformation()

    }

    _fetchTrackingInformation = async () => {
        const settings = await getStoreInformation(keyTracking)
        this.setState({
            settings,
            oriSettings: settings
        })
    }

    _onChange = (key, value) => {
        const {settings} = this.state
        const edited = settings[key] || {}
        this.setState({
            edited: true,
            settings: {
                ...settings,
                [key]: {
                    ...edited,
                    key: key,
                    value,
                },
            },
        })
    }

    _resetChange = () => {
        this.setState(({oriSettings}) => ({
            settings: oriSettings,
            edited: false
        }))
    }

    _submitChange = async () => {
        const {settings} = this.state
        this.setState({
            edited: false,
            oriSettings: settings,
        })
    }

    render() {
        const {settings, edited} = this.state

        return (
            <div>
                {edited &&
                <ConfirmChange settings={settings} _submitChange={this._submitChange}
                               _resetChange={this._resetChange}/>}

                <Card sectioned>
                    <GoogleTracking
                        settings={settings}
                        onchange={this._onChange}
                    />
                </Card>

                <Card sectioned>
                    <FacebookTracking
                        settings={settings}
                        onchange={this._onChange}
                    />
                </Card>
            </div>
        )
    }
}

export default TrackingDetail
