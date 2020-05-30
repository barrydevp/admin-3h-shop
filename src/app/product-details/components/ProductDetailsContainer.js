import React, {Component} from 'react'
import ProductDetails from './ProductDetails'

class ProductDetailsContainer extends Component {
    render() {
        return <ProductDetails {...this.props} />
    }
}

export default ProductDetailsContainer
