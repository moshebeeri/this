import React, {Component} from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    TouchableOpacity,
    View
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Container, Content, Footer, Icon, Input, Item, Picker} from "native-base";
import {bindActionCreators} from "redux";
import * as promotionsAction from "../../../actions/promotions";
import PromotionApi from "../../../api/promotion";
import * as businessAction from "../../../actions/business";
import PercentComponent from "./percent/index";
import PunchCardComponent from "./punch-card/index";
import XPlusYComponent from "./xPlusY/index";
import GiftComponent from "./gift/index";
import XPlusYOffComponent from "./xGetYwithPrecentage/index";
import XForYComponent from "./xForY/index";
import ReduceAmountComponent from "./reduceAmount/index";
import HappyHourComponent from "./happyHour/index";
import styles from "./styles";
import {
    DatePicker,
    FormHeader,
    ImagePicker,
    SelectButton,
    SimplePicker,
    Spinner,
    TextInput,
    ThisText
} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import StyleUtils from '../../../utils/styleUtils'
import navigationUtils from '../../../utils/navigationUtils'

const {width, height} = Dimensions.get('window');
let promotionApi = new PromotionApi();
const types = [
        {
            value: 'PUNCH_CARD',
            label: strings.PunchCard
        },
        {
            value: 'HAPPY_HOUR',
            label: strings.HappyHour
        },
        {
            value: 'PERCENT',
            label: strings.PercentageOff
        },
        {
            value: 'X+Y',
            label: strings.XPlusY
        },
        // {
        //     value: 'GIFT',
        //     label: strings.Gift
        // },
        {
            value: 'REDUCED_AMOUNT',
            label: strings.ReduceAmount
        },
        {
            value: 'X_FOR_Y',
            label: strings.XForY
        },
        {
            value: 'X+N%OFF',
            label: strings.XPlusYOff
        },
    ]
    //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
;
const promotion_type = [
        {
            value: 'GENERAL',
            label: strings.GeneralPromotion,
        },
        {
            value: 'BUSINESS',
            label: strings.OnBoardingPromotion
        },
        {
            value: 'PROXIMITY',
            label: strings.OnProximityPromotion
        },
        {
            value: 'FOLLOWER_PROXIMITY',
            label: strings.OnFollowerProximity
        },
    ]
    //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
;
const types_simple = [
        {
            value: 'PERCENT',
            label: strings.PercentageOff
        },
        {
            value: 'REDUCED_AMOUNT',
            label: strings.ReduceAmount
        },
    ]
    //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
;
const Distribution = [
    {
        value: 'GROUP',
        label: strings.BusinessGroups
    },
    {
        value: 'PERSONAL',
        label: strings.BusinessFollowers
    }
];
const Proximity = [
    {
        value: 0.5,
        label: strings.proximityDistance.formatUnicorn(0.5)
    },
    {
        value: 1,
        label: strings.proximityDistance.formatUnicorn(1)
    },
    {
        value: 1.5,
        label: strings.proximityDistance.formatUnicorn(1.5)
    },
    {
        value: 2,
        label: strings.proximityDistance.formatUnicorn(2)
    },
    {
        value: 3,
        label: strings.proximityDistance.formatUnicorn(3)
    },
    {
        value: 4,
        label: strings.proximityDistance.formatUnicorn(4)
    },
    {
        value: 5,
        label: strings.proximityDistance.formatUnicorn(5)
    }
];

class AddPromotion extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        let defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        super(props);
        this.state = {
            token: '',
            path: '',
            image: '',
            type: 'PERCENT',
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
            discount_on: 'PRODUCT',
            distribution: 'PERSONAL',
            choose_distribution: false,
            show_save: false,
            showProductsList: false,
            quantity: 100,
            otherBusinessPermittedUser: '',
            otherBusiness: '',
            promotion: {},
            toggle: false,
        }
        let businessId = this.getBusinessId();
        this.props.actions.fetchProducts(businessId);
    }

    back() {
        this.props.navigation.goBack();
    }

    openMenu() {
        this.refs["coverImage"].openMenu();
    }

    async componentWillMount() {
        if (this.props.navigation.state.params.onBoardType) {
            this.setState({toggle: true, onBoardType: this.props.navigation.state.params.onBoardType});
            return;
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.onBoardingPromotion) {
            this.setPromotion(this.props.navigation.state.params.onBoardingPromotion);
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.proximityPromotion) {
            this.setPromotion(this.props.navigation.state.params.proximityPromotion);
            return;
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.followerProximity) {
            this.setPromotion(this.props.navigation.state.params.followerProximity);
            return;
        }
        this.props.actions.resetForm();
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
                if (item.type === 'PERCENT') {
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
                groups.push(this.props.navigation.state.params.group);
                this.setState({
                    distribution: 'GROUP',
                    groups: groups
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    replaceRoute() {
        this.props.navigation.goBack();
    }

    async saveFormData() {
        const {actions, navigation, saving} = this.props;
        Keyboard.dismiss();
        if (saving) {
            return;
        }
        if (this.validateForm()) {
            let promotion = this.createPromotionFromState();
            let businessId = this.getBusinessId();
            let simpleProductPercent = !this.state.toggle && this.state.discount_on === 'PRODUCT' && this.state.type === 'PERCENT'
            actions.savePromotion(promotion, businessId, navigation, simpleProductPercent)
        }
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

    setPromotion(promotion) {
        let image = promotion.image;
        if (!image && promotion.pictures && promotion.pictures.length > 0) {
            image = promotion.pictures[0].pictures[0]
        }
        this.setState({
            image: image,
            type: promotion.type,
            // percent_range: this.state.percent_range,
            start: promotion.start,
            end: promotion.end,
            description: promotion.info,
            name: promotion.name,
        })
        //TODO add all parameters
    }

    createPromotionFromState() {
        let promotion = {
            image: this.state.image,
            type: this.state.type,
            total_discount: Number(this.state.total_discount),
            // percent_range: this.state.percent_range,
            start: new Date().getTime(),
            end: this.state.end,
            description: this.state.info,
            name: this.state.name,
            client: {uploading: true}
        };
        if (this.state.onBoardType) {
            switch (this.state.onBoardType) {
                case 'BUSINESS':
                    promotion.on_action = {
                        active: true,
                        type: 'FOLLOW_ENTITY',
                        entity: {
                            business: this.getBusinessId()
                        }
                    };
                    break;
                case 'PROXIMITY':
                    promotion.on_action = {
                        active: true,
                        type: 'PROXIMITY',
                        proximity: this.state.proximity,
                        entity: {
                            business: this.getBusinessId()
                        }
                    };
                    break;
                case 'FOLLOWER_PROXIMITY':
                    promotion.on_action = {
                        active: true,
                        type: 'FOLLOWER_PROXIMITY',
                        proximity: this.state.proximity,
                        entity: {
                            business: this.getBusinessId()
                        }
                    };
                    break;
            }
        }
        let businessId = this.getBusinessId();
        promotion.entity = {};
        promotion.condition = {};
        promotion.distribution = {};
        if (this.state.discount_on === 'GLOBAL') {
            promotion.condition.business = businessId;
            promotion.entity.business = businessId;
        } else {
            promotion.entity.business = businessId;
            promotion.condition.product = this.state.product;
        }
        if (this.state.distribution === 'GROUP') {
            promotion.distribution.groups = this.state.groups;
        } else {
            promotion.distribution.business = businessId;
        }
        if (this.state.type === 'PERCENT') {
            promotion.percent = {};
            promotion.percent.variation = 'SINGLE';
            promotion.percent.values = [this.state.percent.percent];
            promotion.percent.quantity = Number(this.state.quantity);
            if (this.state.percent.retail_price) {
                promotion.retail_price = Number(this.state.percent.retail_price)
            }
        }
        if (this.state.type === 'REDUCED_AMOUNT') {
            promotion.reduced_amount = {};
            promotion.reduced_amount.variation = 'SINGLE';
            promotion.reduced_amount.quantity = Number(this.state.quantity);
            promotion.reduced_amount.values = [{
                price: Number(this.state.reduced_amount.values.price),
                pay: Number(this.state.reduced_amount.values.pay),
            }]
        }
        if (this.state.type === 'X_FOR_Y') {
            promotion.x_for_y = {};
            promotion.x_for_y.variation = 'SINGLE';
            promotion.x_for_y.quantity = Number(this.state.quantity);
            promotion.x_for_y.values = [{
                eligible: Number(this.state.x_for_y.values.eligible),
                pay: Number(this.state.x_for_y.values.pay),
            }]
        }
        if (this.state.type === 'X+N%OFF') {
            promotion.x_plus_n_percent_off = {};
            promotion.x_plus_n_percent_off.variation = 'SINGLE';
            promotion.x_plus_n_percent_off.quantity = Number(this.state.quantity);
            promotion.x_plus_n_percent_off.values = [{
                eligible: Number(this.state.x_plus_n_percent_off.eligible),
                product: this.state.giftProduct,
            }];
        }
        if (this.state.type === 'X+Y') {
            promotion.x_plus_y = {};
            promotion.x_plus_y.variation = 'SINGLE';
            promotion.x_plus_y.quantity = Number(this.state.quantity);
            promotion.x_plus_y.values = [{
                eligible: Number(this.state.x_plus_y.values.eligible),
                buy: Number(this.state.x_plus_y.values.buy),
                product: this.state.giftProduct,
            }];
        }
        if (this.state.type === 'PUNCH_CARD') {
            promotion.punch_card = {};
            promotion.punch_card.variation = 'SINGLE';
            promotion.punch_card.quantity = Number(this.state.quantity);
            promotion.punch_card.values = {
                number_of_punches: Number(this.state.punch_card.values.number_of_punches),
            };
        }
        if (this.state.type === 'HAPPY_HOUR') {
            promotion.happy_hour = {};
            promotion.happy_hour.variation = 'SINGLE';
            promotion.happy_hour.quantity = Number(this.state.quantity);
            promotion.happy_hour.values = {
                pay: Number(this.state.happy_hour.values.pay),
                until: this.state.happy_hour.values.from + this.state.happy_hour.values.until,
                days: this.state.happy_hour.values.days,
                from: this.state.happy_hour.values.from,
            };
        }
        return promotion;
    }

    async selectDiscount(value) {
        this.setState({
            type: value,
            choose_distribution: false,
            showProductsList: false,
            discount_on: '',
            distribution: '',
            show_save: false,
        });
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

    setQuantity(quantity) {
        this.setState({
            quantity: quantity
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
        const {currencySymbol} = this.props;
        let result = undefined;
        let discountForm = undefined;
        if (this.state.type) {
            switch (this.state.type) {
                case 'PERCENT':
                    discountForm =
                        <PercentComponent currencySymbol={currencySymbol} toggle={this.state.toggle}
                                          navigation={this.props.navigation} api={this}
                                          state={this.state}
                                          ref={"precent"} setState={this.setState.bind(this)}/>;
                    break;
                case 'PUNCH_CARD':
                    discountForm = <PunchCardComponent navigation={this.props.navigation} api={this} state={this.state}
                                                       ref={"PUNCH_CARD"} setState={this.setState.bind(this)}/>;
                    break;
                case 'X+Y':
                    discountForm =
                        <XPlusYComponent currencySymbol={currencySymbol} ref={"X+Y"} navigation={this.props.navigation}
                                         api={this} state={this.state}
                                         setState={this.setState.bind(this)}/>;
                    break;
                case 'GIFT':
                    discountForm =
                        <GiftComponent currencySymbol={currencySymbol} ref={"GIFT"} navigation={this.props.navigation}
                                       api={this} state={this.state}
                                       setState={this.setState.bind(this)}/>;
                    break;
                case 'X+N%OFF':
                    discountForm = <XPlusYOffComponent currencySymbol={currencySymbol} ref={"X+N%OFF"}
                                                       navigation={this.props.navigation} api={this}
                                                       state={this.state}
                                                       setState={this.setState.bind(this)}/>;
                    break;
                case 'X_FOR_Y':
                    discountForm =
                        <XForYComponent currencySymbol={currencySymbol} ref={"X_FOR_Y"}
                                        navigation={this.props.navigation} api={this} state={this.state}
                                        setState={this.setState.bind(this)}/>;
                    break;
                case 'REDUCED_AMOUNT':
                    discountForm =
                        <ReduceAmountComponent ref={"REDUCED_AMOUNT"} navigation={this.props.navigation} api={this}
                                               state={this.state}
                                               currencySymbol={currencySymbol}
                                               setState={this.setState.bind(this)}/>;
                    break;
                case 'HAPPY_HOUR':
                    discountForm = <HappyHourComponent ref={"HAPPY_HOUR"} navigation={this.props.navigation} api={this}
                                                       state={this.state}
                                                       setState={this.setState.bind(this)}/>;
                    break;
            }
        }
        if (discountForm) {
            result = discountForm
        }
        return result;
    }

    dismiss() {
        Keyboard.dismiss();
    }

    selectDistributionType(type) {
        if (type === 'PERSONAL') {
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

    selectProximity(proximity) {
        this.setState({proximity: proximity});
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
        navigationUtils.doNavigation(this.props.navigation, "SelectGroupsComponent", {
            bid: bid, selectGroup: groupFunction
        })
    }

    createDistributionForm() {
        let distribution = <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
            <SimplePicker ref="TypePicker" list={Distribution} itemTitle={strings.DistributionType}
                          defaultHeader={strings.ChooseDistribution}
                          isMandatory onValueSelected={this.selectDistributionType.bind(this)}/>
        </View>;
        let button = undefined;
        let selectedGroup = undefined;
        if (this.state.distribution === 'GROUP') {
            if (this.state.groups) {
                selectedGroup =
                    <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>
                        {strings.SelectedGroups}: {this.state.groups.length} </ThisText>
            }
            button = <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SelectButton title={strings.SelectGroups} action={this.showGroups.bind(this)}/>

            </View>
        }
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.Distribution}</ThisText>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>

                <View style={{flex: 2}}>
                    {distribution}
                </View>

            </View>
            {button &&
            <View style={{marginTop: 30,}}>
                {button}
            </View>
            }
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                {selectedGroup}
            </View>

        </View>
    }

    createProximityForm() {
        let proximity = <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
            <SimplePicker ref="TypePicker" list={Proximity} itemTitle={strings.Proximity}
                          defaultHeader={strings.chooseProximityDistance}
                          isMandatory onValueSelected={this.selectProximity.bind(this)}/>
        </View>;
        return <View>
            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <ThisText style={{
                    color: '#FA8559',
                    marginLeft: 8,
                    marginRight: 8
                }}>{strings.ProximityDistanceTitle}</ThisText>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>

                <View style={{flex: 2}}>
                    {proximity}
                </View>

            </View>


        </View>
    }

    toogleSwitch(value) {
        if (this.state.toggle) {
            this.setToggleOff()
        } else {
            this.setToggleOn();
        }
    }

    getDefaultDate(toggle) {
        let defaultDate = new Date();
        let month = defaultDate.getMonth();
        if (month < 12) {
            defaultDate.setMonth(month + 1);
        } else {
            let year = defaultDate.getYear();
            defaultDate.setMonth(1);
            defaultDate.setYear(year + 1);
        }
        return defaultDate;
    }

    setToggleOff() {
        let defaultDate = this.getDefaultDate(false);
        this.refs["discountType"].selectPromotionType("PERCENT");
        this.setState({
            token: '',
            path: '',
            type: 'PERCENT',
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
            discount_on: 'PRODUCT',
            distribution: 'PERSONAL',
            choose_distribution: false,
            show_save: false,
            showProductsList: false,
            quantity: 100,
            otherBusinessPermittedUser: '',
            otherBusiness: '',
            promotion: {},
            toggle: !this.state.toggle
        });
    }

    setToggleOn() {
        let defaultDate = this.getDefaultDate(true);
        this.refs["discountType"].selectPromotionType('');
        this.setState({
            token: '',
            path: '',
            type: '',
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
            otherBusinessPermittedUser: '',
            otherBusiness: '',
            promotion: {},
            toggle: !this.state.toggle
        });
    }

    selectPromotionType(type) {
        this.setState({
            onBoardType: type,
        })
    }

    render() {
        const {saving, savingFailed} = this.props;
        let proximityForm = undefined;
        let header = '';
        if (this.state.onBoardType) {
            switch (this.state.onBoardType) {
                case 'BUSINESS':
                    header = strings.AddOnBoardingPromotion;
                    break;
                case 'PROXIMITY':
                    header = strings.OnProximityPromotion;
                    proximityForm = this.createProximityForm();
                    break;
                case 'FOLLOWER_PROXIMITY':
                    header = strings.OnFollowerProximity;
                    proximityForm = this.createProximityForm();
                    break;
            }
        }
        let conditionForm = this.createDiscountConditionForm();
        let distributionForm = this.createDistributionForm();
        if (this.props.navigation.state.params.group || proximityForm) {
            distributionForm = undefined;
        }
        if (Platform.OS === 'ios') {
            return (<KeyboardAvoidingView behavior={'padding'}
                                          style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
                {this.createView(header, conditionForm, proximityForm, distributionForm, saving, savingFailed)}
            </KeyboardAvoidingView>)
        }
        return (<View style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
            {this.createView(header, conditionForm, proximityForm, distributionForm, saving, savingFailed)}
        </View>)
            ;
    }

    createView(header, conditionForm, proximityForm, distributionForm, saving, savingFailed) {
        return <View>
            <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                        title={strings.AddPromotion} bgc="#FA8559"/>

            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor: '#FA8559',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row', width: StyleUtils.getWidth()
                }}>
                    {this.state.toggle ? <ThisText style={{
                            color: 'white',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{strings.AdvancedPromotion}</ThisText> :
                        <ThisText style={{
                            color: 'white',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{strings.SimplePromotion}</ThisText>
                    }

                    <Switch

                        onTintColor={'#2db6c8'}
                        style={{marginRight: 10,}}
                        onValueChange={this.toogleSwitch.bind(this)}
                        value={this.state.toggle}/>
                </View>


                {this.createCoverImageComponnent()}
                <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.Details}</ThisText>
                </View>
                {!this.state.toggle && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.PromotionName} value={this.state.name}
                               returnKeyType='done' ref="4" refNext="4"

                               onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                </View>}
                {this.state.toggle && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    {header ?
                        <SimplePicker ref="promotionType" list={promotion_type} itemTitle={strings.PromotionType}
                                      selectedValue={this.props.navigation.state.params.onBoardType}
                                      value={header}
                                      defaultHeader={strings.ChooseType} isMandatory
                                      onValueSelected={this.selectPromotionType.bind(this)}/> :
                        <SimplePicker ref="promotionType" list={promotion_type} itemTitle={strings.PromotionType}
                                      defaultHeader={strings.ChooseType} isMandatory
                                      onValueSelected={this.selectPromotionType.bind(this)}/>
                    }

                </View>}
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    {this.state.toggle ?
                        <SimplePicker ref="discountType" list={types} itemTitle={strings.DiscountType}
                                      defaultHeader={strings.ChooseType} isMandatory
                                      onValueSelected={this.selectDiscount.bind(this)}/> :
                        <SimplePicker ref="discountType" list={types_simple} itemTitle={strings.DiscountType}
                                      selectedValue="PERCENT"
                                      value={strings.PercentageOff}
                                      defaultHeader={strings.ChooseType} isMandatory
                                      onValueSelected={this.selectDiscount.bind(this)}/>}
                </View>
                {this.state.toggle && <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.General}</ThisText>
                </View>}
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    {this.state.toggle && <View style={{flex: 1}}>
                        <TextInput field={strings.Quantity} value={this.state.quantity}
                                   keyboardType='numeric'
                                   returnKeyType='next' ref="2" refNext="2"
                                   onSubmitEditing={this.focusNextField.bind(this, "4")}
                                   onChangeText={(quantity) => this.setState({quantity})} isMandatory={true}/>
                    </View>}
                    <View style={{flex: 3,}}>
                        <DatePicker field={strings.ExpirationDate} value={this.state.end}
                                    returnKeyType='next' ref="3" refNext="3"
                                    onChangeDate={(date) => {
                                        this.setState({end: date})
                                    }} isMandatory={true}/>
                    </View>
                </View>
                {this.state.toggle && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.PromotionName} value={this.state.name}
                               returnKeyType='next' ref="4" refNext="4"
                               onSubmitEditing={this.focusNextField.bind(this, "5")}
                               onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                </View>}
                {this.state.toggle && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.PromotioDescription} value={this.state.info}
                               returnKeyType='next' ref="5" refNext="5"
                               onSubmitEditing={this.dismiss.bind(this)}
                               onChangeText={(info) => this.setState({info})}/>
                </View>}

                <View style={[styles.conditionForm, {width: StyleUtils.getWidth()}]}>
                    {conditionForm}
                </View>
                {proximityForm}
                {this.state.toggle && distributionForm}
                <View style={{height: StyleUtils.scale(30), width: StyleUtils.getWidth()}}></View>

            </ScrollView>

            {saving && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: StyleUtils.getWidth(),
                opacity: 0.7,
                height: height,
                top: 40,
                backgroundColor: 'white'
            }}>
                <Spinner/>
            </View>}
            {savingFailed && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: StyleUtils.getWidth(),
                opacity: 0.9,
                height: height,
                top: 40,
                backgroundColor: 'white'
            }}>
                <ThisText style={{
                    margin: 10,
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 20
                }}>{strings.PromotionFailedSavingMessage}</ThisText>
            </View>}

        </View>;
    }

    setCoverImage(image) {
        this.setState({
            image: image
        })
    }

    focusNextField(nextField) {
        if (this.refs[nextField] && this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField] && this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    createCoverImageComponnent() {
        if (this.state.image) {
            let coverImage = <Image
                style={{
                    width: StyleUtils.getWidth(),
                    height: StyleUtils.getWidth() * 9 / 16
                }}
                resizeMode={'cover'}
                source={{uri: this.state.image.path}}
            >

            </Image>
            return <View style={[styles.product_upper_container, {width: StyleUtils.getWidth()}]}>


                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>

                    </View>
                </View>
            </View>
        }
        return <TouchableOpacity onPress={this.openMenu.bind(this)}
                                 style={[styles.product_upper_container, {width: StyleUtils.getWidth()}]}>

            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} mandatory color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    {this.state.toggle ? <ThisText style={styles.addCoverText}>{strings.AddACoverPhoto}</ThisText> :
                        <ThisText style={styles.addCoverText}>{strings.TakeProductPicture}</ThisText>
                    }
                </View>
            </View>

        </TouchableOpacity>
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

    shouldComponentUpdate() {
        return this.props.currentScreen === 'addPromotions' ||
            this.props.currentScreen === 'SelectGroupsComponent' ||
            this.props.currentScreen === 'SelectProductsComponent';
    }
}

export default connect(
    state => ({
        promotions: state.promotions,
        saving: state.promotions.savingForm,
        savingFailed: state.promotions.savingFormFailed,
        products: state.products,
        currentScreen: state.render.currentScreen,
        currencySymbol: state.phone.currencySymbol
    }),
    (dispatch) => ({
        businessActions: bindActionCreators(businessAction, dispatch),
        actions: bindActionCreators(promotionsAction, dispatch)
    })
)(AddPromotion);