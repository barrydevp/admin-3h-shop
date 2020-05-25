import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ResourceItem, TextStyle} from '@shopify/polaris'
import {getOrderItems} from '../../../services/api/OrderAdminServices'
import {
    getPreviewImageWithCropAndResizeURL,
    getPreviewImageWithResizeURL,
} from '../../../services/api/PreviewServices'

class OrderItemRow extends Component {
    constructor(props) {
        super(props)

        const items = props.items || []

        this.state = {
            loading: !Array.isArray(this.props.items),
            orderItems: {
                data: items,
                total: 0,
            },
        }
    }

    componentDidMount() {
        if (this.state.loading) {
            this.fetchOrderItems()
        }
    }

    fetchOrderItems = async () => {
        const {orderId} = this.props
        this.setState({loading: true})
        try {
            const {success, data, message} = await getOrderItems(orderId)
            if (!success) throw new Error(message)

            this.setState({
                loading: false,
                orderItems: {
                    data,
                    total: data.length,
                },
            })
        } catch (e) {
            this.setState({
                loading: false,
            })
            alert(`${orderId}-${e.message || e}`)
        }
    }
    renderItem = (item) => {
        const {_id, price, photo, cropped_image} = item
        const {width, height, path} = {...photo}
        const preview =
            (cropped_image &&
                getPreviewImageWithCropAndResizeURL(path, 80, cropped_image)) ||
            getPreviewImageWithResizeURL(path, 500)
        return (
            <div key={_id}>
                <ResourceItem
                    id={item}
                    url={preview}
                    media={<img className="thumbnails" src={preview} alt="" />}
                >
                    <div className="ItemCaption">
                        <h3>
                            <TextStyle variation="strong">{`${Number(
                                price
                            ).toLocaleString()} đ`}</TextStyle>
                        </h3>
                        <TextStyle>{`${width}x${height}`}</TextStyle>
                    </div>
                </ResourceItem>
            </div>
        )
    }

    render() {
        const {loading, orderItems} = this.state
        const {data, total} = orderItems
        return (
            !!total &&
            !loading && (
                <div className={`relative h-row-${Math.ceil(total / 4)}`}>
                    <div className="absolute left-0 top-0 right-0 flex flex-wrap RowItem">
                        {data.map((item) => this.renderItem(item))}
                    </div>
                </div>
            )
        )
    }
}

OrderItemRow.propTypes = {
    orderId: PropTypes.string.isRequired,
}
export default OrderItemRow
