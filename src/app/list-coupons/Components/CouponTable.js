import React from 'react'
import {DataTable, TextStyle} from '@shopify/polaris'
import {Link} from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import UpdateCouponModal from './UpdateCouponModal'
import {insertCoupon, updateCoupon} from '../../../services/api/CouponAdminServices'

const defaultHeader = ['Code', 'Discount', 'Description', 'Expires at', 'Updated at']
const defaultColumnContentTypes = ['text', 'text', 'text', 'text', 'text']

const _formatDate = (date, format = 'llll') =>
    date ? moment(date).format(format) : ''

class CouponTable extends React.Component {
    state = {
        couponId: 0,
    }

    toggleUpdate = (_id) => () => {
        this.setState({
            couponId: _id,
        })
    }

    getCouponDetailLink = (_id) => {

        return `/coupons/${_id}`
    }

    makeRow = (coupons) => {
        const rows = []

        coupons.forEach(({_id, code, description, discount, expires_at, updated_at}) => {
            const codeCol = (
                <span className="cursor-pointer text-blue-500" onClick={this.toggleUpdate(_id)}>
                    {code}
                </span>
            )

            const descriptionCol = description

            const discountCol = (
                <TextStyle variation="positive">
                    {discount}
                </TextStyle>
            )

            const expiresAtCol = expires_at && <TextStyle variation="negative">
                {_formatDate(expires_at)}
            </TextStyle>

            const updatedAtCol = updated_at && (
                <TextStyle variation="positive">
                    {_formatDate(updated_at)}
                </TextStyle>
            )

            rows.push([
                codeCol,
                discountCol,
                descriptionCol,
                expiresAtCol,
                updatedAtCol,
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
        const {coupons, page, limit, total, onUpdateCoupon} = this.props
        const {couponId} = this.state

        const rows = this.makeRow(coupons || [])
        const {heading, columnContentTypes} = this.makeColumns()
        const footer = `Showing ${(page - 1) * limit + 1} - ${
            page * limit
        } of ${total} results`
        return (
            <React.Fragment>
                <DataTable
                    headings={heading}
                    rows={rows}
                    columnContentTypes={columnContentTypes}
                    footerContent={footer}
                />
                <UpdateCouponModal couponId={couponId} toggle={this.toggleUpdate(0)} onUpdateCoupon={onUpdateCoupon} coupons={coupons}/>
            </React.Fragment>
        )
    }
}

CouponTable.propTypes = {
    coupons: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    onUpdateCoupon: PropTypes.func.isRequired,
}

export default CouponTable
