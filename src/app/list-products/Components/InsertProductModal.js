import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, InlineError, Modal, Select, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import {getListCategory} from '../../../services/api/CategoryServices'

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

class InsertProductModal extends Component {
    state = {
        name: '',
        tags: '',
        description: '',
        image_path: '',
        out_price: 0.1,
        discount: 0,
        category_id: '',
        categories: [],
    }

    componentDidMount() {
        this._fetchCategories().then()
    }

    _clickSave = async () => {
        const {name, tags, description, image_path, out_price, discount, category_id} = this.state
        try {
            await this.props.save(_parseProduct({
                name,
                tags,
                description,
                image_path,
                out_price,
                discount,
                category_id,
            }))
            this.setState({
                name: '',
                tags: '',
                description: '',
                image_path: '',
                out_price: 0.1,
                discount: 0,
                category_id: '',
            })
        } catch (e) {
            return alert(e.message)
        }
    }

    _fetchCategories = async () => {
        try {
            const {success, data, message} = await getListCategory({page: 1, limit: 500})
            if (!success) {
                throw new Error(message)
            }

            this.setState({
                categories: (data && data.data && data.data.map(category => {
                    return {
                        label: category.name,
                        value: category._id,
                    }
                })) || [],
            })
        } catch (e) {
            this.setState({loading: false})
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
        const {open, toggle, loading, message} = this.props
        const {name, tags, description, image_path, out_price, discount, category_id, categories} = this.state

        const canAdd =
            this._canAdd({name, tags, description, image_path, out_price, discount, category_id}) && !loading

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={toggle}
                    title="Add new Product"
                    primaryAction={{
                        content: 'Add',
                        onAction: this._clickSave,
                        disabled: !canAdd,
                    }}
                    secondaryActions={[
                        {
                            content: 'Close',
                            onAction: toggle,
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
                            value={out_price + ''}
                            type="number"
                            onChange={(value) =>
                                this._onChange('out_price', value)
                            }
                            label="Out price"
                            min={0.1}
                        />
                        <TextField
                            value={discount + ''}
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
                            onChange={(value) => this._onChange('category_id', parseInt(value))}
                            value={category_id}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

InsertProductModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default InsertProductModal
