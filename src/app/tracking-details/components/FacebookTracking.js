import React, {Component} from 'react'
import {Card, FormLayout, Layout, Heading, TextField} from '@shopify/polaris'
import PropTypes from 'prop-types'

class GoogleTracking extends Component {
    render() {
        const {settings, onchange} = this.props

        return (
            <Layout>
                <Layout.Section secondary>
                    <Heading>Facebook Tracking</Heading>
                </Layout.Section>
                <Layout.Section>
                    <Card sectioned>
                        <FormLayout>
                            <TextField
                                label="Facebook Pixel"
                                value={
                                    (settings.facebook_pixel || {}).value || ''
                                }
                                onChange={(v) => onchange('facebook_pixel', v)}
                            />
                        </FormLayout>
                    </Card>
                </Layout.Section>
            </Layout>
        )
    }
}

GoogleTracking.propTypes = {
    settings: PropTypes.object.isRequired,
    onchange: PropTypes.func.isRequired,
}
export default GoogleTracking
