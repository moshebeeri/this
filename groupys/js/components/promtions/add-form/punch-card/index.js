import React, {Component} from 'react';
import {
    Platform,View,Text
} from 'react-native'
import FormUtils from "../../../../utils/fromUtils";

import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';


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


    render() {
        let numberOfPunches = '';
        if(this.props.state.punch_card && this.props.state.punch_card.values && this.props.state.punch_card.values.number_of_punches){
            numberOfPunches = this.props.state.punch_card.values.number_of_punches;
        }
        return <View>

            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Punch Card</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1.7,marginTop:25}}><SelectButton ref="PunchSelectProduct" isMandatory selectedValue={this.props.state.product}title="Select Product" action={this.showBuyProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field='Number of Punches' value={numberOfPunches}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               validateContent={FormUtils.validatePuches()}
                               onChangeText={(value) => this.setPunchCard(value)} isMandatory={true}/>
                </View>

            </View>

        </View>
    }
}

