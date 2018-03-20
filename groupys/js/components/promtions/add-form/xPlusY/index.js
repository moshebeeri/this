import React, {Component} from 'react';
import {Keyboard, Platform, Text, View} from 'react-native'
import styles from '../styles'
import {SelectButton, TextInput} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';
import {Thumbnail} from 'native-base';
import ProductPreview from "../../../product/productPreview/index";
import {ThisText} from '../../../../ui/index';

export default class XPlusYComponent extends Component {
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

    setBuy(value) {
        let eligible = undefined;
        if (this.props.state.x_plus_y && this.props.state.x_plus_y.values) {
            eligible = this.props.state.x_plus_y.values.eligible;
        }
        this.props.setState({
            choose_distribution: true,
            x_plus_y:
                {
                    values: {
                        buy: value,
                        eligible: eligible,
                    }
                }
        })
    }

    setEligible(value) {
        let buy = undefined;
        if (this.props.state.x_plus_y && this.props.state.x_plus_y.values) {
            buy = this.props.state.x_plus_y.values.buy;
        }
        this.props.setState({
            x_plus_y:
                {
                    values: {
                        buy: buy,
                        eligible: value,
                    }
                }
        })
    }

    done() {
        Keyboard.dismiss();
    }

    render() {
        let buyValue = undefined;
        if (this.props.state.x_plus_y && this.props.state.x_plus_y.values) {
            buyValue = this.props.state.x_plus_y.values.buy;
        }
        let eligibleValue = undefined;
        if (this.props.state.x_plus_y && this.props.state.x_plus_y.values) {
            eligibleValue = this.props.state.x_plus_y.values.eligible;
        }
        return <View>

            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.XPlusY}</ThisText>
            </View>
            <View style={{ flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                paddingRight: 5,
                paddingLeft: 5,
                width: StyleUtils.getWidth() - 15}}>
                <View style={{ marginTop: 20}}><SelectButton ref="xplusyselectProduct" isMandatory
                                                                       selectedValue={this.props.state.product}
                                                                       title={strings.SelectProduct}
                                                                       action={this.showBuyProducts.bind(this, true)}/></View>

                <View style={{width:200}}>
                    <TextInput field={strings.BuyAmount} value={buyValue}
                               returnKeyType='next' ref="Buy Amount" refNext="Buy Amount"
                               keyboardType='numeric'
                               onSubmitEditing={this.focusNextField.bind(this, "Number of Gifts")}
                               onChangeText={(value) => this.setBuy(value)} isMandatory={true}/>
                </View>

            </View>
            <ProductPreview product={this.props.state.product} />

            <View style={{ flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                paddingRight: 5,
                paddingLeft: 5,
                width: StyleUtils.getWidth() - 15}}>
                <View style={{ marginTop: 20}}><SelectButton ref="xplusyselectOmProduct" isMandatory
                                                                       selectedValue={this.props.state.giftProduct}
                                                                       title={strings.SelectGift}
                                                                       action={this.showProducts.bind(this, true)}/></View>

                <View style={{width:200}}>
                    <TextInput field={strings.NumberOfGifts} value={eligibleValue}
                               returnKeyType='done' ref="Number of Gifts" refNext="Number of Gifts"
                               keyboardType='numeric'
                               onSubmitEditing={this.done.bind(this)}
                               onChangeText={(value) => this.setEligible(value)} isMandatory={true}/>
                </View>


            </View>
            <ProductPreview product={this.props.state.giftProduct} type='gift' />

        </View>
    }

    focusNextField(nextField) {
        if (this.refs[nextField] && this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField] && this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }
}

