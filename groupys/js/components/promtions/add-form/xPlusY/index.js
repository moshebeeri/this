import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Platform,View,Text
} from 'react-native'


import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"

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
        if (value) {
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
    }

    setEligible(value) {
        if (value) {
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
    }


    createProductView() {
        if(this.props.state.product) {
            let productName = this.props.state.product.name
            return <View style={styles.inputTextLayout}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.PromotionOn}: {productName}</Text>
            </View>
        }
        return undefined

    }


    createProductGiftView() {
        if(this.props.state.giftProduct) {
            let productName = this.props.state.giftProduct.name
            return <View style={styles.inputTextLayout}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.Gift}: {productName}</Text>
            </View>
        }
        return undefined

    }

    render() {

        let productGiftView = this.createProductGiftView();
        let productView = this.createProductView()
        let buyValue = undefined;
        if(this.props.state.x_plus_y && this.props.state.x_plus_y.values){
            buyValue = this.props.state.x_plus_y.values.buy;
        }

        let eligibleValue = undefined;
        if(this.props.state.x_plus_y && this.props.state.x_plus_y.values){
            eligibleValue = this.props.state.x_plus_y.values.eligible;
        }
        return <View>

            <View style={styles.inputTextLayout}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>X Plus Y</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.inputPrecenComponent}>
                <TextInput field={strings.BuyAmount} value={buyValue}
                           returnKeyType='next' ref="Buy Amount" refNext="Buy Amount"
                           keyboardType='numeric'
                           onSubmitEditing={this.focusNextField.bind(this, "Number of Gifts")}
                           onChangeText={(value) => this.setBuy(value)} isMandatory={true}/>
            </View>
            <View style={{flex:1.7,marginTop:25}}><SelectButton ref="xplusyselectProduct" isMandatory selectedValue={this.props.state.product} title={strings.SelectProduct} action={this.showBuyProducts.bind(this, true)}/></View>

            </View>
            {productView}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.inputPrecenComponent}>
                <TextInput field={strings.NumberOfGifts} value={eligibleValue}
                           returnKeyType='next' ref="Number of Gifts" refNext="Number of Gifts"
                           keyboardType='numeric'
                           onChangeText={(value) => this.setEligible(value)} isMandatory={true}/>
            </View>
            <View style={{flex:1.7,marginTop:25}}><SelectButton ref="xplusyselectOmProduct" isMandatory selectedValue={this.props.state.giftProduct} title={strings.SelectGift} action={this.showProducts.bind(this, true)}/></View>

            </View>
            {productGiftView}

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

