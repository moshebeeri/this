import React, {Component} from 'react';
import {Text, View} from 'react-native'
import styles from './styles'
import {SelectButton, TextInput} from '../../../../ui/index';

export default class XForYComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setState({
                discount_on: 'PRODUCT'
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

    setBuyAmount(value) {
        if (value) {
            let pay = undefined;
            if (this.props.state.x_for_y && this.props.state.x_for_y.values) {
                pay = this.props.state.x_for_y.values.pay;
            }
            this.props.setState({
                choose_distribution: true,
                x_for_y: {
                    values: {
                        pay: pay,
                        eligible: value
                    }
                }
            })
        }
    }

    setPay(value) {
        if (value) {
            let eligible = undefined;
            if (this.props.state.x_for_y && this.props.state.x_for_y.values) {
                eligible = this.props.state.x_for_y.values.eligible;
            }
            this.props.setState({
                choose_distribution: true,
                x_for_y:
                    {
                        values: {
                            pay: value,
                            eligible: eligible,
                        }
                    }
            })
        }
    }

    createProductView() {
        if (this.props.state.product) {
            let productName = this.props.state.product.name
            return <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Promotion on: {productName}</Text>
            </View>
        }
        return undefined
    }

    render() {
        let product = this.createProductView();
        let pay = '';
        if (this.props.state.x_for_y && this.props.state.x_for_y.values && this.props.state.x_for_y.values.pay) {
            pay = this.props.state.x_for_y.values.pay;
        }
        let eligible = '';
        if (this.props.state.x_for_y && this.props.state.x_for_y.values && this.props.state.x_for_y.values.eligible) {
            eligible = this.props.state.x_for_y.values.eligible;
        }
        return <View>
            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Buy X Products For $</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1.7, marginTop: 25}}><SelectButton title="Select Product"
                                                                       action={this.showBuyProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field='Buy Amount' value={eligible}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setBuyAmount(value)} isMandatory={true}/>
                </View>
                <View style={styles.inputPrecenComponent}>
                    <TextInput field='Pay $' value={pay}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setPay(value)} isMandatory={true}/>
                </View>
            </View>
            {product}

        </View>
    }
}

