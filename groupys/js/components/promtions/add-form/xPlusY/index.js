import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Platform,View,Text
} from 'react-native'


import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';

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
            return <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Promotion on: {productName}</Text>
            </View>
        }
        return undefined

    }


    createProductGiftView() {
        if(this.props.state.giftProduct) {
            let productName = this.props.state.giftProduct.name
            return <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Gift: {productName}</Text>
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

            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>X Plus Y</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.inputPrecenComponent}>
                <TextInput field='Buy Amount' value={buyValue}
                           returnKeyType='next' ref="2" refNext="2"
                           keyboardType='numeric'
                           onChangeText={(value) => this.setBuy({value})} isMandatory={true}/>
            </View>
            <View style={{flex:1.7,marginTop:25}}><SelectButton title="Select Product" action={this.showBuyProducts.bind(this, true)}/></View>

            </View>
            {productView}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.inputPrecenComponent}>
                <TextInput field='Number of Gifts' value={eligibleValue}
                           returnKeyType='next' ref="2" refNext="2"
                           keyboardType='numeric'
                           onChangeText={(value) => this.setEligible({value})} isMandatory={true}/>
            </View>
            <View style={{flex:1.7,marginTop:25}}><SelectButton title="Select Gift" action={this.showProducts.bind(this, true)}/></View>

            </View>
            {productGiftView}

        </View>
    }
}

