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
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import AddFormHeader from '../../header/addFormHeader';
import SelectProductsComponent from './selectProducts';

var createEntity = require("../../../utils/createEntity");
import ImagePicker from 'react-native-image-crop-picker';
const {
    replaceAt,
} = actions;


import BusinessApi from "../../../api/business"
let businessApi = new BusinessApi();

import ProductApi from "../../../api/product"
let productApi = new ProductApi();

import PercentComponent from "./percent/index"
import PercentRangeComponent from "./precent-range/index"
import DatePicker from 'react-native-datepicker'
import store from 'react-native-simple-store';
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
;
class AddPromotion extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };



    constructor(props) {
        super(props);

        this.state = {
            token:'',
            path: '',
            image: '',
            type: 'PERCENT',
            images: '',
            businesses: [],
            business: '',
            product: '',
            productList: [],
            showProductsList: false,
            percent:{},
            amount:'',
            retail_price:'',
            total_discount:'',
            percent_range: {},
            start: "",
            end: "",
            location: ""


        }

        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });
        store.get('user_id').then(storeUserId => {
            stateFunc({
                    creator: storeUserId
                }
            );
        });

        ;
    }


    async componentWillMount(){
        try {
            let response = await businessApi.getAll();
            if (response) {
                await this.initBusiness(response);
            }
            if(this.state.selectedBusiness){
                let productsReponse = await productApi.findByBusinessId(this.state.selectedBusiness);
                await this.initProducts(productsReponse);
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

    async initBusiness(responseData){

         this.setState({
            businesses: responseData,
             business: responseData[0]._id
        });
    }


    replaceRoute(route) {
        this.props.replaceAt('add-promotions', {key: route}, this.props.navigation.key);
    }

   async saveFormData(){



       this.setState({
            businesses: '',


        })
        createEntity('promotions',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){

        this.replaceRoute('promotions');
    }

    formFailed(response){
        console.log(response);
        this.replaceRoute('promotions');
    }

    async selectBusiness(value){
        let businessId = value;
        let selectedBusiness = this.state.businesses.find(function(val, i) {
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



    pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
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


        if(this.state.showProductsList){
             return ( <SelectProductsComponent   products={this.state.productList}  selectProduct = {this.selectProduct.bind(this)} />

            );
        }
        let item = undefined;

        if(this.state.product){

            item =
                    <Text  style={{ padding: 10}}>
                        {this.state.product.name}
                    </Text>


        }

        let image ;
        if(this.state.path){
            image =  <Image
                style={{width: 50, height: 50}}
                source={{uri: this.state.path}}
            />


        }

        let businessesPikkerTag = undefined;

        if(this.state.businesses.length > 0 ){
            businessesPikkerTag = <Picker

                iosHeader="Business"
                mode="dropdown"
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.state.businesses.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name} />
                    }) }
            </Picker>

        }


        let  typePikkerTag = <Picker
                iosHeader="Discount"
                mode="dropdown"
                selectedValue={this.state.type}
                onValueChange={this.selectPromotionType.bind(this)}>

                {


                    types.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.value}
                            label={s.label} />
                    }) }
            </Picker>

        let discountForm = undefined;

        switch(this.state.type){
            case 'PERCENT':
                discountForm = <PercentComponent state={this.state} setState={this.setState.bind(this)}/>
                break;
            case 'PERCENT_RANGE':
                discountForm = <PercentRangeComponent state={this.state} setState={this.setState.bind(this)}/>
                break;


        }

        let selectProductButton = undefined;
        if(this.state.productList.length > 0){
            selectProductButton =  <Button   transparent  onPress={() => this.showProducts(true)}>
                <Text>Select Product </Text>
            </Button>

        }else{
            selectProductButton =    <Button disabled   transparent  onPress={() => this.showProducts(true)}>
                <Text>Select Product </Text>
            </Button>
        }


        return (
            <Container>
                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}>
                    <AddFormHeader currentLocation="add-promotions" backLocation="promotions" />

                </Header>

                <Content  style={{backgroundColor: '#fff'}}>
                    <Item underline>
                        <Text style={{ padding: 18}}>Business: </Text>
                        {businessesPikkerTag}
                    </Item>
                    <Item underline>
                        {selectProductButton}
                        {item}
                    </Item>
                    <Item underline>
                        <Input value= {this.state.name} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input value= {this.state.info} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>




                    <Item underline>
                        <Input value= {this.state.amount} onChangeText={(amount) => this.setState({amount})} placeholder='Product Amount' />
                    </Item>
                    <Item underline>
                        <Input value= {this.state.retail_price} onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Product Reatai Price' />
                    </Item>
                    <Item underline>
                    {typePikkerTag}
                    </Item>
                    {discountForm}

                    <Item underline>
                        <Input value= {this.state.total_discount} onChangeText={(total_discount) => this.setState({total_discount})} placeholder='Product Total Price' />
                    </Item>
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

                            onDateChange={(date) => {this.setState({end: date})}}
                        />
                    </Item>
                    <Item underline>
                        <View style={{ flexDirection: 'row',marginTop:5 }}>

                            <Button   transparent  onPress={() => this.pickSingle(true)}>
                                <Text>Select Image </Text>
                            </Button>

                            {image}
                        </View>
                    </Item>

                </Content>
                <Footer>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Add Promotion</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(AddPromotion);
