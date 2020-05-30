import React, {Component} from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import {ContextualSaveBar, Frame} from '@shopify/polaris'
import {Redirect, Route, Switch} from 'react-router-dom'
import {hasRoles} from '../../../services/AuthServices'
import ListOrderContainer from '../../list-orders/components/ListOrderContainer'
import OrderDetailsContainer from '../../order-details/components/OrderDetailsContainer'
import {DashboardContextProvider} from '../../shared/DashboardContext'
import StatisticsContainer from '../../statistics/components/StatisticsContainer'
import ListUserContainer from '../../list-users/Components/ListUserContainer'
import ProfileContainer from '../../profile/components/ProfileContainer'
import UserDetailsContainer from '../../user-details/components/UserDetailsContainer'
import StoreSettingsContainer from '../../store-settings/components/StoreSettingsContainer'
import TrackingContainer from '../../tracking-details/components/TrackingContainer'
import StoreDetailContainer from '../../store-details/components/StoreDetailContainer'
import BankDetailContainer from '../../bank-details/components/BankDetailContainer'
import ListProductContainer from '../../list-products/Components/ListProductContainer'
import ProductDetailsContainer from '../../product-details/components/ProductDetailsContainer'
import ListCouponContainer from '../../list-coupons/Components/ListCouponContainer'

class Dashboard extends Component {
    state = {
        navigation: false,
        saveAction: null,
        contextSaveBar: '',
        discardAction: null,
        loading: false,
        disabled: true,
    }

    _toggleNavigation = () =>
        this.setState({navigation: !this.state.navigation})

    setSaveAction = (saveAction) => this.setState({saveAction})

    setDiscardAction = (discardAction) => this.setState({discardAction})

    setContextSaveBar = (contextSaveBar) => this.setState({contextSaveBar})

    setContextLoading = (loading) => this.setState({loading})

    setContextDisabled = (disabled) => this.setState({disabled})

    render() {
        const {
            discardAction,
            saveAction,
            contextSaveBar,
            loading,
            disabled,
        } = this.state
        const {
            setSaveAction,
            setDiscardAction,
            setContextSaveBar,
            setContextDisabled,
            setContextLoading,
        } = this
        const dashboardContext = {
            discardAction,
            saveAction,
            contextSaveBar,
            setSaveAction,
            setDiscardAction,
            setContextSaveBar,
            setContextDisabled,
            setContextLoading,
            loading,
            disabled,
        }

        return (
            <Frame
                topBar={
                    <DashboardHeader
                        toggleNavigation={this._toggleNavigation}
                    />
                }
                navigation={<DashboardSidebar/>}
                showMobileNavigation={this.state.navigation}
                onNavigationDismiss={this._toggleNavigation}
            >
                {!!contextSaveBar && (
                    <ContextualSaveBar
                        message={contextSaveBar}
                        saveAction={{
                            onAction: saveAction,
                            loading,
                            disabled,
                        }}
                        discardAction={{
                            onAction: discardAction,
                        }}
                    />
                )}
                <DashboardContextProvider value={dashboardContext}>
                    <Switch>
                        <Route
                            exact
                            path={'/statistics'}
                            component={StatisticsContainer}
                        />
                        <Route
                            exact
                            path={'/orders'}
                            component={ListOrderContainer}
                        />
                        <Route
                            exact
                            path={'/orders/:id'}
                            component={OrderDetailsContainer}
                        />
                        <Route
                            exact
                            path={'/profile'}
                            component={ProfileContainer}
                        />
                        {hasRoles(1) && (
                            <Route
                                exact
                                path={'/users'}
                                component={ListUserContainer}
                            />
                        )}
                        {hasRoles(1) && (
                            <Route
                                exact
                                path={'/users/:userId'}
                                component={UserDetailsContainer}
                            />
                        )}
                        {hasRoles(1) && (
                            <Route
                                exact
                                path={'/products'}
                                component={ListProductContainer}
                            />
                        )}
                        {hasRoles(1) && (
                            <Route
                                exact
                                path={'/products/:id'}
                                component={ProductDetailsContainer}
                            />
                        )}
                        {hasRoles(1) && (
                            <Route
                                exact
                                path={'/coupons'}
                                component={ListCouponContainer}
                            />
                        )}
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/products/:id'}*/}
                        {/*        component={ProductDetailsContainer}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/store-settings'}*/}
                        {/*        component={StoreSettingsContainer}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/store-settings'}*/}
                        {/*        component={StoreSettingsContainer}*/}
                        {/*    />*/}
                        {/*)}*/}
                        
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/store-settings/store-information'}*/}
                        {/*        component={StoreDetailContainer}*/}
                        {/*    />*/}
                        {/*)}*/}
                        
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/store-settings/bank-information'}*/}
                        {/*        component={BankDetailContainer}*/}
                        {/*    />*/}
                        {/*)}*/}
                        
                        {/*{hasRoles(1) && (*/}
                        {/*    <Route*/}
                        {/*        exact*/}
                        {/*        path={'/store-settings/tracking-information'}*/}
                        {/*        component={TrackingContainer}*/}
                        {/*    />*/}
                        {/*)}*/}

                        <Route path={'*'}>
                            <Redirect to={'/orders'}/>
                        </Route>
                    </Switch>
                </DashboardContextProvider>
            </Frame>
        )
    }
}

export default Dashboard
