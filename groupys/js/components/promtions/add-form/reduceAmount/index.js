import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native'
import styles from './styles'
import {TextInput} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';

export default class ReduceAmountComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setState({
                discount_on: 'GLOBAL'
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

    setPay(value) {
        if (value) {
            let price = undefined;
            if (this.props.state.reduced_amount && this.props.state.reduced_amount.values) {
                price = this.props.state.reduced_amount.values.price;
            }
            this.props.setState({
                choose_distribution: true,
                reduced_amount: {
                    values: {
                        pay: value,
                        price: price
                    },
                }
            })
        }
    }

    setBuy(value) {
        if (value) {
            let pay = undefined;
            if (this.props.state.reduced_amount && this.props.state.reduced_amount.values) {
                pay = this.props.state.reduced_amount.values.pay;
            }
            this.props.setState({
                choose_distribution: true,
                reduced_amount: {
                    values: {
                        pay: pay,
                        price: value
                    },
                }
            })
        }
    }

    render() {
        let pay = '';
        if (this.props.state.reduced_amount && this.props.state.reduced_amount.values) {
            pay = this.props.state.reduced_amount.values.pay;
        }
        let price = '';
        if (this.props.state.reduced_amount && this.props.state.reduced_amount.values) {
            price = this.props.state.reduced_amount.values.price;
        }
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.BuyPayOnly}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.Buy} value={price}
                               returnKeyType='next' ref="Buy $" refNext="Buy $"
                               keyboardType='numeric'
                               onSubmitEditing={this.focusNextField.bind(this, "Pay $")}
                               onChangeText={(value) => this.setBuy(value)} isMandatory={true}/>
                </View>
                <View style={styles.inputPrecenComponent}>
                    <TextInput field={strings.Pay} value={pay}
                               returnKeyType='done' ref="Pay $" refNext="Pay $"
                               keyboardType='numeric'
                               onChangeText={(value) => this.setPay(value)} isMandatory={true}/>
                </View>
            </View>


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

