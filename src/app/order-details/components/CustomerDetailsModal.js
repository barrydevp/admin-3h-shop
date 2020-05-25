import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {FormLayout, Modal, TextField} from '@shopify/polaris'
import {changeOrderAddress} from '../../../services/api/OrderAdminServices'

class CustomerDetailsModal extends Component {
    state = {
        customer: {
            full_name: '',
            email: '',
            postal_code: '',
            state: '',
            city: '',
            address: '',
            country: '',
            country_code: '',
        },
        loading: false,
    }

    componentDidUpdate() {
        if (this.props.isOrderChanged) {
            this._mapOrder(this.props.customer)
        }
    }

    _mapOrder = (customer) => this.setState({customer})

    _onChangeInput = (key, value) =>
        this.setState(({customer}) => ({
            customer: {...customer, [key]: value},
        }))

    _saveBuyer = async () => {
        const {loading, customer} = this.state
        const {order} = this.props

        if (loading) return

        try {
            this.setState({
                loading: true,
            })

            const {success, data, message} = await changeOrderAddress(
                order,
                customer
            )
            if (!success) {
                this.setState({loading: false})
                return alert(message)
            }
            this.setState({loading: false})
            this.props.onSave(data.address)
        } catch (e) {
            this.setState({loading: false})
            alert(e.message)
        }
    }

    render() {
        const {customer, loading} = this.state
        const {open} = this.props

        return (
            <Modal
                open={open}
                onClose={this.props.onToggle}
                title="Edit Buyer Details"
                primaryAction={{
                    content: 'Save',
                    disabled: loading,
                    onAction: this._saveBuyer,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        disabled: loading,
                        onAction: this.props.onToggle,
                    },
                ]}
            >
                <Modal.Section>
                    <FormLayout>
                        <TextField
                            label="Full Name"
                            value={customer.full_name || ''}
                            onChange={(v) =>
                                this._onChangeInput('full_name', v)
                            }
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('full_name', '')
                            }
                        />
                        <TextField
                            label="Email"
                            value={customer.email || ''}
                            type="email"
                            onChange={(v) => this._onChangeInput('email', v)}
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('full_name', '')
                            }
                        />
                        <TextField
                            label="Phone"
                            value={customer.phone || ''}
                            onChange={(v) => this._onChangeInput('phone', v)}
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('phone', '')
                            }
                        />
                        <TextField
                            label="Address"
                            value={customer.address || ''}
                            onChange={(v) => this._onChangeInput('address', v)}
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('address', '')
                            }
                        />
                        <TextField
                            label="District"
                            value={customer.district || ''}
                            onChange={(v) => this._onChangeInput('district', v)}
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('district', '')
                            }
                        />
                        <TextField
                            label="City/Province"
                            value={customer.city || ''}
                            onChange={(v) => this._onChangeInput('city', v)}
                            clearButton
                            onClearButtonClick={() =>
                                this._onChangeInput('city', '')
                            }
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        )
    }
}

CustomerDetailsModal.propTypes = {
    onChange: PropTypes.func.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
    customer: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
}

export default CustomerDetailsModal
