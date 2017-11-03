import React, {Component} from 'react';
import {Text, View} from 'react-native'
import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';

;const Discouint_on = [
    {
        value: 'GLOBAL',
        label: 'Global Discount'
    },
    {
        value: 'PRODUCT',
        label: 'Product Discount'
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
            let button = <View style={{marginTop:25}}><SelectButton title="Select Product" action={this.showProducts.bind(this, true)}/></View>
            let retailPrice =
                <View style={styles.inputRetailComponent}>
                    <TextInput field='Retail Price' value={this.props.state.percent}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setRetailPrice({value})} isMandatory={true}/>
                </View>
            let discount = <View style={styles.inputPrecenComponent}>
                <TextInput field='Discount' value={this.props.state.percent}
                           returnKeyType='next' ref="2" refNext="2"
                           keyboardType='numeric'
                           placeholder="%"
                           onChangeText={(value) => this.setPercent({value})} isMandatory={true}/>
            </View>
            return <View style={{flexDirection: 'row'}}>{button}{retailPrice}{discount}</View>
        }
        if (this.props.state.discount_on === 'GLOBAL') {
            return <View style={styles.inputTextLayour}>
                <TextInput field='% Off' value={this.props.state.percent}
                           returnKeyType='next' ref="2" refNext="2"
                           keyboardType='numeric'
                           onChangeText={(value) => this.setPercent({value})} isMandatory={true}/>
            </View>
        }
        return result;
    }

    createProductView() {
        if(this.props.state.product) {
            let productName = this.props.state.product.name
            return <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Discount On: {productName}</Text>
            </View>
        }
        return undefined

    }

    render() {
        let promotionOn = this.createSelectProductButton();
        return <View>
            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Percent Discount</Text>
            </View>
            <View style={styles.inputTextLayour}>
                <SimplePicker list={Discouint_on} itemTitle="Promotion On" defaultHeader="Choose Type" isMandatory
                              onValueSelected={this.selectPromotionType.bind(this)}/>
            </View>
            {promotionOn}
            {this.createProductView()}

        </View>
    }
}

