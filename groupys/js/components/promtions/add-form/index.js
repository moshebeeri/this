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
const types = [
    {
        value:'PERCENT',
        label:'percent'
    },
    {
        value:'PERCENT_RANGE',
        label:'Percent Range'
    },
    {
        value:'GIFT',
        label:'Gift'
    },
    {
        value:'AMOUNT',
        label:'Amount'
    },
    {
        value:'PRICE',
        label:'Price'
    },
    {
        value:'X+Y',
        label:'x + y'
    },
    {
        value:'X+N%OFF',
        label:'X+N%OFF'
    },
    {
        value:'INCREASING',
        label:'Incresing'
    },

    {
        value:'DOUBLING',
        label:'Doubling'
    },

    {
        value:'ITEMS_GROW',
        label:'Item Grow'
    },
    {
        value:'PREPAY_FOR_DISCOUNT',
        label:'Prepay For Discount'
    },
    {
        value:'REDUCED_AMOUNT',
        label:'Reduce Amount'
    },
    {
        value:'PUNCH_CARD',
        label:'Punch Catd'
    },
    {
        value:'CASH_BACK',
        label:'Cash Back'
    },
    {
        value:'EARLY_BOOKING',
        label:'Early Booking'
    },
    {
        value:'HAPPY_HOUR',
        label:'Happy Hour'
    },
    {
        value:'MORE_THAN',
        label:'More Than'
    },

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
            businessId: undefined,
            path: '',
            image: '',
            type: '',
            images: '',
            businesses: [],
            selectedBusiness: '',
            selectedProduct: [],
            productList: [],
            showProductsList: false,
            selectedType: 'PERCENT',
            percent: {},
            percent_range: {},
            fromDate: "",
            toDate: "",

        }


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
            selectedBusiness: responseData[0]._id
        });
    }


    replaceRoute(route) {
        this.props.replaceAt('signup', {key: route}, this.props.navigation.key);
    }


    async selectBusiness(value){
        this.setState({
            selectedBusiness:value
        })
        let productsReponse = await productApi.findByBusinessId(value);
        await this.initProducts(productsReponse);


    }
    async selectPromotionType(value){
        this.setState({
            selectedType:value
        })
    }

    saveFormData(){
        this.setState({
                formData:{name: this.state.name,address: this.state.address, email: this.state.email,
                    website: this.state.website,  country: this.state.country,  city: this.state.city,
                    state: this.state.state,type :this.state.type,formID:this.state.formID, tax_id:this.state.tax_id}
            }
        );
        this.props.saveForm(this.state);
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
        this.setState({
            showProductsList:boolean
        })
    }



    selectProduct(product){
        if(this.state.selectedProduct.find(function(val, i) {
                return val._id === product._id;
            })){
            let selectedProducts = this.state.selectedProduct.filter(function(val, i) {
                return val._id !== product._id;
            });
            this.setState({
                selectedProduct: selectedProducts
            })
            return;
        }
        let selectedProducts = this.state.selectedProduct;
        selectedProducts.push(product);
        this.setState({
            selectedProduct: selectedProducts
        })


    }





    render() {


        if(this.state.showProductsList){
             return ( <SelectProductsComponent showProducts = {this.showProducts.bind(this)} selectedProduct = {this.state.selectedProduct} products={this.state.productList}  selectProduct = {this.selectProduct.bind(this)} />

            );
        }
        let items = undefined;

        if(this.state.selectedProduct.length > 0){
            let index = 0
            items = this.state.selectedProduct.map((r, i) => {
                index++;
                return  <ListItem  key={index}>
                    <Text>
                        {r.name}
                    </Text>
                </ListItem>
            });
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
                selectedValue={this.state.selectedBusiness}
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
                selectedValue={this.state.selectedType}
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

        switch(this.state.selectedType){
            case 'PERCENT':
                discountForm = <PercentComponent state={this.state} setState={this.setState.bind(this)}/>
                break;
            case 'PERCENT_RANGE':
                discountForm = <PercentRangeComponent state={this.state} setState={this.setState.bind(this)}/>
                break;


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
                        <Input value= {this.state.name} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input value= {this.state.info} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>



                    <Item underline>
                        <Button   transparent  onPress={() => this.showProducts(true)}>
                            <Text>Select Products </Text>
                        </Button>

                    </Item>
                    {items}
                    <Item underline>
                        <View style={{ flexDirection: 'row',marginTop:5 }}>

                            <Button   transparent  onPress={() => this.pickSingle(true)}>
                                <Text>Select Image </Text>
                            </Button>

                            {image}
                        </View>
                    </Item>
                    <Item underline>

                            <Text style={{ padding: 18}}>Discount: </Text>
                        {typePikkerTag}
                    </Item>

                       {discountForm}

                    <Item underline>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.fromDate}
                        mode="date"
                        placeholder="From"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate="2020-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"

                        onDateChange={(date) => {this.setState({fromDate: date})}}
                    />
                    </Item>
                    <Item underline>
                        <DatePicker
                            style={{width: 200}}
                            date={this.state.toDate}
                            mode="date"
                            placeholder="To"
                            format="YYYY-MM-DD"
                            minDate="2016-05-01"
                            maxDate="2020-06-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"

                            onDateChange={(date) => {this.setState({toDate: date})}}
                        />
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
