import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from '@shopify/polaris'
import InsertProductModal from './InsertProductModal'
import {insertProduct} from '../../../services/api/ProductAdminServices'
import {CirclePlusMajorMonotone} from '@shopify/polaris-icons'

class InsertProduct extends Component {
    state = {
        toggle: false,
        loading: false,
        message: {
            error: '',
            success: '',
        },
    }

    _toggle = () => {
        if (this.state.loading) return
        this.setState({toggle: !this.state.toggle})
    }

    _save = async (product) => {
        // console.log(product)
        if (this.state.loading) return
        this.setState({loading: true})

        const {success, data, message} = await insertProduct(product)

        if (!success) {
            this.setState({
                loading: false,
                message: {error: message || 'Error.', success: ''},
            })
            throw new Error(message)
        }
        this.props.insert(data)
        this.setState(
            {
                loading: false,
                message: {error: '', success: 'Add product successfully.'},
            },
            this._toggle
        )
        return {success, data, message}
    }

    render() {
        const {toggle, loading, message} = this.state

        return (
            <div className="InsertProduct mb-2 mr-4">
                <Button
                    primary
                    onClick={this._toggle}
                    icon={CirclePlusMajorMonotone}
                >
                    Add new
                </Button>
                <InsertProductModal
                    open={toggle}
                    toggle={this._toggle}
                    save={this._save}
                    loading={loading}
                    message={message}
                />
            </div>
        )
    }
}

InsertProduct.propTypes = {
    insert: PropTypes.func.isRequired,
}

export default InsertProduct
