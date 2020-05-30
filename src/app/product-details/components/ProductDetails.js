import {Card, Layout, Page, PageActions} from '@shopify/polaris'
import React, {Component} from 'react'
import {
    getProductById,
} from '../../../services/api/ProductServices'
import {useDashboardContext} from '../../shared/DashboardContext'
import GeneralProductDetails from './GeneralProductDetails'
import UpdateProductModal from './UpdateProductModal'
import {handleGoto} from '../../../store/getHistory'

class ProductDetails extends Component {
    state = {
        product: {
            name: '',
            tags: '',
            description: '',
            image_path: '',
            out_price: '',
            discount: '',
            category_id: '',
        },
        toggleEditProduct: false,
        loading: false,
    }

    componentDidMount() {
        this._fetchProduct().then()
    }

    _fetchProduct = async () => {
        const {id} = this.props.match.params

        this.setState({
            loading: true,
        })

        try {
            const {success, data, message} = await getProductById(id)
            if (!success) return alert(message)

            this.setState(({product}) => {
                    return {
                        product: {
                            ...product,
                            ...data,
                        },
                        loading: false,
                    }
                },
            )
        } catch (e) {
            this.setState({loading: false})

            alert(e.message)
        }

    }

    _toggleEditProductDetails = () =>
        this.setState(({toggleEditProduct}) => ({
            toggleEditProduct: !toggleEditProduct,
        }))

    render() {
        const {
            product,
            toggleEditProduct,
            loading,
        } = this.state

        const productDetailsActions = [
            {content: 'Edit', onAction: this._toggleEditProductDetails, disabled: loading},
        ]

        return (
            <Page
                fullWidth
                title={product.name || ''}
                breadcrumbs={[{content: 'Products', onAction: handleGoto('/products')}]}
            >
                <Layout>
                    <Layout.Section>
                        <UpdateProductModal
                            product={product}
                            onToggle={this._toggleEditProductDetails}
                            open={toggleEditProduct}
                            fetchProduct={this._fetchProduct}
                            productId={parseInt(this.props.match.params)}
                        />
                        <Card title="Product Details" sectioned actions={productDetailsActions}>
                            <GeneralProductDetails
                                product={product}
                                fetchProduct={this._fetchProduct}
                            />
                        </Card>
                    </Layout.Section>
                </Layout>
                <div className="mt-8"/>
                <PageActions
                    secondaryActions={[
                        {
                            content: 'Delete',
                            destructive: true,
                            disabled: loading,
                        },
                    ]}
                />
            </Page>
        )
    }
}

export default useDashboardContext(ProductDetails)
