import React, {Component} from 'react';
import {
    Platform,View,Text
} from 'react-native'


import styles from './styles'
import {SelectButton, SimplePicker, TextInput} from '../../../../ui/index';

export default class XPlusYOffComponent extends Component {
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

    setOff(value) {
        if (value) {
            this.props.setState({
                choose_distribution: true,
                x_plus_n_percent_off: {
                    eligible: value,
                }
            })
        }
    }

    createProductView() {
        if(this.props.state.buyProduct) {
            let productName = this.props.state.buyProduct.name
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
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Discount on: {productName}</Text>
            </View>
        }
        return undefined

    }

    createSelectProductButton() {
        let result = undefined;
        let productName = undefined;
        if (this.props.state.giftProduct) {
            productName = <Text> {this.props.state.giftProduct.name}</Text>
        }
        let button = <Item><Button transparent onPress={() => this.showProducts(true)}>
            <Text>Select Product </Text>
        </Button>
            {productName}
        </Item>
        result = <View>{button}</View>
        return result;
    }

    createSelectBuyProductButton() {
        let result = undefined;
        let productName = undefined;
        if (this.props.state.buyProduct) {
            productName = <Text> {this.props.state.buyProduct.name}</Text>
        }
        let button = <Item><Button transparent onPress={() => this.showBuyProducts(true)}>
            <Text>Select Buy Product</Text>
        </Button>
            {productName}
        </Item>
        result = <View>{button}</View>
        return result;
    }

    render() {
        let productGiftView = this.createProductGiftView();
        let productView = this.createProductView()

        let discount = ''
        if(this.props.state.x_plus_n_percent_off && this.props.state.x_plus_n_percent_off.eligible){
            discount = this.props.state.x_plus_n_percent_off.eligible;
        }
        return <View>



            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Buy X Get Y With % Off</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

                <View style={{flex:1.7,marginTop:25}}><SelectButton title="Select Product" action={this.showBuyProducts.bind(this, true)}/></View>

            </View>
            {productView}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1.7,marginTop:25}}><SelectButton title="Select On" action={this.showProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field='% Off' value={discount}
                               returnKeyType='next' ref="2" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setOff(value)} isMandatory={true}/>
                </View>

            </View>
            {productGiftView}

        </View>
    }
}

