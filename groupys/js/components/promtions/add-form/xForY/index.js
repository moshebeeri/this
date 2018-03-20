import React, {Component} from 'react';
import {Keyboard, Text, View} from 'react-native'
import styles from '../styles'
import {SelectButton, TextInput} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';
import {Thumbnail} from 'native-base';
import ProductPreview from "../../../product/productPreview/index";
import {ThisText} from '../../../../ui/index';

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

    done() {
        Keyboard.dismiss();
    }

    setPay(value) {
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

    render() {
        let pay = '';
        if (this.props.state.x_for_y && this.props.state.x_for_y.values && this.props.state.x_for_y.values.pay) {
            pay = this.props.state.x_for_y.values.pay;
        }
        let eligible = '';
        if (this.props.state.x_for_y && this.props.state.x_for_y.values && this.props.state.x_for_y.values.eligible) {
            eligible = this.props.state.x_for_y.values.eligible;
        }
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.BuyProductsFor}</ThisText>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1.7, marginTop: 25}}><SelectButton ref="xplusySelectProduct"
                                                                       selectedValue={this.props.state.product}
                                                                       isMandatory title={strings.SelectProduct}
                                                                       action={this.showBuyProducts.bind(this, true)}/></View>

                <View style={styles.inputTextLayout}>
                    <TextInput field={strings.BuyAmount} value={eligible}
                               returnKeyType='next' ref="Buy Amount" refNext="Buy Amount"
                               keyboardType='numeric'
                               onSubmitEditing={this.focusNextField.bind(this, "Pay $")}
                               onChangeText={(value) => this.setBuyAmount(value)} isMandatory={true}/>
                </View>
                <View style={styles.inputTextLayout}>
                    <TextInput field={strings.PayAmount} value={pay}
                               returnKeyType='done' ref="Pay $" refNext="Pay $"
                               keyboardType='numeric'
                               onSubmitEditing={this.done.bind(this)}
                               onChangeText={(value) => this.setPay(value)} isMandatory={true}/>
                </View>
            </View>
            <ProductPreview product={this.props.state.product} />
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

