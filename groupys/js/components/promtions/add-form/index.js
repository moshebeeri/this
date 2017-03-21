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
            path:'',
            image:'',
            type:'',
            images:'',
            businesses: [],
            selectedBusiness:'',
            selectedProduct:[],
            productList:[],
            showProductsList:false,




        };
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
        if(product.selected){
            product.selected = false;
            return
        }
        var selectedProducts = this.state.selectedProduct;
        selectedProducts.push(product);
        product.selected = true;
        this.setState({
            selectedProduct: selectedProducts
        })



    }

    render() {

        if(this.state.showProductsList){
             return ( <SelectProductsComponent products={this.state.productList}  selectProduct = {this.selectProduct.bind(this)} />

            );
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
                iosHeader="Select Business"
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
                        {businessesPikkerTag}
                    </Item>

                    <Item underline>
                        <Input onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>


                    <Item underline>
                        <Input onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Price' />
                    </Item>

                    <Item underline>
                        <Button   transparent  onPress={() => this.showProducts(true)}>
                            <Text> select products </Text>
                        </Button>
                    </Item>
                    <Item underline>
                        <View style={{ flexDirection: 'row',marginTop:5 }}>

                            <Button   transparent  onPress={() => this.pickSingle(true)}>
                                <Text> select image </Text>
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
