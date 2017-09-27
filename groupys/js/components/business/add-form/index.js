import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableHighlight,
    Keyboard
} from 'react-native';



import {Container,Content,Item,Form,Picker,Input,Footer,Button,Text,Icon,Fab} from 'native-base';

import store from 'react-native-simple-store';


import EntityUtils from "../../../utils/createEntity";

let entityUtils = new EntityUtils();
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import Icon2 from 'react-native-vector-icons/Entypo';
import BusinessApi from '../../../api/business'
let businessApi = new BusinessApi();
import Autocomplete from 'react-native-autocomplete-input';
 class AddBusiness extends Component {


    constructor(props) {
        super(props);

        if(props.navigation.state.params && props.navigation.state.params.item){
            let item = props.navigation.state.params.item;
            let picture = undefined;
            if(item.pictures.length > 0 && item.pictures[0].pictures[1]){
                picture = item.pictures[0].pictures[1]
            }
            let category = item.category;
            if(!category){
                category = '0';
            }

            let subcategory = item.subcategory;
            if(!subcategory){
                subcategory = '0';
            }
            this.state = {
                name: item.name,
                address: item.address,
                email: item.email,
                website: item.website,
                country: 'israel',
                city: item.city,
                state: '',
                path: '',
                image: picture,
                type: item.type,
                images: '',
                tax_id: item.tax_id,
                formID: '12345',
                userId: '',
                token: '',
                category:category,
                subcategory:subcategory,
                categories:[Number(category),Number(subcategory)],
                formData: {},
                active: false,
                showSave:true,
                addressValidation:'',
                valid:true,

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
                categories:[],
                formData: {},
                active:false,
                showSave:true,
                locations:{},
                location:{},
                valid:false,

            };
        }




    }

     componentWillMount(){
         this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
         this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

     }
     componentWillUnmount () {
         this.keyboardDidShowListener.remove();
         this.keyboardDidHideListener.remove();
     }

     _keyboardDidShow () {
         this.setState({
             showSave : false
         })
     }

     _keyboardDidHide () {
         this.setState({
             showSave : true
         })
     }


     replaceRoute(route) {

        this.props.navigation.goBack();
    }



    focusNextField(nextField) {
        if(nextField =='6'){
           this.checkAddress()
        }
       this.refs[nextField]._root.focus()

    }

    selectType(value){
        this.setState({
            type:value
        })


    }
     setCategory(index,category){
         var milliseconds = (new Date).getTime();

         if(milliseconds-this.state.time  < 1000 ){
             return;
         }
         if(!category){
             return;
         }
         let categpries = this.state.categories;

         if(categpries.length <= index) {
             categpries.push(category);
         }else{
             let newCategories =  new Array();
             for (i = 0; i + 1 <= index; i++){
                 newCategories.push(categpries[i]);
             }
             categpries = newCategories
             categpries.push(category);
         }
         let reduxxCategories = this.props.businesses['categoriesen' + category];
         if(!reduxxCategories ) {

             this.props.fetchBusinessCategories(category);
         }
         this.setState({
             categories: categpries

         })

         if(categpries.length == 1){
             this.setState({
                 category: categpries[0]

             })
         }

         if(categpries.length == 2){
             this.setState({
                 category: categpries[0],
                 subcategory: categpries[1]

             })
         }

     }


     async checkAddress(){
         this.setState({
             addressValidation:''
         })
         let response = await businessApi.checkAddress(this.state,this.props.token)
         if(!response.valid){
            this.setState({
                addressValidation:response.message
            })
             this.focusNextField("4")
             return false;
         }

         if(response.results){
             this.setState({
                 locations:response.results
             })
             return false;
         }else{
             this.setState({
                 valid:true,
                 location:{
                     lat: response.lat,
                     lng:response.lng
                 }
             })
         }

         return true;
     }

     createPickers() {
         let categories = this.props.businesses['categoriesenroot'];
         let rootOicker = undefined;
         if(categories) {
             let categoriesWIthBlank = new Array();
             categories.forEach(function (cat) {
                 categoriesWIthBlank.push(cat);
             })
             categoriesWIthBlank.unshift({
                 gid: "",
                 translations:{
                     en:"Select Category"
                 }
             })
             rootOicker = <Picker

                 mode="dropdown"
                 placeholder ="Select Category"
                 style={styles.picker}
                 selectedValue={this.state.categories[0]}
                 onValueChange={this.setCategory.bind( this,0)}>

                 {


                     categoriesWIthBlank.map((s, i) => {
                         return <Item
                             key={i}
                             value={s.gid}
                             label={s.translations.en}/>
                     }) }
             </Picker>
         }

         let props = this.props;
         let stateCategories = this.state.categories;
         let setCategoryFunction = this.setCategory.bind(this);
         let pickers =  this.state.categories.map(function (gid,i) {
             let categories = props.businesses['categoriesen' + gid];
             if(categories && categories.length > 0){
                 let categoriesWIthBlank = new Array();
                 categories.forEach(function (cat) {
                     categoriesWIthBlank.push(cat);
                 })
                 categoriesWIthBlank.unshift({
                     gid: "",
                     translations:{
                         en:"Select Sub Category"
                     }
                 })
                 return <Picker
                     key={i}

                     placeholder ="Select Category"
                     mode="dropdown"
                     style={styles.picker}
                     selectedValue={stateCategories[i+1]}
                     onValueChange={setCategoryFunction.bind(this,i+1)}>

                     {


                         categoriesWIthBlank.map((s, j) => {
                             return <Item
                                 key={j}
                                 value={s.gid}
                                 label={s.translations.en}/>
                         }) }
                 </Picker>
             }
             return undefined;
         })
         return <View>{rootOicker}{pickers}</View>

     }
    async saveFormData(){

         if(!this.state.valid){
              let response = await this.checkAddress();
              if(!response)
                  return;

         }
        this.replaceRoute('home');
        entityUtils.create('businesses',this.state,this.props.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);

    }


     updateFormData(){

         this.replaceRoute('home');
         entityUtils.update('businesses',this.state,this.props.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.props.navigation.state.params.item._id);

     }

     formSuccess(response){
        this.props.onEndReached();

    }

    formFailed(error){
        console.log('failed');
    }
    async pickFromCamera() {
        try {
        let image = await ImagePicker.openCamera({

            cropping: true,
            width:2000,
            height:2000,
            compressImageQuality: 1,
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

                cropping: true,
                width:2000,
                height:2000,
                compressImageQuality: 1,
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


    validateForm(){
        if(!this.state.name){
            return false;
        }
        if(!this.state.city){
            return false;
        }
        if(!this.state.address){
            return false;
        }

        if(!this.state.tax_id){
            return false;
        }
        return true


    }

    chooseAddress(address){
        let city = address.address_components.filter(function (component) {
            return component.types.includes("locality")

        });
        let street =address.address_components.filter(function (component) {
            return component.types.includes("route")

        });

        let street_nummber = address.address_components.filter(function (component) {
            return component.types.includes("street_number")

        });

        let address_string = street[0].long_name;
        if(street_nummber.length > 0){
            address_string = street[0].long_name + ' ' + street_nummber[0].long_name
        }

        this.setState({
            locations:{},
            location:{
                lat:address.geometry.location.lat,
                lng:address.geometry.location.lng,
            },
            city:city[0].long_name,
            address: address_string,
            valid:true,
        })
    }
     keyPad(){
         return true;
     }
    render() {
        let pickers = this.createPickers();



        let image ;
        if(this.state.path){
            image =  <Image
                            style={{width: 120, height: 120}}
                            source={{uri: this.state.path}}
                        />



        }

        let saveButton =  <Button style={{backgroundColor:'#2db6c8'}}
                                  onPress={this.saveFormData.bind(this)}>
                         <Text>Add Business</Text>
        </Button>
        if(this.props.navigation.state.params && this.props.navigation.state.params.item){
            saveButton =  <Button style={{backgroundColor:'#2db6c8'}}
                                  onPress={this.updateFormData.bind(this)}
            >
                <Text>Update Business</Text>
            </Button>

        }

        let buttonView = undefined

        if(!this.validateForm()){
            saveButton =  <Button disabled= {true} style={{backgroundColor:'gray'}}
                               >
                <Text>Add Business</Text>
            </Button>
        }

        if(this.state.showSave){
            buttonView =    <Item  style={{ marginBottom:15 } } regular>

                {saveButton}
            </Item>

        }

        let addressMessage = undefined;
        if(this.state.addressValidation){
            addressMessage = <Text style={{marginLeft:10,color:'red'}}>{this.state.addressValidation}</Text>
        }

        let addressOptions = undefined;

        if(this.state.locations && this.state.locations.length > 0 ){
            let locationFunction = this.chooseAddress.bind(this);
            addressOptions = this.state.locations.map(function (address) {
               return  <TouchableOpacity   style={{height:30,borderTopWidth:0.5,backgroundColor:'white'}}  onPress={() => locationFunction(address)}  regular>

                    <Text style={{ marginLeft: 10,color:'black',fontStyle: 'normal',fontSize:18 }}>{address.formatted_address}</Text>

                </TouchableOpacity>

            })
        }

        return (


                <View  style={styles.business_container}>



                        <View style = {styles.business_upper_container}>
                            <View style = {styles.business_upper_image_container}>

                                {image}
                                <View style={{marginLeft:10,marginTop:60}}>
                                <Button  iconRight transparent  onPress={() => this.pickFromCamera()}>
                                    <Icon name='camera' />

                                </Button>

                                </View>
                                <View style={{marginLeft:0,marginTop:60}}>

                                    <Button  iconRight transparent  onPress={() => this.pickPicture()}>
                                        <Icon2 name='attachment' />

                                    </Button>
                                </View>
                            </View>
                            <View style = {styles.business_upper_name_container}>
                                <Item style={{ marginBottom:6,backgroundColor:'white' } } regular >
                                    <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Bussines Name' />
                                    <Icon style={{color:'red',fontSize:12}}name='star' />


                                </Item>
                                <Item style={{ backgroundColor:'white'} } regular >
                                    <Input value={this.state.email}  blurOnSubmit={true} returnKeyType='next' ref="2"  onSubmitEditing={this.focusNextField.bind(this,"3")}  onChangeText={(email) => this.setState({email})} placeholder='Email' />
                                </Item>
                            </View>
                        </View>
                    <ScrollView contentContainerStyle={styles.contentContainer}>

                    <KeyboardAvoidingView  behavior={'position'} style={styles.avoidView}>


                    {pickers}
                        <Item style={styles.buttom_items} regular >
                           <Input value={this.state.website}  blurOnSubmit={true} returnKeyType='next' ref="3"  onSubmitEditing={this.focusNextField.bind(this,"4")}  onChangeText={(website) => this.setState({website})} placeholder='Website' />

                        </Item>

                        <Item style={styles.buttom_items} regular >
                           <Input value={this.state.city} blurOnSubmit={true} returnKeyType='next' ref="4"  onSubmitEditing={this.focusNextField.bind(this,"5")}  onChangeText={(city) => this.setState({city})} placeholder='City' />
                            <Icon style={{color:'red',fontSize:12}}name='star' />
                        </Item>
                        <Item style={styles.buttom_items} regular >
                           <Input value={this.state.address} blurOnSubmit={true} returnKeyType='next' ref="5"  onSubmitEditing={this.focusNextField.bind(this,"6")}  onChangeText={(address) => this.setState({address})} placeholder='Addresss' />
                            <Icon style={{color:'red',fontSize:12}}name='star' />
                        </Item>
                        {addressMessage}
                        {addressOptions}
                        <Item style={styles.buttom_items} regular >
                           <Input value={this.state.tax_id} blurOnSubmit={true} returnKeyType='done' ref="6"   onChangeText={(tax_id) => this.setState({tax_id})} placeholder='Tax ID' />
                            <Icon style={{color:'red',fontSize:12}}name='star' />
                        </Item>


                        </KeyboardAvoidingView>

                    </ScrollView>
                    {buttonView}

                    </View>




        );

    }
}

export default connect(
    state => ({
        businesses: state.businesses,
        token:state.authentication.token
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
