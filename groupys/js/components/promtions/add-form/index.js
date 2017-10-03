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
import {Container, Content, Text, Picker, Input, Button, Icon, View, Item, Footer} from "native-base";
import {bindActionCreators} from "redux";
import * as promotionsAction from "../../../actions/promotions";
import ImagePicker from "react-native-image-crop-picker";
import PromotionApi from "../../../api/promotion";
import * as businessAction from "../../../actions/business";
import PercentComponent from "./percent/index";
import PunchCardComponent from "./punch-card/index";
import XPlusYComponent from "./xPlusY/index";
import XPlusYOffComponent from "./xGetYwithPrecentage/index";
import XForYComponent from "./xForY/index";
import ReduceAmountComponent from "./reduceAmount/index";
import HappyHourComponent from "./happyHour/index";
import DatePicker from "react-native-datepicker";
import Icon3 from "react-native-vector-icons/Ionicons";
import styles from "./styles";

let createEntity = require("../../../utils/createEntity");
let promotionApi = new PromotionApi();
const types = [
        {
            value: '',
            label: 'Choose Promotion'
        },
        {
            value: 'HAPPY_HOUR',
            label: 'Happy Hour'
        },
        {
            value: 'PERCENT',
            label: '% Off'
        },
        {
            value: 'REDUCED_AMOUNT',
            label: 'Buy $ Pay $'
        },
        {
            value: 'X+Y',
            label: 'Buy X Get Y'
        },
        {
            value: 'X_FOR_Y',
            label: 'Buy X Pay $'
        },
        {
            value: 'X+N%OFF',
            label: 'Buy X Get Y With % Off'
        },
        {
            value: 'PUNCH_CARD',
            label: 'Punch Card'
        }
    ]
    //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
;
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

class AddPromotion extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        let defaultDate = new Date();
        let month = defaultDate.getMonth();
        if (month < 12) {
            defaultDate.setMonth(month + 1);
        } else {
            let year = defaultDate.getYear();
            defaultDate.setMonth(1);
            defaultDate.setYear(year + 1);
        }
        super(props);
        this.state = {
            token: '',
            path: '',
            image: '',
            type: '',
            images: '',
            businesses: [],
            business: '',
            product: '',
            productList: [],
            percent: {},
            amount: '',
            retail_price: '',
            total_discount: '',
            percent_range: {},
            start: "",
            end: defaultDate,
            location: "",
            info: "",
            discount_on: '',
            distribution: '',
            choose_distribution: false,
            show_save: false,
            showProductsList: false,
            quantity: '',
            promotion: {}
        }
        let businessId = this.getBusinessId();
        this.props.actions.fetchProducts(businessId);
    }

    back() {
        this.props.navigation.goBack();
    }

    async componentWillMount() {
        try {
            if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
                let item = this.props.navigation.state.params.item;
                await  this.setState({
                    type: item.type,
                    start: item.start,
                    choose_distribution: true,
                    end: item.end,
                    location: item.location,
                    name: item.name,
                    info: item.description
                });
                if (item.type == 'PERCENT') {
                    await   this.setState({
                        percent: {
                            percent: item.percent.values[0]
                        }
                    })
                }
                if (!item.product) {
                    await  this.setState({
                        product: item.product,
                        discount_on: 'GLOBAL'
                    })
                } else {
                    await  this.setState({
                        discount_on: 'PRODUCT'
                    })
                }
            }
            if (this.props.navigation.state.params.group) {
                let groups = new Array();
                groups.push(this.props.navigation.state.params.group)
                this.setState({
                    distribution: 'GROUP',
                    groups: groups
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    focusNextField(nextField) {
        this.refs[nextField]._root.focus()
    }

    replaceRoute() {
        this.props.navigation.goBack();
    }

    async saveFormData() {
        let promotion = this.createPromotionFromState();
        try {
            this.replaceRoute();
            promotionApi.createPromotion(promotion, this.addToList.bind(this));
        } catch (error) {
            console.log(error);
            this.replaceRoute();
        }
    }

    async updateFormData() {
        let promotion = this.createPromotionFromState();
        try {
            this.replaceRoute();
            promotionApi.updatePromotion(promotion, this.addToList.bind(this), this.props.navigation.state.params.item._id);
        } catch (error) {
            console.log(error);
            this.replaceRoute();
        }
    }

    addToList(responseData) {
        let businessId = this.getBusinessId();
        this.props.bussinesActions.setBusinessPromotions(businessId);
    }

    getBusinessId() {
        let businessId = undefined;
        if (this.props.navigation.state.params.item) {
            businessId = this.props.navigation.state.params.item.business
        } else {
            businessId = this.props.navigation.state.params.business._id;
        }
        return businessId;
    }

    createPromotionFromState() {
        let promotion = {
            image: this.state.image,
            type: this.state.type,
            total_discount: Number(this.state.total_discount),
            // percent_range: this.state.percent_range,
            start: this.state.start,
            end: this.state.end,
            description: this.state.info,
            path: this.state.path,
            name: this.state.name,
        };
        if (this.props.navigation.state.params.onBoardType) {
            switch (this.props.navigation.state.params.onBoardType) {
                case 'BUSINESS':
                    promotion.on_action = {
                        active: true,
                        type: 'FOLLOW_BUSINESS',
                        entity: {
                            business: this.getBusinessId()
                        }
                    }
                    break;
            }
        }
        let businessId = this.getBusinessId();
        promotion.entity = {};
        promotion.condition = {};
        promotion.distribution = {};
        if (this.state.discount_on == 'GLOBAL') {
            promotion.condition.business = businessId;
            promotion.entity.business = businessId;
        } else {
            promotion.entity.business = businessId;
            promotion.condition.product = this.state.product;
        }
        if (this.state.distribution == 'GROUP') {
            promotion.distribution.groups = this.state.groups;
        } else {
            promotion.distribution.business = businessId;
        }
        if (this.state.type == 'PERCENT') {
            promotion.percent = {};
            promotion.percent.variation = 'SINGLE';
            promotion.percent.values = [this.state.percent.percent]
            promotion.percent.quantity = Number(this.state.quantity)
            if (this.state.percent.retail_price) {
                promotion.retail_price = Number(this.state.percent.retail_price)
            }
        }
        if (this.state.type == 'REDUCED_AMOUNT') {
            promotion.reduced_amount = {};
            promotion.reduced_amount.variation = 'SINGLE';
            promotion.reduced_amount.quantity = Number(this.state.quantity)
            promotion.reduced_amount.values = [{
                price: Number(this.state.reduced_amount.values.price),
                pay: Number(this.state.reduced_amount.values.pay),
            }]
        }
        if (this.state.type == 'X_FOR_Y') {
            promotion.x_for_y = {};
            promotion.x_for_y.variation = 'SINGLE';
            promotion.x_for_y.quantity = Number(this.state.quantity)
            promotion.x_for_y.values = [{
                eligible: Number(this.state.x_for_y.values.eligible),
                pay: Number(this.state.x_for_y.values.pay),
            }]
        }
        if (this.state.type == 'X+N%OFF') {
            promotion.x_plus_n_percent_off = {};
            promotion.x_plus_n_percent_off.variation = 'SINGLE';
            promotion.x_plus_n_percent_off.quantity = Number(this.state.quantity);
            promotion.x_plus_n_percent_off.values = [{
                eligible: Number(this.state.x_plus_n_percent_off.eligible),
                product: this.state.giftProduct,
            }];
        }
        if (this.state.type == 'X+Y') {
            promotion.x_plus_y = {};
            promotion.x_plus_y.variation = 'SINGLE';
            promotion.x_plus_y.quantity = Number(this.state.quantity);
            promotion.x_plus_y.values = [{
                eligible: Number(this.state.x_plus_y.values.eligible),
                buy: Number(this.state.x_plus_y.values.buy),
                product: this.state.giftProduct,
            }];
        }
        if (this.state.type == 'PUNCH_CARD') {
            promotion.punch_card = {};
            promotion.punch_card.variation = 'SINGLE';
            promotion.punch_card.quantity = Number(this.state.quantity);
            promotion.punch_card.values = {
                number_of_punches: Number(this.state.punch_card.values.number_of_punches),
            };
        }
        return promotion;
    }

    async selectPromotionType(value) {
        this.setState({
            type: value,
            choose_distribution: false,
            showProductsList: false,
            discount_on: '',
            distribution: '',
            show_save: false,
        })
        if (this.props.navigation.state.params.group) {
            this.setState({
                distribution: 'GROUP',
                show_save: true,
            })
        } else {
            this.setState({
                distribution: '',
            })
        }
    }

    async selectDiscountType(value) {
        this.setState({
            discount_on: value
        })
    }

    async pickFromCamera() {
        try {
            let image = await ImagePicker.openCamera({
                width: 2000,
                height: 2000,
                cropping: true,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        } catch (e) {
            console.log(e);
        }
    }

    setQuantity(quantity) {
        this.setState({
            quantity: quantity
        })
    }

    async pickPicture() {
        try {
            let image = await ImagePicker.openPicker({
                width: 2000,
                height: 2000,
                cropping: true,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        } catch (e) {
            console.log(e);
        }
    }

    showProducts(boolean) {
        if (!this.props.products) {
            return;
        }
        let products = this.getProducts();
        if (!products) {
            return;
        }
        if (products.length == 0) {
            return;
        }
        this.setState({
            showProductsList: boolean
        })
    }

    getProducts() {
        let products = undefined;
        let businessId = this.getBusinessId();
        if (this.props.products) {
            products = this.props.products['products' + businessId];
        }
        return products;
    }

    selectProduct(product) {
        this.setState({
            product: product,
            showProductsList: false,
        })
    }

    createDiscountConditionForm() {
        let result = undefined;
        let discountForm = undefined;
        if (this.state.type) {
            switch (this.state.type) {
                case 'PERCENT':
                    discountForm = <PercentComponent navigation={this.props.navigation} api={this} state={this.state}
                                                     setState={this.setState.bind(this)}/>
                    break;
                case 'PUNCH_CARD':
                    discountForm = <PunchCardComponent navigation={this.props.navigation} api={this} state={this.state}
                                                       setState={this.setState.bind(this)}/>
                    break;
                case 'X+Y':
                    discountForm = <XPlusYComponent navigation={this.props.navigation} api={this} state={this.state}
                                                    setState={this.setState.bind(this)}/>
                    break;
                case 'X+N%OFF':
                    discountForm = <XPlusYOffComponent navigation={this.props.navigation} api={this} state={this.state}
                                                       setState={this.setState.bind(this)}/>
                    break;
                case 'X_FOR_Y':
                    discountForm = <XForYComponent navigation={this.props.navigation} api={this} state={this.state}
                                                   setState={this.setState.bind(this)}/>
                    break;
                case 'REDUCED_AMOUNT':
                    discountForm =
                        <ReduceAmountComponent navigation={this.props.navigation} api={this} state={this.state}
                                               setState={this.setState.bind(this)}/>
                    break;
                case 'HAPPY_HOUR':
                    discountForm = <HappyHourComponent navigation={this.props.navigation} api={this} state={this.state}
                                                       setState={this.setState.bind(this)}/>
                    break;
            }
        }
        if (discountForm) {
            result = <View style={{margin: 10, borderWidth: 3, borderRadius: 10, backgroundColor: '#fff'}}>
                {discountForm}
            </View>
        }
        return result;
    }

    selectDistributionType(type) {
        if (type == 'PERSONAL') {
            this.setState({
                distribution: type,
                show_save: true,
            })
        } else {
            this.setState({
                distribution: type,
                show_save: false,
            })
        }
    }

    selectGroup(group) {
        if (group && group.length > 0) {
            this.setState({
                groups: group,
                show_save: true,
            })
        }
    }

    showGroups() {
        let bid = this.getBusinessId();
        let groupFunction = this.selectGroup.bind(this);
        this.props.navigation.navigate("SelectGroupsComponent", {
            bid: bid, selectGroup: groupFunction
        })
    }

    createDistributionForm() {
        let result = undefined;
        if (this.state.choose_distribution) {
            let distribution = <Picker
                iosHeader="Discount"
                mode="dropdown"
                selectedValue={this.state.distribution}
                onValueChange={this.selectDistributionType.bind(this)}
            >

                {
                    Distribution.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.value}
                            label={s.label}/>
                    })}
            </Picker>
            let button = undefined;
            if (this.state.distribution == 'GROUP') {
                let selectedGroup = undefined;
                if (this.state.groups) {
                    selectedGroup = <Text>{this.state.groups.length} are selected</Text>
                }
                button = <Item><Button transparent onPress={() => this.showGroups()}>
                    <Text>Select Groups </Text>
                </Button>
                    {selectedGroup}
                </Item>
            }
            result = <View style={{margin: 10, borderWidth: 3, borderRadius: 10, backgroundColor: '#fff'}}>
                {distribution}
                {button}

            </View>
        }
        return result
    }

    createSubmitButton() {
        let result = undefined;
        if (this.state.show_save) {
            let submitButton = <Button transparent
                                       onPress={this.saveFormData.bind(this)}>
                <Text>Add Promotion</Text>
            </Button>
            result = <Footer style={{backgroundColor: '#fff'}}>

                {submitButton}
            </Footer>
        }
        return result;
    }

    render() {
        let typePikkerTag = <Picker
            iosHeader="Discount"
            mode="dropdown"
            selectedValue={this.state.type}
            onValueChange={this.selectPromotionType.bind(this)}
        >

            {
                types.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                })}
        </Picker>
        let image = undefined;
        if (this.state.path) {
            image = <Image
                style={{width: 50, height: 50}}
                source={{uri: this.state.path}}
            />
        }
        let conditionForm = this.createDiscountConditionForm();
        let distributionForm = this.createDistributionForm();
        if (this.props.navigation.state.params.group) {
            distributionForm = undefined;
        }
        let back = <Button transparent style={{}} onPress={() => this.back()}>
            <Icon3 active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

        </Button>
        let header = "Add Promotion";
        if (this.props.navigation.state.params.onBoardType) {
            switch (this.props.navigation.state.params.onBoardType) {
                case 'BUSINESS':
                    header = "Add On Boarding Promotion"
                    break;
            }
        }
        let submitButton = this.createSubmitButton();
        return (
            <Container>

                <Content style={{backgroundColor: '#fff'}}>
                    <View style={styles.follow_search} regular>
                        {back}
                        <Text style={{fontSize: 20, color: "#2db6c8"}}>{header}</Text>
                        <View></View>
                    </View>
                    <View style={{margin: 10, borderWidth: 3, borderRadius: 10, backgroundColor: '#fff'}}>

                        {typePikkerTag}


                        <Item style={{margin: 3}} regular>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   value={this.state.promotion.name} onChangeText={(name) => this.setState({name})}
                                   placeholder='Name'/>
                        </Item>
                        <Item style={{margin: 3}} regular>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="2" value={this.state.promotion.info}
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
                            <Input keyboardType='numeric' onChangeText={(value) => this.setQuantity(value)}
                                   placeholder='Quantity'/>
                        </Item>

                        <Item style={{margin: 3}} regular>

                            <Button iconRight transparent onPress={() => this.pickPicture()}>
                                <Text style={{fontStyle: 'normal', fontSize: 10}}>Pick </Text>
                                <Icon name='camera'/>
                            </Button>


                            <Button iconRight transparent onPress={() => this.pickFromCamera()}>
                                <Text style={{fontStyle: 'normal', fontSize: 10}}>take </Text>
                                <Icon name='camera'/>
                            </Button>

                            {image}
                        </Item>
                    </View>
                    {conditionForm}
                    {distributionForm}

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
)(AddPromotion);