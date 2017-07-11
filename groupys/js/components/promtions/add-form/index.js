import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,

    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Picker,Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,ListItem,Right,Thumbnail} from 'native-base';

import { bindActionCreators } from "redux";

import * as promotionsAction from "../../../actions/promotions";

var createEntity = require("../../../utils/createEntity");
import ImagePicker from 'react-native-image-crop-picker';

import BusinessApi from "../../../api/business"
let businessApi = new BusinessApi();

import PromotionApi from "../../../api/promotion"
let promotionApi = new PromotionApi();
import ProductApi from "../../../api/product"
let productApi = new ProductApi();

import PercentComponent from "./percent/index"

import PunchCardComponent from "./punch-card/index"
import XPlusYComponent from './xPlusY/index'
import XPlusYOffComponent from './xGetYwithPrecentage/index'
import XForYComponent from './xForY/index'

import DatePicker from 'react-native-datepicker'

const types = [
        {
            value:'',
            label:'Choose Promotion'
        },



        {
            value:'PERCENT',
            label:'% Off'
        },
    // {
    //     value:'AMOUNT',
    //     label:'Amount'
    // },
    // {
    //     value:'PRICE',
    //     label:'Price'
    // },
    {
        value:'X+Y',
        label:'Buy X Get Y'
    },
    {
        value:'x_for_y',
        label:'Buy X For Y'
    },


    {
        value:'X+N%OFF',
        label:'Buy X Get Y With % Off'
    },
    //{
    //     value:'INCREASING',
    //     label:'Incresing'
    // },
    //
    // {
    //     value:'DOUBLING',
    //     label:'Doubling'
    // },
    //
    // {
    //     value:'ITEMS_GROW',
    //     label:'Item Grow'
    // },
    // {
    //     value:'PREPAY_FOR_DISCOUNT',
    //     label:'Prepay For Discount'
    // },
    // {
    //     value:'REDUCED_AMOUNT',
    //     label:'Reduce Amount'
    // },
    {
        value:'PUNCH_CARD',
        label:'Punch Catd'
    },
    // {
    //     value:'CASH_BACK',
    //     label:'Cash Back'
    // },
    // {
    //     value:'EARLY_BOOKING',
    //     label:'Early Booking'
    // },
    // {
    //     value:'HAPPY_HOUR',
    //     label:'Happy Hour'
    // },
    // {
    //     value:'MORE_THAN',
    //     label:'More Than'
    // },

    ]
      //15% off for purchases more than 1000$ OR buy iphone for 600$ and get 50% off for earphones
;const Distribution = [
    {
        value:'',
        label:'Choose Distribution'
    },
            {
            value:'GROUP',
            label:'Group'
        },
        {
            value:'PERSONAL',
            label:'Personal'
        }
    ];


import {DeviceEventEmitter} from 'react-native'
 class AddPromotion extends Component {





    constructor(props) {
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
            end: "",
            location: "",
            info: "",
            discount_on: '',
            distribution:'',
            choose_distribution:false,
            show_save:false,
            showProductsList: false,
            quantity:'',
            promotion:{}


        }

        let businessId = this.getBusinessId();
        this.props.fetchProducts(businessId);


    }


    async componentWillMount(){
        try {


            if(this.props.navigation.state.params && this.props.navigation.state.params.item){
                let item = this.props.navigation.state.params.item;
               await  this.setState({
                    type: item.type,
                    start: item.start,
                    end: item.end,
                    location: item.location,
                    name: item.name,
                     info:item.description

                });
                if(item.type == 'PERCENT'){
                    await   this.setState({
                        percent:{
                            percent:item.percent.values[0]
                        }
                    })
                }
                if(!item.product){
                    await  this.setState({
                        product:item.product,
                        discount_on: 'GLOBAL'
                    })
                }else{
                    await  this.setState({
                        discount_on: 'PRODUCT'
                    })
                }

            }

        }catch (error){
            console.log(error);
        }

    }




    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }

    replaceRoute() {
        this.props.navigation.goBack();
    }


   async saveFormData(){

       let promotion = this.createPromotionFromState();

       try {
            let response = await promotionApi.createPromotion(promotion,this.addToList.bind(this));
            this.replaceRoute();
        }catch (error){
            console.log(error);
            this.replaceRoute();
        }
    }

     async updateFormData(){

         let promotion = this.createPromotionFromState();

         try {
             let response = await promotionApi.updatePromotion(promotion,this.addToList.bind(this),this.props.navigation.state.params.item._id);
             this.replaceRoute();
         }catch (error){
             console.log(error);
             this.replaceRoute();
         }
     }

     addToList(responseData){
        let businessId = this.getBusinessId();
       this.props.fetchPromotions(businessId);
    }

    getBusinessId(){
          let businessId = undefined;
        if(this.props.navigation.state.params.item){
            businessId = this.props.navigation.state.params.item.business
        }else{
            businessId = this.props.navigation.state.params.business._id;
        }
        return businessId;
    }

    createPromotionFromState(){

        let promotion = {
            image: this.state.image,
            type: this.state.type,
            percent: this.state.percent,


            total_discount: Number(this.state.total_discount),
            // percent_range: this.state.percent_range,
            start: this.state.start,
            end: this.state.end,

            description: this.state.info,
            path: this.state.path,
            name: this.state.name,

        };



         let businessId = this.getBusinessId();

        promotion.entity = {};
        promotion.condition = {};
        promotion.distribution = {};

        if(this.state.discount_on == 'GLOBAL'){

            promotion.condition.business = businessId;
            promotion.entity.business = businessId;


        }else {
           promotion.entity.business = businessId;
            promotion.product = this.state.product;
        }

        if(this.state.distribution == 'GROUP'){
            promotion.distribution.groups = this.state.groups;

        }else{
            promotion.distribution.business = businessId;
        }

        promotion.percent = {};
        if(this.state.type == 'PERCENT'){
            promotion.percent.variation = 'SINGLE';
            promotion.percent.values = [this.state.percent.percent]
            promotion.percent.quantity = Number(this.state.percent.quantity)
            if(this.state.percent.retail_price) {
                promotion.retail_price = Number(this.state.percent.retail_price)
            }
        }

        if(this.state.type == 'PERCENT_RANGE'){
            promotion.percent.variation = 'RANGE';
            promotion.percent.quantity = Number(this.state.amount)
            promotion.percent.values = [this.state.percent_range.from,this.state.percent_range.to]
        }

        return promotion;

    }



    async selectPromotionType(value){
        this.setState({
            type:value,
            choose_distribution:false,
            showProductsList:false,
            discount_on: '',
            distribution:'',
            show_save:false,


    })
    }

    async selectDiscountType(value){
        this.setState({
            discount_on:value
        })
    }


    async pickFromCamera() {
        try {
            let image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                compressImageQuality: 0.5,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }

    setQuantity(quantity){
        this.setState({
            quantity:quantity
        })
    }
    async pickPicture() {
        try {
            let image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth: 640,
                compressImageMaxHeight: 480,
                compressImageQuality: 0.5,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }catch (e){
            console.log(e);
        }
    }

    showProducts(boolean){
        if(!this.props.products){
            return;
        }
        let products =  this.getProducts();
        if(!products){
            return;
        }
        if(products.length == 0){
            return;
        }

        this.setState({
            showProductsList:boolean
        })
    }

    getProducts(){
        let products = undefined;
        let businessId = this.getBusinessId();
        if(this.props.products) {
            products = this.props.products['products' + businessId];
        }
        return products;
    }


    selectProduct(product){

        this.setState({
            product: product,
            showProductsList:false,

        })



    }


    createDiscountConditionForm(){
        let result =undefined;
        let discountForm = undefined;
        if(this.state.type){
            switch (this.state.type){
                case 'PERCENT':
                    discountForm = <PercentComponent navigation={this.props.navigation} api= {this}state={this.state} setState={this.setState.bind(this)}/>
                    break;
                case 'PUNCH_CARD':
                    discountForm = <PunchCardComponent navigation={this.props.navigation} api= {this}state={this.state} setState={this.setState.bind(this)}/>
                    break;
                case 'X+Y':
                    discountForm = <XPlusYComponent navigation={this.props.navigation} api= {this}state={this.state} setState={this.setState.bind(this)}/>
                    break;

                case 'X+N%OFF':
                    discountForm = <XPlusYOffComponent navigation={this.props.navigation} api= {this}state={this.state} setState={this.setState.bind(this)}/>
                    break;

                case 'x_for_y':
                    discountForm = <XForYComponent navigation={this.props.navigation} api= {this}state={this.state} setState={this.setState.bind(this)}/>
                    break;

            }
        }

        if(discountForm){
            result =    <View style={{margin:10,borderWidth:3,borderRadius:10, backgroundColor: '#fff'}}>
                                  {discountForm}
                        </View>
            }
        return result;
    }

     selectDistributionType(type){

        if(type== 'PERSONAL'){
            this.setState({
                distribution:type,
                show_save:true,
            })
        }else {
            this.setState({
                distribution: type,
                show_save:false,
            })
        }

     }
     selectGroup(group){
         if(group && group.length > 0) {
             this.setState({
                 groups: group,
                 show_save:true,
             })
         }
     }
     showGroups(){
         let bid = this.getBusinessId();
         let groupFunction = this.selectGroup.bind(this);
         this.props.navigation.navigate("SelectGroupsComponent",{
             bid:bid,selectGroup:groupFunction})
     }
    createDistributionForm(){
        let result = undefined;
        if(this.state.choose_distribution){
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
                    }) }
            </Picker>
            let button = undefined;

            if(this.state.distribution == 'GROUP'){
                let selectedGroup = undefined;
                if(this.state.groups){
                    selectedGroup = <Text>{this.state.groups.length} are selected</Text>
                }
                button = <Item><Button transparent onPress={() => this.showGroups()}>
                    <Text>Select Groups </Text>
                </Button>
                    {selectedGroup}
                </Item>

            }
            result =   <View style={{margin:10,borderWidth:3,borderRadius:10, backgroundColor: '#fff'}}>
                {distribution}
                {button}

            </View>
        }

        return result
    }


     createSubmitButton(){
        let result = undefined;
        if(this.state.show_save){
             let submitButton = <Button transparent
                                        onPress={this.saveFormData.bind(this)}>
                 <Text>Add Promotion</Text>
             </Button>


            result =   <Footer style={{backgroundColor: '#fff'}}>

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
                }) }
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
        let submitButton = this.createSubmitButton();
        return (
                <Container>

                    <Content style={{margin:10,backgroundColor: '#fff'}}>

                        <View style={{margin:10,borderWidth:3,borderRadius:10, backgroundColor: '#fff'}}>

                            {typePikkerTag}



                        <Item  style={{ margin:3 } } regular>
                            <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} value={this.state.promotion.name} onChangeText={(name) => this.setState({name})}
                                   placeholder='Name'/>
                        </Item>
                        <Item  style={{ margin:3 } } regular>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="2"  value={this.state.promotion.info} onChangeText={(info) => this.setState({info})}
                                   placeholder='Description'/>
                        </Item>
                            <Item style={{ margin:3 } } regular>
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
                            <Item  style={{ margin:3 } } regular>
                                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setQuantity(value)} placeholder='Quantity' />
                            </Item>

                        <Item  style={{ margin:3 } } regular>

                            <Button  iconRight transparent  onPress={() => this.pickPicture()}>
                                <Text style={{ fontStyle: 'normal',fontSize:10 }}>Pick </Text>
                                <Icon name='camera' />
                            </Button>




                            <Button   iconRight transparent  onPress={() => this.pickFromCamera()}>
                                <Text style={{ fontStyle: 'normal',fontSize:10 }}>take </Text>
                                <Icon name='camera' />
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

    dispatch => bindActionCreators(promotionsAction, dispatch)
)(AddPromotion);