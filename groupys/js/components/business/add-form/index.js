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



import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text,Icon} from 'native-base';

import store from 'react-native-simple-store';


import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import Autocomplete from 'react-native-autocomplete-input';
 class AddBusiness extends Component {


    constructor(props) {
        super(props);

        if(props.navigation.state.params && props.navigation.state.params.item){
            let item = props.navigation.state.params.item;
            this.state = {
                name: item.name,
                address: item.address,
                email: item.email,
                website: item.website,
                country: 'israel',
                city: item.city,
                state: '',
                path: '',
                image: '',
                type: item.type,
                images: '',
                tax_id: item.tax_id,
                formID: '12345',
                userId: '',
                token: '',
                category:'',
                subcategory:'',
                formData: {},
            };
        }else {

            this.state = {
                name: '',
                address: '',
                email: '',
                website: '',
                country: 'israel',
                city: '',
                state: '',
                path: '',
                image: '',
                type: 'SMALL_BUSINESS',
                images: '',
                tax_id: '',
                formID: '12345',
                userId: '',
                token: '',
                category:'',
                subcategory:'',
                formData: {},
            };
        }
        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });

    }



     getCategories(){
         let categories =  this.props.businesses.categories;
         let categoriesTop = categories.map(function(cat){
             return cat.t.name
         })

         categoriesTop = categoriesTop.filter(function (x, i, a) {
             return a.indexOf(x) == i;
         });
         return categoriesTop;

     }

     getPickerCategories(){
         let category = this.state.category;
         let categoriesBottom = undefined;
         if(this.state.category){
             categoriesBottom = this.props.businesses.categories.filter(
                 function (cat) {
                   return  cat.t.name == category
                 }
             )

             if(categoriesBottom){
                 categoriesBottom  = categoriesBottom.map(function (cat) {
                     return cat.c.name;

                 })
             }
         }

         return categoriesBottom;

     }

     findCat(query) {

         let cats = this.getCategories()
         if (query === '') {
             return [];
         }


         const regex = new RegExp(`${query.trim()}`, 'i');
         let response =  cats.filter(cat => cat.search(regex) >= 0);

         if(response.length == 1 && response ==query ){
             return [];
         }

         return response;
     }

     replaceRoute(route) {

        this.props.navigation.goBack();
    }



    focusNextField(nextField) {

       this.refs[nextField]._root.focus()

    }

    selectType(value){
        this.setState({
            type:value
        })


    }


    saveFormData(){


        entityUtils.create('businesses',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }


     updateFormData(){


         entityUtils.update('businesses',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.props.navigation.state.params.item._id);
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

    setTopCategory(category){
        this.setState({
            category:category
        })

    }
     setBottomCategory(category){
         this.setState({
             subcategory:category
         })

     }
    render() {

        let categories =  this.getPickerCategories();
        let discountPiker = undefined;
        if(categories && categories.length > 0){
             discountPiker = <Picker
            iosHeader="Sub type"
            mode="dropdown"
            style={{ flex:1}}
            selectedValue={this.state.subcategory}
            onValueChange={this.setBottomCategory.bind(this)}>

            {


                categories.map((s, i) => {
                    return <Item
                        key={i}
                        value={s}
                        label={s}/>
                }) }
        </Picker>
        }

        let image ;
        if(this.state.path){
            image =  <Image
                            style={{width: 50, height: 50}}
                            source={{uri: this.state.path}}
                        />



        }
        let saveButton =  <Button transparent
                                  onPress={this.saveFormData.bind(this)}>
            <Text>Add Business</Text>
        </Button>
        if(this.props.navigation.state.params && this.props.navigation.state.params.item){
            saveButton =  <Button transparent
                                  onPress={this.updateFormData.bind(this)}
            >
                <Text>Update Business</Text>
            </Button>

        }
        let data = this.findCat(this.state.category);
        let autoComplete = undefined;
        if(data){
            autoComplete =  <Autocomplete
                data={data}
                defaultValue={this.state.category}
                containerStyle={{     margin:3}}
                onChangeText={text => this.setTopCategory({ category: text })}
                renderItem={data => (

                    <TouchableOpacity onPress={() => this.setState({ category: data })}>
                        <Text style={{ fontStyle: 'normal',fontSize:20 }}>{data}</Text>
                    </TouchableOpacity>
                )}
                renderTextInput = {() => (
                    <Input  value={this.state.category}  blurOnSubmit={true} returnKeyType='next' ref="0" onSubmitEditing={this.focusNextField.bind(this,"1")} onChangeText={(category) => this.setState({category})} placeholder='Business Type' />

                )}
            />
        }

        return (

            <Container>


                <Content  style={{margin:10,backgroundColor: '#fff'}}>
                    <Form>
                        {autoComplete}
                        {discountPiker}

                        <Item style={{ margin:3 } } regular >
                            <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                        </Item>
                        <Item style={{ margin:3 } } regular >
                          <Input value={this.state.email}  blurOnSubmit={true} returnKeyType='next' ref="2"  onSubmitEditing={this.focusNextField.bind(this,"3")}  onChangeText={(email) => this.setState({email})} placeholder='Email' />
                        </Item>

                        <Item style={{ margin:3 } } regular >
                           <Input value={this.state.website}  blurOnSubmit={true} returnKeyType='next' ref="3"  onSubmitEditing={this.focusNextField.bind(this,"4")}  onChangeText={(website) => this.setState({website})} placeholder='Website' />
                        </Item>

                        <Item style={{ margin:3 } } regular >
                           <Input value={this.state.city} blurOnSubmit={true} returnKeyType='next' ref="4"  onSubmitEditing={this.focusNextField.bind(this,"5")}  onChangeText={(city) => this.setState({city})} placeholder='City' />
                        </Item>
                        <Item style={{ margin:3 } } regular >
                           <Input value={this.state.address} blurOnSubmit={true} returnKeyType='next' ref="5"  onSubmitEditing={this.focusNextField.bind(this,"6")}  onChangeText={(address) => this.setState({address})} placeholder='Addresss' />
                        </Item>
                        <Item style={{ margin:3 } } regular >
                           <Input value={this.state.tax_id} blurOnSubmit={true} returnKeyType='done' ref="6"   onChangeText={(tax_id) => this.setState({tax_id})} placeholder='Tax ID' />
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





                    </Form>


                </Content>
                <Footer style={{backgroundColor: '#fff'}}>
                    {saveButton}

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
