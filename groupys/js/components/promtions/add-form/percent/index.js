import React, {Component} from 'react';
import {Text, View} from 'react-native'
import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import strings from "../../../../i18n/i18n";
import StyleUtils from '../../../../utils/styleUtils';

const Discouint_on = [
    {
        value: 'GLOBAL',
        label: strings.GlobalDiscount
    },
    {
        value: 'PRODUCT',
        label: strings.ProductDiscount
    }
];
export default class PercentComponent extends Component {
    constructor(props) {
        super(props);
    }

    setPercent(value) {
        if (this.props.state.percent) {
            let quantity = this.props.state.percent.quantity;
            let retail_price = this.props.state.percent.retail_price;
            this.props.setState(
                {
                    percent: {
                        percent: value,
                        quantity: quantity,
                        retail_price: retail_price,
                    },
                }
            )
        } else {
            this.props.setState(
                {
                    percent: {
                        percent: percentNum,
                    },
                }
            )
        }
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

    setRetailPrice(value) {
        if (this.props.state.percent) {
            let percent = this.props.state.percent.percent;
            let quantity = this.props.state.percent.quantity;
            this.props.setState(
                {
                    percent: {
                        percent: percent,
                        quantity: quantity,
                        retail_price: value,
                    },
                }
            )
        } else {
            this.props.setState(
                {
                    percent: {
                        retail_price: value,
                    },
                }
            )
        }
    }

    selectProduct(product) {
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

    selectPromotionType(value) {
        if (value) {
            this.props.setState({
                discount_on: value,
                choose_distribution: true
            })
        } else {
            this.props.setState({
                discount_on: value,
                choose_distribution: false
            })
        }
    }

    createSelectProductButton() {
        let result = undefined;
        if (this.props.state.discount_on === 'PRODUCT') {
            let button = <View style={{marginTop: 25}}><SelectButton isMandatory ref="precentSelectProduct"
                                                                     selectedValue={this.props.state.product}
                                                                     title={strings.SelectProduct}
                                                                     action={this.showProducts.bind(this, true)}/></View>
            let retailPrice =
                <View style={styles.inputPrecenComponent}>

                    <TextInput field={strings.RetailPrice} value={this.props.state.percent.retail_price}
                               returnKeyType='next' ref="retail" refNext="retail"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setRetailPrice(value)} isMandatory={true}/>
                </View>
            let discount =
                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.Discount} value={this.props.state.percent.percent}
                               returnKeyType='next' ref="discount" refNext="discount"
                               keyboardType='numeric'
                               placeholder="%"
                               validateContent={FormUtils.validatePercent}
                               onChangeText={(value) => this.setPercent(value)} isMandatory={true}/>
                </View>
            return <View style={{flexDirection: 'row'}}>{button}{retailPrice}{discount}</View>
        }
        if (this.props.state.discount_on === 'GLOBAL') {
            return <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>


                <TextInput field={strings.PercentageOff} value={this.props.state.percent.percent}
                           returnKeyType='next' ref="off" refNext="off"
                           keyboardType='numeric'
                           validateContent={FormUtils.validatePercent}
                           onChangeText={(value) => this.setPercent(value)} isMandatory={true}/>
            </View>
        }
        return result;
    }

    createProductView() {
        if (this.props.state.product) {
            let productName = this.props.state.product.name
            return <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <Text
                    style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.DiscountOn}: {productName}</Text>
            </View>
        }
        return undefined
    }

    render() {
        let promotionOn = this.createSelectProductButton();
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>

                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.PercentDiscount}</Text>
            </View>
            <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                <SimplePicker ref="PromotionOn" list={Discouint_on} itemTitle={strings.PromotionOn}
                              defaultHeader="Choose Type" isMandatory
                              onValueSelected={this.selectPromotionType.bind(this)}/>
            </View>
            {promotionOn}
            {this.createProductView()}

        </View>
    }
}

