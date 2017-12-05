import React, {Component} from "react";
import {ScrollView, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Container, Content, Footer, Icon, Input, Item, Picker, Text} from "native-base";
import {bindActionCreators} from "redux";
import * as promotionsAction from "../../../actions/promotions";
import PromotionApi from "../../../api/promotion";
import * as businessAction from "../../../actions/business";
import styles from "./styles";
import {DatePicker, FormHeader, Spinner, TextInput} from '../../../ui/index';

var createEntity = require("../../../utils/createEntity");
let promotionApi = new PromotionApi();
const Distribution = [
    {
        value: '',
        label: 'Choose Distribution'
    },
    {
        value: 'GROUP',
        label: 'Business Groups'
    },
    {
        value: 'PERSONAL',
        label: 'Business Followers'
    }
];

class EditPromotion extends Component {
    constructor(props) {
        super(props);
        let promotion = this.props.navigation.state.params.item
        let quantity = this.getQuantity(promotion);
        this.state = {
            item: promotion,
            quantity: quantity.toString(),
            name: promotion.name,
            end: promotion.end,
            info: promotion.description,
            errorMessage: ''
        }
    }

    componentWillMount() {
        this.props.actions.resetForm();
    }

    static navigationOptions = {
        header: null
    };

    replaceRoute() {
        this.props.navigation.goBack();
    }

    async updateFormData() {
        const {actions, navigation, saving} = this.props;
        if (saving) {
            return;
        }
        let promotion = this.state.item;
        if (this.validateForm()) {
            promotion = this.updateQuantity(promotion)
            promotion.name = this.state.name;
            promotion.end = this.state.end;
            promotion.description = this.state.info;
            actions.updatePromotion(promotion, this.getBusinessId(), navigation, navigation.state.params.item._id);
        }
    }

    validateDate(promotion) {
        let currentDate = new Date(promotion.end);
        let newDate = new Date(this.state.end);
        if (newDate >= currentDate) {
            return true;
        }
        return false;
    }

    validateQuantity(promotion) {
        let currentQuantity = this.getQuantity(promotion);
        if (parseInt(currentQuantity) <= parseInt(this.state.quantity)) {
            return true;
        }
        return false;
    }


    setQuantity(quantity) {
        this.setState({
            quantity: quantity
        })
    }

    getBusinessId() {
        let businessId = undefined;
        if (this.props.navigation.state.params.item) {
            businessId = this.props.navigation.state.params.item.entity.business._id
        } else {
            businessId = this.props.navigation.state.params.business._id;
        }
        return businessId;
    }

    updateQuantity(item) {
        switch (item.type) {
            case 'PERCENT':
                item.percent.quantity = this.state.quantity;
                break;
            case 'PUNCH_CARD':
                item.punch_card.quantity = this.state.quantity;
                break;
            case 'X+Y':
                item.x_plus_y.quantity = this.state.quantity;
                break;
            case 'X+N%OFF':
                item.x_plus_n_percent_off.quantity = this.state.quantity;
                break;
            case 'X_FOR_Y':
                item.x_for_y.quantity = this.state.quantity;
                break;
            case 'REDUCED_AMOUNT':
                item.reduced_amount.quantity = this.state.quantity;
                break;
            case 'HAPPY_HOUR':
                item.happy_hour.quantity = this.state.quantity;
                break;
        }
        return item;
    }

    getQuantity(item) {
        let quantity = 0;
        switch (item.type) {
            case 'PERCENT':
                quantity = item.percent.quantity;
                break;
            case 'PUNCH_CARD':
                quantity = item.punch_card.quantity;
                break;
            case 'X+Y':
                quantity = item.x_plus_y.quantity;
                break;
            case 'X+N%OFF':
                quantity = item.x_plus_n_percent_off.quantity;
                break;
            case 'X_FOR_Y':
                quantity = item.x_for_y.quantity;
                break;
            case 'REDUCED_AMOUNT':
                quantity = item.reduced_amount.quantity;
                break;
            case 'HAPPY_HOUR':
                quantity = item.happy_hour.quantity;
                break;
        }
        return parseInt(quantity);
    }

    focusNextField(nextField) {
        if (this.refs[nextField] && this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField] && this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    render() {
        const {saving} = this.props;
        let promotion = this.state.item;
        let dateValidation = !this.validateDate(promotion);
        let quantatyValidation = !this.validateQuantity(promotion);
        return (

            <View style={styles.product_container}>
                <FormHeader showBack submitForm={this.updateFormData.bind(this)} navigation={this.props.navigation}
                            title={"Update Promotion"} bgc="#FA8559"/>
                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>


                    <View style={styles.inputTextLayout}>
                        <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>You can increase the quantity of
                            promotions Or extend the due
                            date</Text>

                    </View>
                    <View style={styles.inputTextLayout}>
                        <Text style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>General</Text>
                    </View>
                    <View style={styles.inputTextMediumLayout}>
                        <View style={{flex: 1, marginRight: 10}}>
                            <TextInput field='Increase Quantity' value={this.state.quantity}
                                       keyboardType='numeric'
                                       invalid={quantatyValidation}
                                       returnKeyType='next' ref="2" refNext="2"
                                       onSubmitEditing={this.focusNextField.bind(this, "4")}
                                       onChangeText={(quantity) => this.setState({quantity})} isMandatory={true}/>
                        </View>
                        <View style={{flex: 3, marginLeft: 5}}>
                            <DatePicker field='Exparation Date' value={this.state.end}
                                        returnKeyType='next' ref="3" refNext="3"
                                        invalid={dateValidation}
                                        onChangeDate={(date) => {
                                            this.setState({end: date})
                                        }} isMandatory={true}/>
                        </View>
                    </View>

                    <View style={styles.inputTextLayout}>
                        <TextInput field='Name' value={this.state.name}
                                   returnKeyType='next' ref="4" refNext="4"
                                   onSubmitEditing={this.focusNextField.bind(this, "5")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayout}>
                        <TextInput field='Description' value={this.state.info}
                                   returnKeyType='next' ref="5" refNext="5"

                                   onSubmitEditing={this.focusNextField.bind(this, "5")}
                                   onChangeText={(info) => this.setState({info})} isMandatory={true}/>
                    </View>

                </ScrollView>
                {saving && <Spinner height={500}/>}
            </View>
        );
    }

    validateForm() {
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
}

export default connect(
    state => ({
        promotions: state.promotions,
        saving: state.promotions.savingForm,
        products: state.products,
    }),
    (dispatch) => ({
        businessActions: bindActionCreators(businessAction, dispatch),
        actions: bindActionCreators(promotionsAction, dispatch)
    })
)(EditPromotion);