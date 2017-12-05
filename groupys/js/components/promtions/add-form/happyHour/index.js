import React, {Component} from 'react';
import {
    Platform,View,Text
} from 'react-native'


import styles from './styles'
import {SelectButton, SimplePicker, TextInput,TimePicker,WeekDaysPicker} from '../../../../ui/index';

import FormUtils from "../../../../utils/fromUtils";
import strings from "../../../../i18n/i18n"
export default class HappyHourComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfHours:'',
        }
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
                        from: FormUtils.getSecondSinceMidnight(value),
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
            let until = value * 60 * 60 ;
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        from: from,
                        until:until,
                        days:days
                    }
                },

            })

            this.setState({
                numberOfHours:value
            });
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
            let days = value.map(day => parseInt(day.value));
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        from: from,
                        until:until,
                        days:days
                    }
                }
            })
        }
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


    validateFrom(){
        if(!this.props.state.happy_hour.values.from){
            return false;
        }
        return true;
    }

    render() {
        let product = this.createProductView();
        let pay = '';

        if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
            pay = this.props.state.happy_hour.values.pay;

        }
        return <View>
            <View style={styles.inputTextLayout}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>Happy Hour</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1.7,marginTop:25}}><SelectButton isMandatory ref="precentSelectProduct" selectedValue={this.props.state.product} title={strings.SelectProduct} action={this.showProducts.bind(this, true)}/></View>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.Pay} value={pay}
                               returnKeyType='next' ref="Pay $" refNext="2"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setPay(value)} isMandatory={true}/>
                </View>

            </View>
            {product}

            <View style={{flexDirection:'row',marginTop:5,marginBottom:5,justifyContent:'center',alignItems:'center'}}>

                <View style={styles.inputPrecenComponent}>
                    <TimePicker field={strings.FromHour}
                                validateContent={this.validateFrom.bind(this)}
                                returnKeyType='next' ref="From Hour" refNext="3"
                                onChangeDate={(value) => this.setFrom(value)} isMandatory={true}/>

                </View>
                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.NumberOfHours} value={this.state.numberOfHours}
                               returnKeyType='next' ref="off" refNext="off"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setUntil(value)} isMandatory={true}/>

                </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>


                <View style={styles.inputPrecenComponent}>
                    <WeekDaysPicker field={strings.DaysOfWeek}
                                ref="Days of Week" refNext="Days of Week"
                                    onChangeSelected={(value) => this.setDays(value)} isMandatory={true}/>
                </View>


            </View>


        </View>
    }
}

