import React, {Component} from 'react';
import {Keyboard, View} from 'react-native'
import FormUtils from "../../../../utils/fromUtils";
import {SelectButton, TextInput, ThisText} from '../../../../ui/index';
import styles from '../styles'
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';
import ProductPreview from "../../../product/productPreview/index";
import navigationUtils from '../../../../utils/navigationUtils'

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
        this.props.setState({
            choose_distribution: true,
            punch_card: {
                values: {number_of_punches: value},
            }
        })
    }

    showBuyProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        navigationUtils.doNavigation(this.props.navigation,"SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId});
    }

    done() {
        Keyboard.dismiss();
    }

    render() {
        let numberOfPunches = '';
        if (this.props.state.punch_card && this.props.state.punch_card.values && this.props.state.punch_card.values.number_of_punches) {
            numberOfPunches = this.props.state.punch_card.values.number_of_punches;
        }
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>

                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.PunchCard}</ThisText>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                paddingRight: 5,
                paddingLeft: 5,
                width: StyleUtils.getWidth() - 15
            }}>
                <View style={{marginTop: 25}}><SelectButton ref="PunchSelectProduct" isMandatory
                                                            selectedValue={this.props.state.product}
                                                            title={strings.SelectProduct}
                                                            action={this.showBuyProducts.bind(this, true)}/>
                </View>

                <View style={{width: 200}}>
                    <TextInput field={strings.NumberOfPunches} value={numberOfPunches}
                               returnKeyType='done' ref="2" refNext="2"
                               keyboardType='numeric'
                               onSubmitEditing={this.done.bind(this)}
                               validateContent={FormUtils.validatePuches}
                               onChangeText={(value) => this.setPunchCard(value)} isMandatory={true}/>
                </View>


            </View>
            <ProductPreview product={this.props.state.product}/>

        </View>
    }
}

