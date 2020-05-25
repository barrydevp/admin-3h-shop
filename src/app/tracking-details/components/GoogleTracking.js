import React, {Component} from 'react'
import {
    Card,
    FormLayout,
    Heading,
    Layout,
    Link,
    TextField,
    TextStyle,
} from '@shopify/polaris'
import PropTypes from 'prop-types'

class GoogleTracking extends Component {
    render() {
        const {settings, onchange} = this.props

        return (
            <Layout>
                <Layout.Section secondary>
                    <Heading>Google Tracking</Heading>
                    <TextStyle variation="subdued">
                        Find out how to checking your track code
                        <Link url="#"> here</Link>
                    </TextStyle>
                </Layout.Section>

                <Layout.Section>
                    <Card sectioned>
                        <FormLayout>
                            <TextField
                                label="Google Analytics"
                                value={
                                    (settings.google_analytics || {}).value ||
                                    ''
                                }
                                onChange={(v) =>
                                    onchange('google_analytics', v)
                                }
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
