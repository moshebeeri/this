import React, {Component} from "react";
import {connect} from "react-redux";
import {Provider, ScrollView, View} from "react-native";
import {Button, Container, Content, Fab, Icon, Left, ListItem, Right, Thumbnail} from "native-base";
import {bindActionCreators} from "redux";
import ProductListView from "../../../product/listView/index"
import * as promotionsAction from "../../../../actions/promotions";
import strings from "../../../../i18n/i18n"
import {FormHeader} from '../../../../ui/index';
import navigationUtils from '../../../../utils/navigationUtils'

class SelectProductsComponent extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {filter: ''}
    }

    navigateToAdd() {
        navigationUtils.doNavigation(this.props.navigation, "AddProduct", {business: {_id: this.props.navigation.state.params.businessId}});
    }

    selectProduct(product) {
        this.props.navigation.state.params.selectProduct(product)
        this.props.navigation.goBack();
    }

    filterProduct(product) {
        this.setState({filter: product});
    }

    render() {
        const {businesses} = this.props;
        let productsRows = undefined
        const products = businesses.businessesProducts[this.props.navigation.state.params.businessId];
        if (products && products.length > 0) {
            productsRows = products.map((r, i) => {
                if (this.state.filter) {
                    if (!r.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                        return undefined;
                    }
                }
                return <ProductListView key={i} index={i} item={r} select={this.selectProduct.bind(this)}/>
            });
            productsRows = productsRows.filter((p) => p);
        }
        return (

            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <ScrollView style={{backgroundColor: '#fff'}}>
                    <FormHeader filter={this.filterProduct.bind(this)} showBack navigation={this.props.navigation}
                                title={strings.SelectProduct} bgc="#FA8559"/>


                    {productsRows}

                </ScrollView>

                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#ff6400"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="ios-add"/>

                </Fab>
            </View>


        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'SelectProductsComponent') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        promotions: state.promotions,
        products: state.products,
        businesses: state.businesses,
        currentScreen: state.render.currentScreen,
    }),
    dispatch => bindActionCreators(promotionsAction, dispatch)
)(SelectProductsComponent);