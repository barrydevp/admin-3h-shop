import React, {Component} from 'react'
import {Card, FormLayout, Heading, Layout, Select, TextField} from '@shopify/polaris'
import ConfirmChange from "../../../helpers/ConfirmChange"
import getStoreInformation from "../../store-settings/static/GetStoreInformation"
import {provinces} from '../../store-settings/static/provinces'
import {keyStore} from '../../store-settings/static/KeySetting'

class StoreDetail extends Component {
    state = {
        settings: {},
        oriSettings: [],
        edited: false,
    }

    componentDidMount() {
        this._fetchSettings()
    }

    _fetchSettings = async () => {

        const settings = await getStoreInformation(keyStore)
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
            loading: false,
            oriSettings: settings,
        })
    }

    render() {
        const {settings, edited} = this.state
        const listProvinces = provinces

        return (
            <div>
                {edited && <ConfirmChange settings={settings} _submitChange={this._submitChange}
                                          _resetChange={this._resetChange}/>}

                <Card sectioned>
                    <Layout>
                        <Layout.Section secondary>
                            <Heading>Store Information</Heading>
                        </Layout.Section>

                        <Layout.Section>
                            <Card sectioned>
                                <FormLayout>
                                    <TextField
                                        label="Store name"
                                        value={(settings.store_name || {}).value || ''}
                                        onChange={(v) => this._onChange('store_name', v)}
                                    />
                                    <TextField
                                        label="Store address"
                                        value={
                                            (settings.store_address || {}).value || ''
                                        }
                                        onChange={(v) => this._onChange('store_address', v)}
                                    />
                                    <Select
                                        label={'Store province'}
                                        value={
                                            (settings.store_province || {}).value || ''
                                        }
                                        options={listProvinces}
                                        onChange={(value) =>
                                            this._onChange('store_province', value)
                                        }
                                    />
                                    <TextField
                                        label="Store district"
                                        value={
                                            (settings.store_district || {}).value || ''
                                        }
                                        onChange={(v) => this._onChange('store_district', v)}
                                    />
                                    <TextField
                                        label="Store Phone"
                                        value={(settings.store_tel || {}).value || ''}
                                        onChange={(v) => this._onChange('store_tel', v)}
                                    />
                                </FormLayout>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Card>
            </div>
        )
    }
}

export default StoreDetail
