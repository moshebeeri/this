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
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header,Item,Picker,Footer} from 'native-base';

import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import ImagePicker from 'react-native-image-crop-picker';



import * as productsAction from "../../../actions/product";
import store from 'react-native-simple-store';
import { bindActionCreators } from "redux";
class AddProduct extends Component {



    constructor(props) {
        super(props);

        this.state = {
            name: null,
            email:'',
            website:'',
            country:'',
            city:'',
            state:'',
            path:'',
            image:'',
            images:'',
            tax_id:'',
            userId:'',
            token:'',
            services: [],
            business: '',
            formData:{}
        };
        let stateFunc = this.setState.bind(this);

        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });
    }




    async componentWillMount(){
        try {
            if(this.props.businesses.businesses.length > 0) {
                this.selectBusiness(this.props.businesses.businesses[0]);
            }

        }catch (error){
            console.log(error);
        }

    }

    replaceRoute(route) {
        this.props.navigation.goBack();
    }



    initBusiness(responseData){

        this.setState({
            services: responseData,
            business: responseData[0]._id
        });
    }


    saveFormData(){

        let product = {
            name:this.state.name,
            image:this.state.image,
            business: this.state.business,
            info : this.state.info,
            retail_price: this.state.retail_price,




        }
        entityUtils.create('products',product,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){
        this.props.fetchProducts();
        this.replaceRoute('home');
    }

    selectBusiness(value){
        this.setState({
            business:value
        })


    }
    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }


    formFailed(error){
        console.log('failed');
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
    render() {

        let image ;
        if(this.state.path){
            image =  <Image
                            style={{width: 50, height: 50}}
                            source={{uri: this.state.path}}
                        />


        }

        let pikkerTag = undefined;

        if(this.props.businesses.businesses.length > 0 ){
            pikkerTag = <Picker
                iosHeader="Select Business"
                mode="dropdown"
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.props.businesses.businesses.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name} />
                    }) }
            </Picker>

        }




        return (
            <Container>

                <Content style={{margin:10,backgroundColor: '#fff'}}>

                    <Item style={{ margin:3 } } regular >
                        <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item style={{ margin:3 } } regular >
                        <Input  blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>


                    <Item style={{ margin:3 } } regular >
                        <Input  blurOnSubmit={true} returnKeyType='done' ref="3"   onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Price' />
                    </Item>

                    {pikkerTag}

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

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Add Product</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}


export default connect(
    state => ({
        products: state.products,
        businesses: state.businesses
    }),

    dispatch => bindActionCreators(productsAction, dispatch)
)(AddProduct);

