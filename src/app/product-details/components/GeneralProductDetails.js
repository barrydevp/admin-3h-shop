import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DescriptionList, Thumbnail, TextStyle, Stack, Badge} from '@shopify/polaris'
import moment from 'moment'
import '../../../scss/app.scss'

class GeneralProductDetails extends Component {

    _onChange = (key, value) => {
        this.setState({[key]: value}, () =>
            this.props.onChange({[key]: value}, key),
        )
    }

    _upper = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

    _formatDate = (date, format = 'llll') =>
        date ? moment(date).format(format) : ''

    _makeTags = (tags, _id) => {
        if (Array.isArray(tags)) {
            return tags.map((e, i) => <Badge key={_id + i + e}>{e}</Badge>)
        }

        return null
    }

    render() {
        const {product} = this.props
        const {name, tags, description, image_path, out_price, discount, category_id, created_at, updated_at} = product

        const productDetailRender = [
            {
                term: 'Name',
                description: (
                    <div>
                        {name && <b className="mr-1"><TextStyle
                            variation={
                                'positive'
                            }
                        >
                            {name}
                        </TextStyle></b>}
                    </div>
                ),
            },
            {
                term: 'Tags',
                description: (
                    <div>
                        <Stack spacing="none">{tags && this._makeTags(tags, product._id)}</Stack>
                    </div>
                ),
            },
            {
                term: 'Description',
                description: (
                    <div>
                        {description}
                    </div>
                ),
            },
            {
                term: 'Thumbnail',
                description: (
                    <Thumbnail
                        source={image_path}
                        size="large"
                        alt={name}
                    />
                ),
            },
            {
                term: 'Out price',
                description: (
                    <div>
                        {out_price && <b className="mr-1"><TextStyle
                            variation={
                                'positive'
                            }
                        >
                            {out_price}
                        </TextStyle></b>}
                    </div>
                ),
            },
            {
                term: 'Discount',
                description: (
                    <div>
                        {name && <b className="mr-1"><TextStyle
                            variation={
                                'subdued'
                            }
                        >
                            {discount}
                        </TextStyle></b>}
                    </div>
                ),
            },
            {
                term: 'Created At',
                description: (this._formatDate(created_at)),
            },
            {
                term: 'Updated At',
                description: (this._formatDate(updated_at)),
            },
        ]

        return (
            <div className="clearfix">
                <DescriptionList items={productDetailRender}/>
            </div>
        )
    }
}

GeneralProductDetails.propTypes = {
    product: PropTypes.object.isRequired,
}

export default GeneralProductDetails
