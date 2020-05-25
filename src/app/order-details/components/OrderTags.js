import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, FormLayout, Tag, TextField, Button} from '@shopify/polaris'
import {changeOrderTags} from '../../../services/api/OrderAdminServices'

class OrderTags extends Component {
    state = {tags: [], value: '', loading: false}

    componentDidMount() {
        this._mapTags(this.props.tags)
    }

    componentDidUpdate() {
        if (this.props.isOrderChanged) {
            this._mapTags(this.props.tags)
        }
    }

    _mapTags = (tags) => this.setState({tags})

    _clickRemove = (i) => {
        const {tags} = this.state
        const newTags = tags.filter((itm, j) => {
            return i !== j
        })

        this.setState(
            {
                tags: newTags,
            },
            () => this._changeOrder()
        )
    }

    _onChange = (value) => this.setState({value})

    _submitTags = (e) => {
        e.preventDefault()
        const {value, tags} = this.state
        const newTags = value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        const totalTags = [...tags, ...newTags]

        this.setState(
            {
                tags: totalTags.filter((tag, i) => {
                    return totalTags.indexOf(tag) === i
                }),
                value: '',
            },
            () => this._changeOrder()
        )
    }

    _changeOrder = () => {
        const {tags} = this.state
        this.props.onChange({tags}, 'tags')
    }

    _onClickSave = async () => {
        const {tags, loading} = this.state
        const {orderId} = this.props
        if (loading) return

        try {
            this.setState({loading: true})
            const {success, message} = await changeOrderTags(orderId, {
                tags,
            })
            this.setState({loading: false})
            if (!success) return alert(message)
        } catch (e) {
            this.setState({loading: false})
            return alert(e.message)
        }
    }

    render() {
        const {value, loading} = this.state

        const tags = this.state.tags.map((tag, i) => (
            <div className="pr-3 mb-3" key={`tag_${i}`}>
                <Tag onClick={() => this._clickRemove(i)}>{tag}</Tag>
            </div>
        ))

        return (
            <div>
                <div className="flex flex-wrap">{tags}</div>
                <div className="py-2">
                    <Form onSubmit={this._submitTags}>
                        <FormLayout>
                            <TextField
                                value={value}
                                onChange={this._onChange}
                                label=""
                                placeholder="Tags separated by comma"
                            />
                        </FormLayout>
                    </Form>
                </div>
                <Button primary disabled={loading} onClick={this._onClickSave}>
                    Save
                </Button>
            </div>
        )
    }
}

OrderTags.propTypes = {
    tags: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    orderId: PropTypes.string.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
}

export default OrderTags
