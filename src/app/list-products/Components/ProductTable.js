import React from 'react'
import {Badge, DataTable, Stack, TextStyle} from '@shopify/polaris'
import {Link} from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

const defaultHeader = ['Name', 'Tags', 'Description', 'Out price', 'Discount']
const defaultColumnContentTypes = ['text', 'text', 'text', 'text', 'text']

const _formatDate = (date) => {
    return date ? moment(date).format('llll') : ''
}

class ProductTable extends React.Component {
    getProductDetailLink = (product) => {
        const {_id} = product
        return `/products/${_id}`
    }

    _makeTags = (tags, _id) => {
        if (Array.isArray(tags)) {
            return tags.map((e, i) => <Badge key={_id + i + e}>{e}</Badge>)
        }

        return null
    }

    makeRow = (products) => {
        const rows = []

        products.forEach((product) => {
            const nameCol = (
                <span className="cursor-pointer text-blue-500">
                    <Link to={this.getProductDetailLink(product)}>{product.name}</Link>
                </span>
            )

            const tagsCol = (
                <Stack spacing="none">{product.tags && this._makeTags(product.tags, product._id)}</Stack>
            )

            const descriptionCol = product.description

            const outPriceCol = (
                <Badge
                    status={'success'}
                >
                    {product.out_price}
                </Badge>
            )
            const discountCol = (
                <Badge
                    status={'attention'}
                >
                    {product.discount}
                </Badge>
            )

            rows.push([
                nameCol,
                tagsCol,
                descriptionCol,
                outPriceCol,
                discountCol,
            ])
        })

        return rows
    }

    makeColumns = () => {
        const vHeading = [...defaultHeader]
        const vColumnContentTypes = [...defaultColumnContentTypes]

        return {
            heading: vHeading.map((text) => <b>{text}</b>),
            columnContentTypes: vColumnContentTypes,
        }
    }

    render() {
        const {products, page, limit, total} = this.props

        const rows = this.makeRow(products || [])
        const {heading, columnContentTypes} = this.makeColumns()
        const footer = `Showing ${(page - 1) * limit + 1} - ${
            page * limit
        } of ${total} results`
        return (
            <DataTable
                headings={heading}
                rows={rows}
                columnContentTypes={columnContentTypes}
                footerContent={footer}
            />
        )
    }
}

ProductTable.propTypes = {
    products: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
}

export default ProductTable
