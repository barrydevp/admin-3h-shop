import React, {Component} from 'react'
import {Card, FormLayout, Heading, Layout, TextField} from '@shopify/polaris'
import ConfirmChange from "../../../helpers/ConfirmChange"
import getStoreInformation from '../../store-settings/static/GetStoreInformation'
import {keyBank} from '../../store-settings/static/KeySetting'

class BankDetail extends Component {
    state = {
        settings: {},
        oriSettings: [],
        edited: false,
    }

    componentDidMount() {
        this._fetchBankInformation()

    }

    _fetchBankInformation = async () => {
        const settings = await getStoreInformation(keyBank)

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
                    {edited && <ConfirmChange settings={settings} _submitChange={this._submitChange}
                                              _resetChange={this._resetChange}/>}
                    <Card sectioned>
                        <Layout>
                            <Layout.Section secondary>
                                <Heading>Bank Information</Heading>
                            </Layout.Section>
                            <Layout.Section>
                                <Card sectioned>
                                    <FormLayout>
                                        <TextField
                                            label="Bank Account"
                                            value={(settings.bank_account || {}).value || ''}
                                            onChange={(v) => onchange('bank_account', v)}
                                        />
                                        <TextField
                                            label="Bank User"
                                            value={
                                                (settings.bank_user || {}).value || ''
                                            }
                                            onChange={(v) => this._onChange('bank_user', v)}
                                        />
                                        <TextField
                                            label="Bank Name"
                                            value={
                                                (settings.bank_name || {}).value || ''
                                            }
                                            onChange={(v) => this._onChange('bank_name', v)}
                                        />
                                        <TextField
                                            label="Bank Branch"
                                            value={
                                                (settings.bank_branch || {}).value || ''
                                            }
                                            onChange={(v) => this._onChange('bank_branch', v)}
                                        />
                                        <TextField
                                            label="Bank Note"
                                            value={(settings.bank_notes || {}).value || ''}
                                            onChange={(v) => this._onChange('bank_notes', v)}
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

export default BankDetail
