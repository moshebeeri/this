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
import SelectProductsComponent from './selectProducts';
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
import PercentRangeComponent from "./precent-range/index"
import DatePicker from 'react-native-datepicker'

const types = [
    {
        value:'PERCENT',
        label:'Fixed percentage'
    },
    {
        value:'PERCENT_RANGE',
        label:'Automatic Percentage'
    },
    // {
    //     value:'GIFT',
    //     label:'Gift'
    // },
    // {
    //     value:'AMOUNT',
    //     label:'Amount'
    // },
    // {
    //     value:'PRICE',
    //     label:'Price'
    // },
    // {
    //     value:'X+Y',
    //     label:'x + y'
    // },
    // {
    //     value:'X+N%OFF',
    //     label:'X+N%OFF'
    // },
    // {
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
    // {
    //     value:'PUNCH_CARD',
    //     label:'Punch Catd'
    // },
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
;const Discouint_on = [
            {
            value:'GLOBAL',
            label:'Global Discount'
        },
        {
            value:'PRODUCT',
            label:'Product Discount'
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
            type: 'PERCENT',
            images: '',
            businesses: [],
            business: '',
            product: '',
            productList: [],
            showProductsList: false,
            percent: {},
            amount: '',
            retail_price: '',
            total_discount: '',
            percent_range: {},
            start: "",
            end: "",
            location: "",
            info: "",
            discount_on: 'GLOBAL'


        }


    }


    async componentWillMount(){
        try {
            if(this.props.businesses.businesses.length > 0) {
                this.selectBusiness(this.props.businesses.businesses[0]._id);
            }

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

    async initProducts(responseData){

        this.setState({
            productList: responseData,

        });
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
       this.props.fetchPromotions();
    }


    createPromotionFromState(){
        let promotion = {
            image: this.state.image,
            type: this.state.type,
            percent: this.state.percent,

            retail_price: Number(this.state.retail_price),
            total_discount: Number(this.state.total_discount),
            // percent_range: this.state.percent_range,
            start: this.state.start,
            end: this.state.end,
            location: this.state.location,
            description: this.state.info,
            path: this.state.path,
            name: this.state.name,

        };
        promotion.entity = {};
        if(this.state.discount_on == 'GLOBAL'){
            promotion.entity.business = this.state.business;
        }else {
            promotion.entity.business = this.state.business;
            promotion.product = this.state.product;
        }

        promotion.percent = {};
        if(this.state.type == 'PERCENT'){
            promotion.percent.variation = 'SINGLE';
            promotion.percent.values = [this.state.percent.percent]
            promotion.percent.quantity = Number(this.state.amount)
        }

        if(this.state.type == 'PERCENT_RANGE'){
            promotion.percent.variation = 'RANGE';
            promotion.percent.quantity = Number(this.state.amount)
            promotion.percent.values = [this.state.percent_range.from,this.state.percent_range.to]
        }

        return promotion;

    }


    async selectBusiness(value){
        let businessId = value;
        let selectedBusiness = this.props.businesses.businesses.find(function(val, i) {
            return val._id === businessId;
        });

        this.setState({
            product: '',
            business:value,
            location: selectedBusiness.location
        })
        let productsReponse = await productApi.findByBusinessId(value);
        await this.initProducts(productsReponse);


    }
    async selectPromotionType(value){
        this.setState({
            type:value
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
        if(this.state.productList.length == 0){
            return;
        }

        this.setState({
            showProductsList:boolean
        })
    }



    selectProduct(product){

        this.setState({
            product: product,
            showProductsList:false
        })


    }





    render() {
        let discountPiker = <Picker
            iosHeader="Discount"
            mode="dropdown"
            style={{ flex:1}}
            selectedValue={this.state.discount_on}
            onValueChange={this.selectDiscountType.bind(this)}>

            {


                Discouint_on.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                }) }
        </Picker>

        let submitButton = <Button transparent
                                   onPress={this.saveFormData.bind(this)}
        >
            <Text>Add Promotion</Text>
        </Button>
        if(this.props.navigation.state.params && this.props.navigation.state.params.item){
            submitButton = <Button transparent
                                   onPress={this.updateFormData.bind(this)}
            >
                <Text>Update Promotion</Text>
            </Button>
        }

        if(this.state.discount_on == 'PRODUCT') {

            if (this.state.showProductsList) {
                return (<SelectProductsComponent products={this.state.productList}
                                                 selectProduct={this.selectProduct.bind(this)}/>

                );
            }
            let item = undefined;

            if (this.state.product) {

                item =
                    <Text style={{padding: 10}}>
                        {this.state.product.name}
                    </Text>


            }

            let image;
            if (this.state.path) {
                image = <Image
                    style={{width: 50, height: 50}}
                    source={{uri: this.state.path}}
                />


            }


            let businessesPikkerTag = <Picker

                iosHeader="Business"
                mode="dropdown"
                style={{ flex:1}}
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {




                    this.props.businesses.businesses.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name}/>
                    }) }
            </Picker>

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

            let discountForm = undefined;

            switch (this.state.type) {
                case 'PERCENT':
                    discountForm = <PercentComponent state={this.state} setState={this.setState.bind(this)}/>
                    break;
                case 'PERCENT_RANGE':
                    discountForm = <PercentRangeComponent state={this.state} setState={this.setState.bind(this)}/>
                    break;


            }

            let selectProductButton = undefined;
            if (this.state.productList.length > 0) {
                selectProductButton = <Button transparent onPress={() => this.showProducts(true)}>
                    <Text>Select Product </Text>
                </Button>

            } else {
                selectProductButton = <Button disabled transparent onPress={() => this.showProducts(true)}>
                    <Text>Select Product </Text>
                </Button>
            }


            return (
                <Container>

                    <Content style={{backgroundColor: '#fff'}}>

                        <Item underline>
                            {businessesPikkerTag}
                        </Item>

                        <Item underline>
                            {discountPiker}
                        </Item>


                        <Item underline>
                            <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} value={this.state.name} onChangeText={(name) => this.setState({name})}
                                   placeholder='Name'/>
                        </Item>
                        <Item underline>
                            <Input  blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} value={this.state.info} onChangeText={(info) => this.setState({info})}
                                   placeholder='Description'/>
                        </Item>


                        <Item underline>
                            {selectProductButton}
                            {item}
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="3" onSubmitEditing={this.focusNextField.bind(this,"4")} value={this.state.amount} onChangeText={(amount) => this.setState({amount})}
                                   placeholder='Product Amount'/>
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} p='next' ref="4" onSubmitEditing={this.focusNextField.bind(this,"5")} value={this.state.retail_price}
                                   onChangeText={(retail_price) => this.setState({retail_price})}
                                   placeholder='Product Reatai Price'/>
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="5"  value={this.state.total_discount}
                                   onChangeText={(total_discount) => this.setState({total_discount})}
                                   placeholder='Product Total Price'/>
                        </Item>

                        {discountForm}


                        <Item underline>
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
                        <Item underline>
                            <View style={{flexDirection: 'row', marginTop: 5}}>

                                <Button transparent onPress={() => this.pickPicture()}>
                                    <Text>Select Image </Text>
                                </Button>

                                {image}
                            </View>
                            <View style={{ flexDirection: 'row',marginTop:5 }}>

                                <Button   transparent  onPress={() => this.pickFromCamera()}>
                                    <Text> take picture </Text>
                                </Button>

                                {image}
                            </View>
                        </Item>

                    </Content>
                    <Footer>
                        {submitButton}

                    </Footer>
                </Container>
            );
        }else{



            let businessesPikkerTag = <Picker

                iosHeader="Business"
                mode="dropdown"
                style={{ flex:1}}
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {




                    this.props.businesses.businesses.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name}/>
                    }) }
            </Picker>




            let image;
            if (this.state.path) {
                image = <Image
                    style={{width: 50, height: 50}}
                    source={{uri: this.state.path}}
                />


            }




            return (
                <Container>

                    <Content style={{margin:10,backgroundColor: '#fff'}}>

                        <Item  style={{ margin:3 } } regular>
                            {businessesPikkerTag}
                        </Item>

                        <Item  style={{ margin:3 } } regular>
                            {discountPiker}
                        </Item>


                        <Item  style={{ margin:3 } } regular>
                            <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} value={this.state.name} onChangeText={(name) => this.setState({name})}
                                   placeholder='Name'/>
                        </Item>
                        <Item  style={{ margin:3 } } regular>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")}  value={this.state.info} onChangeText={(info) => this.setState({info})}
                                   placeholder='Description'/>
                        </Item>
                        <Item  style={{ margin:3 } } regular>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="3"  value={this.state.amount} onChangeText={(amount) => this.setState({amount})}
                                   placeholder='Amount'/>
                        </Item>

                        <PercentComponent state={this.state} setState={this.setState.bind(this)}/>

                        <Item  style={{ margin:3 } } regular>
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

                    </Content>
                    <Footer style={{backgroundColor: '#fff'}}>

                        {submitButton}
                    </Footer>
                </Container>
            );
        }
    }


}
export default connect(
    state => ({
        promotions: state.promotions,
        businesses: state.businesses
    }),

    dispatch => bindActionCreators(promotionsAction, dispatch)
)(AddPromotion);