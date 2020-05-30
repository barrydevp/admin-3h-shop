import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, InlineError, Modal, Select, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import {getListCategory} from '../../../services/api/CategoryServices'
import {updateProduct} from '../../../services/api/ProductAdminServices'

const _parseProduct = ({name, tags, description, image_path, out_price, discount, category_id}) => {
    const product = {}
    if (safeTrim(tags) !== '') product.tags = tags
    if (safeTrim(name) !== '') product.name = name
    if (safeTrim(description) !== '') product.description = description
    if (safeTrim(image_path) !== '') product.image_path = image_path
    if (safeTrim(discount) !== '') product.discount = parseFloat(discount)
    if (safeTrim(out_price) !== '') product.out_price = parseInt(out_price)
    if (safeTrim(category_id) !== '') product.category_id = parseInt(category_id)

    return product
}

class UpdateProductModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ...props.product,
            categories: [],
            message: {
                success: '',
                error: '',
            },
            loading: false,
        }
    }

    _mapProduct = product => {
        this.setState((prevState) => {
            return {
                ...prevState,
                ...product,
            }
        })
    }

    componentDidMount() {
        this._fetchCategories().then()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.product !== prevProps.product) {
            this._mapProduct(this.props.product)
        }
    }

    _clickSave = async () => {
        const {name, tags, description, image_path, out_price, discount, category_id} = this.state

        this.setState({loading: false, message: {error: '', success: ''}})

        try {
            const {success, message, data} = await updateProduct(this.props.productId, _parseProduct({
                name,
                tags,
                description,
                image_path,
                out_price,
                discount,
                category_id,
            }))

            if (!success) {
                throw new Error(message)
            }

            this.setState({
                loading: false,
                message: {error: '', success: ''},
            })
            this.props.fetchProduct()
            this.props.onToggle()

        } catch (e) {
            this.setState({
                loading: false,
                message: {error: '', success: ''},
            })
            return alert(e.message)
        }
    }

    _fetchCategories = async () => {
        this.setState({loading: true, message: {error: '', success: ''}})

        try {
            const {success, data, message} = await getListCategory({page: 1, limit: 500})
            if (!success) {
                throw new Error(message)
            }

            this.setState({
                categories: data && data.data && data.data.map(category => {
                    return {
                        label: category.name,
                        value: category._id,
                    }
                }) || [],
                message: {error: '', success: ''},
                loading: false,
            })
        } catch (e) {
            this.setState({loading: false, message: {error: e.message, success: ''}})
            alert(e.message || e)
        }
    }

    _onChange = (key, value) => this.setState({[key]: value})

    _canAdd = ({name, image_path, out_price, category_id}) => {
        return (
            name &&
            image_path &&
            out_price &&
            category_id
        )
    }

    render() {
        const {open, onToggle} = this.props
        const {name, tags, description, image_path, out_price, discount, category_id, categories, message, loading} = this.state

        const canAdd = this._canAdd({name, tags, description, image_path, out_price, discount, category_id}) && !loading

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={onToggle}
                    title="Update Product"
                    primaryAction={{
                        content: 'Save',
                        onAction: this._clickSave,
                        disabled: !canAdd,
                    }}
                    secondaryActions={[
                        {
                            content: 'Close',
                            onAction: onToggle,
                            disabled: loading,
                        },
                    ]}
                >
                    <Modal.Section>
                        <InlineError message={message.error}/>
                        <TextField
                            value={name}
                            onChange={(value) => this._onChange('name', value)}
                            label="Name"
                        />
                        <TextField
                            value={tags}
                            onChange={(value) => this._onChange('tags', value)}
                            label="Tags"
                        />
                        <TextField
                            value={description}
                            onChange={(value) =>
                                this._onChange('description', value)
                            }
                            label="Description"
                        />
                        <TextField
                            value={image_path}
                            onChange={(value) =>
                                this._onChange('image_path', value)
                            }
                            label="Image path"
                        />
                        <TextField
                            value={out_price+""}
                            type="number"
                            onChange={(value) =>
                                this._onChange('out_price', value)
                            }
                            label="Out price"
                            min={0.1}
                        />
                        <TextField
                            value={discount+""}
                            type="number"
                            onChange={(value) =>
                                this._onChange('discount', value)
                            }
                            label="Discount"
                            min={0}
                            max={1}
                            step={0.05}
                        />
                        <Select
                            disabled={!categories.length}
                            label="Category"
                            options={categories}
                            onChange={(value) => this._onChange('category_id', value)}
                            value={category_id}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

UpdateProductModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    fetchProduct: PropTypes.func.isRequired,
    productId: PropTypes.number.isRequired,
    product: PropTypes.object.isRequired,
}

export default UpdateProductModal
