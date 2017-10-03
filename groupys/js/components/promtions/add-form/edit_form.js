import React, {Component} from "react";
import {
    Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    DeviceEventEmitter
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Container, Content, Text, Input, Button, View, Item, Footer} from "native-base";
import {bindActionCreators} from "redux";
import * as businessAction from "../../../actions/business";
import * as promotionsAction from "../../../actions/promotions";
import PromotionApi from "../../../api/promotion";
import DatePicker from "react-native-datepicker";

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

    focusNextField(nextField) {
        this.refs[nextField]._root.focus()
    }

    replaceRoute() {
        this.props.navigation.goBack();
    }

    async updateFormData() {
        let promotion = this.state.item;
        this.setState({
            errorMessage: ''
        })
        if (this.validate(promotion)) {
            try {
                promotion = this.updateQuantity(promotion)
                promotion.name = this.state.name;
                promotion.end = this.state.end;
                promotion.description = this.state.info;
                let response = await promotionApi.updatePromotion(promotion, this.addToList.bind(this), this.props.navigation.state.params.item._id);
                this.replaceRoute();
            } catch (error) {
                console.log(error);
                this.replaceRoute();
            }
        } else {
            this.setState({
                errorMessage: 'Failed validation, quantity must be greater then old, end date must be greater then old '
            })
        }
    }

    addToList(responseData) {
        let businessId = this.getBusinessId();
        this.props.bussinesActions.setBusinessPromotions(businessId);
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

    validate(promotion) {
        if (!this.validateDate(promotion)) {
            return false;
        }
        if (!this.validateQuantity(promotion)) {
            return false;
        }
        return true;
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

    createSubmitButton() {
        let submitButton = <Button transparent
                                   onPress={this.updateFormData.bind(this)}>
            <Text>Update Promotion</Text>
        </Button>
        result = <Footer style={{backgroundColor: '#fff'}}>

            {submitButton}
        </Footer>
        return result;
    }

    render() {
        let image = undefined;
        if (this.state.path) {
            image = <Image
                style={{width: 50, height: 50}}
                source={{uri: this.state.path}}
            />
        }
        let errorMessage = undefined;
        if (this.state.errorMessage) {
            errorMessage = <Text style={{marginLeft: 5, color: 'red'}}>{this.state.errorMessage}</Text>
        }
        let submitButton = this.createSubmitButton();
        return (
            <Container>

                <Content style={{margin: 10, backgroundColor: '#fff'}}>

                    <View style={{margin: 10, borderWidth: 3, borderRadius: 10, backgroundColor: '#fff'}}>

                        <Text style={{marginLeft: 5}}>You can increase the quantity of promotions Or extend the due
                            date</Text>

                        <Item style={{margin: 3}} regular>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")} value={this.state.item.name}
                                   onChangeText={(name) => this.setState({name})}
                                   placeholder='Name'/>
                        </Item>
                        <Item style={{margin: 3}} regular>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="2" value={this.state.info}
                                   onChangeText={(info) => this.setState({info})}
                                   placeholder='Description'/>
                        </Item>
                        <Item style={{margin: 3}} regular>
                            <DatePicker
                                style={{width: 200}}
                                date={this.state.end}
                                mode="date"
                                placeholder="Promotion End Date"
                                format="YYYY-MM-DD"
                                minDate="2016-05-01"
                                maxDate="2020-06-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"

                                onDateChange={(date) => {
                                    this.setState({end: date})
                                }}
                            />
                        </Item>
                        <Item style={{margin: 3}} regular>
                            <Input keyboardType='numeric' value={this.state.quantity}
                                   onChangeText={(value) => this.setQuantity(value)} placeholder='Increase Quantity'/>
                        </Item>
                        {errorMessage}

                    </View>

                </Content>
                {submitButton}
            </Container>
        );
    }
}

export default connect(
    state => ({
        promotions: state.promotions,
        products: state.products,
    }),
    (dispatch) => ({
        bussinesActions: bindActionCreators(businessAction, dispatch),
        actions: bindActionCreators(promotionsAction, dispatch)
    })
)(EditPromotion);