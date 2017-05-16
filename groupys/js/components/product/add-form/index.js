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

import AddFormHeader from '../../header/addFormHeader';

import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import ImagePicker from 'react-native-image-crop-picker';
import store from 'react-native-simple-store';
import BusinessApi from "../../../api/business"


let businessApi = new BusinessApi();
import {DeviceEventEmitter} from 'react-native'
export default class AddProduct extends Component {



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

    }




    async componentWillMount(){
        try {
            let response = await businessApi.getAll();

            if (response) {
                this.initBusiness(response);
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
        DeviceEventEmitter.emit('AddProduct',  response);
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

        if(this.state.services.length > 0 ){
            pikkerTag = <Picker
                iosHeader="Select Business"
                mode="dropdown"
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.state.services.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name} />
                    }) }
            </Picker>

        }




        return (
            <Container>

                <Content  style={{backgroundColor: '#fff'}}>

                    <Item underline>
                        <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} autoFocus = {true} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input  blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>


                    <Item underline>
                        <Input  blurOnSubmit={true} returnKeyType='done' ref="3"   onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Price' />
                    </Item>

                    {pikkerTag}

                    <View style={{ flexDirection: 'row',marginTop:5 }}>

                        <Button   transparent  onPress={() => this.pickPicture()}>
                            <Text> select image </Text>
                        </Button>

                        {image}
                    </View>
                    <View style={{ flexDirection: 'row',marginTop:5 }}>

                        <Button   transparent  onPress={() => this.pickFromCamera()}>
                            <Text> take picture </Text>
                        </Button>

                        {image}
                    </View>








                </Content>
                <Footer>

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

