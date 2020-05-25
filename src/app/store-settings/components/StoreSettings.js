import React, {Component} from 'react'
import {Layout, Navigation, Card, Heading} from '@shopify/polaris'
import options from '../static/Options'

class StoreSettings extends Component {

    _setUpOption = () => {

        return options.map((option) => {

            return {
                url: `/d/store-settings/${option.url}`,
                icon: option.icon ,
                label: (
                    <div>
                        <Heading>{option.label}</Heading>
                        <p>View and update your {option.label.toLowerCase()} information</p>
                    </div>
                )
            }
        })
    }

    render() {
        const listOptions = this._setUpOption()

        return (
            <Layout>
                {listOptions.map(option => (
                    <Layout.Section oneThird>
                        <Card>
                            <Navigation.Section
                                items={[
                                    {
                                        url: option.url,
                                        label: option.label,
                                        icon: option.icon,
                                    }
                                ]}
                            />
                        </Card>
                    </Layout.Section>
                ))}
            </Layout>

        )
    }
}

export default StoreSettings
