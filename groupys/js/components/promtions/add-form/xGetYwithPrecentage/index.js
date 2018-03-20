import React, {Component} from 'react';
import {Keyboard, View} from 'react-native'
import FormUtils from "../../../../utils/fromUtils";
import styles from '../styles'
import {SelectButton, TextInput, ThisText} from '../../../../ui/index';
import strings from "../../../../i18n/i18n";
import StyleUtils from '../../../../utils/styleUtils';
import {Thumbnail} from 'native-base';
import ProductPreview from "../../../product/productPreview/index";

export default class XPlusYOffComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setState({
            discount_on: 'PRODUCT'
        })
    }

    selectProduct(product) {
        this.props.setState(
            {
                giftProduct: product
            }
        )
    }

    done() {
        Keyboard.dismiss();
    }

    isValid() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    selectBuyProduct(product) {
        this.props.setState(
            {
                product: product
            }
        )
    }

    showProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId
        })
    }

    showBuyProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId
        })
    }

    setOff(value) {
        if (value) {
            this.props.setState({
                choose_distribution: true,
                x_plus_n_percent_off: {
                    eligible: value,
                }
            })
        }
    }

    render() {
        let discount = '';
        if (this.props.state.x_plus_n_percent_off && this.props.state.x_plus_n_percent_off.eligible) {
            discount = this.props.state.x_plus_n_percent_off.eligible;
        }
        return <View>

            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>


                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.XPlusYOff}</ThisText>
            </View>
            <View style={[styles.inputTextLayout, {flexDirection: 'row'}]}>

                <View style={{flex: 1.7, marginTop: 20}}><SelectButton ref="xgetyselectProduct" isMandatory
                                                                       selectedValue={this.props.state.product}
                                                                       title={strings.SelectProduct}
                                                                       action={this.showBuyProducts.bind(this, true)}/></View>

            </View>
            <ProductPreview product={this.props.state.product}/>

            <View style={[styles.inputTextLayout, {flexDirection: 'row'}]}>
                <View style={{flex: 1.7, marginTop: 20}}><SelectButton ref="xgetyselectOmProduct" isMandatory
                                                                       selectedValue={this.props.state.giftProduct}
                                                                       title={strings.SelectOn}
                                                                       action={this.showProducts.bind(this, true)}/></View>

                <View style={{width: 200}}>
                    <TextInput field={strings.PercentageOff} value={discount}
                               returnKeyType='done' ref="2" refNext="2"
                               keyboardType='numeric'
                               validateContent={FormUtils.validatePercent}
                               onSubmitEditing={this.done.bind(this)}
                               onChangeText={(value) => this.setOff(value)} isMandatory={true}/>
                </View>

            </View>
            <ProductPreview product={this.props.state.giftProduct} type='gift'/>

        </View>
    }
}

