import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DescriptionList} from '@shopify/polaris'

class CustomerDetails extends Component {
    render() {
        const {customer} = this.props
        const customerDetails = [
            {term: 'Full Name', description: customer.full_name},
            {term: 'Email', description: customer.email},
            {term: 'Phone', description: customer.phone},
            {term: 'Address', description: customer.address},
        ]

        return <DescriptionList items={customerDetails} />
    }
}

CustomerDetails.propTypes = {
    onChange: PropTypes.func.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
    customer: PropTypes.object.isRequired,
}

export default CustomerDetails
