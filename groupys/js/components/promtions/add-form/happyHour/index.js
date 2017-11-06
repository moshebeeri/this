import React, {Component} from 'react';
import {
    Platform,View,Text
} from 'react-native'


import styles from './styles'
import {SelectButton, SimplePicker, TextInput,TimePicker,WeekDaysPicker} from '../../../../ui/index';


export default class HappyHourComponent extends Component {
    constructor(props) {
        super(props);
    }

    selectProduct(product) {
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

    setPay(value) {
        if (value) {
            let from = undefined;
            let until = undefined;
            let days = undefined;

            if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
                from = this.props.state.happy_hour.values.from;
                until = this.props.state.happy_hour.values.until;
                days = this.props.state.happy_hour.values.days;

            }
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: value,
                        from: from,
                        until:until,
                        days:days
                    }
                }
            })
        }
    }

    setFrom(value) {
        if (value) {
            let pay = undefined;
            let until = undefined;
            let days = undefined;

            if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
                pay = this.props.state.happy_hour.values.pay;
                until = this.props.state.happy_hour.values.until;
                days = this.props.state.happy_hour.values.days;

            }
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        from: value.value,
                        until:until,
                        days:days
                    }
                }
            })
        }
    }

    setUntil(value) {
        if (value) {
            let pay = undefined;
            let from = undefined;
            let days = undefined;

            if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
                pay = this.props.state.happy_hour.values.pay;
                from = this.props.state.happy_hour.values.from;
                days = this.props.state.happy_hour.values.days;

            }
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        from: from,
                        until:value.value,
                        days:days
                    }
                }
            })
        }
    }
    setDays(value) {
        if (value) {
            let pay = undefined;
            let from = undefined;
            let until = undefined;

            if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
                pay = this.props.state.happy_hour.values.pay;
                from = this.props.state.happy_hour.values.from;
                until = this.props.state.happy_hour.values.until;

            }
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        from: from,
                        until:until,
                        days:value
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
        let from = '';
        let until = '';
        let days = '';

        if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
            pay = this.props.state.happy_hour.values.pay;
            from = this.props.state.happy_hour.values.from;
            until = this.props.state.happy_hour.values.until;
            days = this.props.state.happy_hour.values.days;
        }
        return <View>
            <View style={styles.inputTextLayour}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Happy Hour</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1.7,marginTop:25}}><SelectButton isMandatory ref="precentSelectProduct" selectedValue={this.props.state.product} title="Select Product" action={this.showProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field='Pay $' value={pay}
                               returnKeyType='next' ref="Pay $" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setPay(value)} isMandatory={true}/>
                </View>

            </View>
            {product}

            <View style={{flexDirection:'row',marginTop:5,marginBottom:5,justifyContent:'center',alignItems:'center'}}>

                <View style={styles.inputPrecenComponent}>
                    <TimePicker field='From Hour' value={from}
                                returnKeyType='next' ref="From Hour" refNext="3"
                                onChangeDate={(value) => this.setFrom(value)} isMandatory={true}/>

                </View>
                <View style={styles.inputPrecenComponent}>
                    <TimePicker field='To Hour' value={until}
                                returnKeyType='next' ref="To Hour" refNext="3"
                                onChangeDate={(value) => this.setUntil(value)} isMandatory={true}/>

                </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>


                <View style={styles.inputPrecenComponent}>
                    <WeekDaysPicker field='Days of Week'
                                ref="Days of Week" refNext="Days of Week"
                               onChangeSelected={(value) => this.setDays(value)} isMandatory={true}/>
                </View>


            </View>


        </View>
    }
}

