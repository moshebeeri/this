import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native'
import FormUtils from "../../../../utils/fromUtils";
import styles from './styles'
import {SelectButton, TextInput} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';

export default class PunchCardComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setState({
            discount_on: 'PRODUCT'
        })
    }

    selectBuyProduct(product) {
        this.props.setState(
            {
                product: product
            }
        )
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

    setPunchCard(value) {
        if (value) {
            this.props.setState({
                choose_distribution: true,
                punch_card: {
                    values: {number_of_punches: value},
                }
            })
        }
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

    createProductView() {
        if (this.props.state.product) {
            let productName = this.props.state.product.name
            return <View style={styles.inputTextLayout}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Promotion on: {productName}</Text>
            </View>
        }
        return undefined
    }

    render() {
        let numberOfPunches = '';
        if (this.props.state.punch_card && this.props.state.punch_card.values && this.props.state.punch_card.values.number_of_punches) {
            numberOfPunches = this.props.state.punch_card.values.number_of_punches;
        }
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>

                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.PunchCard}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1.7, marginTop: 25}}><SelectButton ref="PunchSelectProduct" isMandatory
                                                                       selectedValue={this.props.state.product}
                                                                       title={strings.SelectProduct}
                                                                       action={this.showBuyProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.NumberOfPunches} value={numberOfPunches}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               validateContent={FormUtils.validatePuches}
                               onChangeText={(value) => this.setPunchCard(value)} isMandatory={true}/>
                </View>


            </View>
            {this.createProductView()}

        </View>
    }
}

