import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, InlineError, Modal, Select, TextField} from '@shopify/polaris'
import safeTrim from '../../../helpers/safeTrim'
import moment from 'moment'
import {getListCategory} from '../../../services/api/CategoryServices'

const _parseWarranty = ({code, description, month, trial, category_id}) => {
    const warranty = {}

    if (safeTrim(code) !== '') warranty.code = safeTrim(code)
    if (safeTrim(description) !== '') warranty.description = safeTrim(description)
    if (month) warranty.month = parseInt(month)
    if (trial) warranty.trial = parseInt(trial)
    if (category_id) warranty.category_id = parseInt(category_id)

    return warranty
}

class InsertWarrantyModal extends Component {
    state = {
        code: '',
        description: '',
        month: 1,
        trial: 0,
        category_id: 0,
        categories: [],
    }

    componentDidMount() {
        this._fetchCategories().then()
    }

    _clickSave = async () => {
        const {
            code, description, month, trial, category_id,
        } = this.state

        try {
            await this.props.save(_parseWarranty({
                code, description, month, trial, category_id,
            }))
            this.setState({
                code: '',
                description: '',
                month: 1,
                trial: 0,
                category_id: 0,
            })
        } catch (e) {
            return alert(e.message)
        }
    }

    _onChange = (key, value) => {
        this.setState({[key]: value})
    }

    _canAdd = ({code, description, month, trial, category_id}) => {
        return (
            safeTrim(code) &&
            safeTrim(description) &&
            month &&
            category_id
        )
    }

    _fetchCategories = async () => {
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
            })
        } catch (e) {
            this.setState({loading: false})
            alert(e.message || e)
        }
    }

    render() {
        const {open, toggle, loading, message} = this.props
        const {
            code,
            description,
            month,
            trial,
            category_id,
            categories,
        } = this.state

        const canAdd =
            this._canAdd({
                code,
                description,
                month,
                trial,
                category_id,
            }) && !loading

        return (
            <Form>
                <Modal
                    open={open}
                    onClose={toggle}
                    title="Add new Warranty"
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
                            value={code}
                            onChange={(value) => this._onChange('code', value.toUpperCase())}
                            label="Code"
                        />
                        <TextField
                            value={month + ''}
                            type="number"
                            onChange={(value) =>
                                this._onChange('month', value)
                            }
                            label="Month"
                            min={1}
                            max={10000}
                            step={1}
                            helpText={'Number of month warranty'}
                        />
                        <TextField
                            value={trial + ''}
                            type="number"
                            onChange={(value) =>
                                this._onChange('trial', value)
                            }
                            label="Trial"
                            min={0}
                            max={100}
                            step={1}
                            helpText={'Number of day free trial'}
                        />
                        <TextField
                            value={description}
                            onChange={(value) =>
                                this._onChange('description', value)
                            }
                            label="Description"
                        />
                        <Select
                            disabled={!categories.length}
                            label="Category"
                            options={categories}
                            onChange={(value) => {
                                this._onChange('category_id', parseInt(value))
                            }}
                            value={category_id}
                        />
                    </Modal.Section>
                </Modal>
            </Form>
        )
    }
}

InsertWarrantyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default InsertWarrantyModal
