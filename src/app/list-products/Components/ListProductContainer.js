import React, {Component} from 'react'
import ListProduct from './ListProduct'

class ListProductContainer extends Component {
    render() {
        return <ListProduct {...this.props} />
    }
}

export default ListProductContainer
