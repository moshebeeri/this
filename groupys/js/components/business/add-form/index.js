import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,

    TouchableHighlight
} from 'react-native';



import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text} from 'native-base';

import store from 'react-native-simple-store';


import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
 class AddBusiness extends Component {


    constructor(props) {
        super(props);



        this.state = {
            name: '',
            address:'',
            email:'',
            website:'',
            country:'israel',
            city:'',
            state:'',
            path:'',
            image:'',
            type:'SMALL_BUSINESS',
            images:'',
            tax_id:'',
            formID:'12345',
            userId:'',
            token:'',

            formData:{},
        };
        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });

    }





    replaceRoute(route) {

        this.props.navigation.goBack();
    }



    focusNextField(nextField) {

       this.refs[nextField].focus()

    }

    selectType(value){
        this.setState({
            type:value
        })


    }


    saveFormData(){


        entityUtils.create('businesses',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){
        this.props.fetchBusiness();
        this.replaceRoute('home');
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
        return (

            <Container>


                <Content  style={{backgroundColor: '#fff'}}>
                    <Form>

                        <Item underline>
                            <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} autoFocus = {true} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="2"  onSubmitEditing={this.focusNextField.bind(this,"3")}  onChangeText={(email) => this.setState({email})} placeholder='Email' />
                        </Item>

                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="3"  onSubmitEditing={this.focusNextField.bind(this,"4")}  onChangeText={(website) => this.setState({website})} placeholder='Website' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="4"  onSubmitEditing={this.focusNextField.bind(this,"5")}  onChangeText={(country) => this.setState({country})} placeholder='Country' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="5"  onSubmitEditing={this.focusNextField.bind(this,"6")}  onChangeText={(state) => this.setState({state})} placeholder='State' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="6"  onSubmitEditing={this.focusNextField.bind(this,"7")}  onChangeText={(city) => this.setState({city})} placeholder='City' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='next' ref="7"  onSubmitEditing={this.focusNextField.bind(this,"8")}  onChangeText={(address) => this.setState({address})} placeholder='Addresss' />
                        </Item>
                        <Item underline>
                            <Input blurOnSubmit={true} returnKeyType='done' ref="8"   onChangeText={(tax_id) => this.setState({tax_id})} placeholder='Tax ID' />
                        </Item>


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





                    </Form>


                </Content>
                <Footer>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Add Business</Text>
                    </Button>
                </Footer>
            </Container>

        );
    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
