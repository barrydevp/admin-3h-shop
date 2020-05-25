import React, {Component} from 'react'
import {Layout, Page} from '@shopify/polaris'
import ProfileDetails from './ProfileDetails'
import ChangePassword from './ChangePassword'

class Profile extends Component {
    render() {
        return (
            <Page fullWidth title="Profile">
                <Layout>
                    <Layout.Section>
                        <ProfileDetails />
                    </Layout.Section>
                    <Layout.Section secondary>
                        <ChangePassword />
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }
}

export default Profile
