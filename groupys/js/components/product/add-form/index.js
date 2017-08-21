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

import Autocomplete from 'react-native-autocomplete-input';

import * as productsAction from "../../../actions/product";
import store from 'react-native-simple-store';
import { bindActionCreators } from "redux";
class AddProduct extends Component {



    constructor(props) {
        super(props);
        var milliseconds = (new Date).getTime();
        if(props.navigation.state.params && props.navigation.state.params.item) {
            let item = props.navigation.state.params.item;

            let getCategories = props.fetchProductCategories.bind(this);
            item.category.forEach(function (cat) {
                let categories = props.products['categoriesen' + cat];
                if(!categories ) {
                    getCategories(cat);
                }

            })
            this.state = {
                name:item.name,
                image:'',
                business: item.business,
                info : item.info,
                retail_price: item.retail_price.toString(),
                token:'',
                categories:item.category,
                time:milliseconds,

            };
        }else {
            this.state = {
                name:'',
                image:'',

                info : '',
                retail_price: '',
                token:'',
                categories:[],
                time:milliseconds,

            };
        }
        let stateFunc = this.setState.bind(this);
        this.props.fetchProductCategories("root");

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





    saveFormData(){

        let product = {
            name:this.state.name,
            image:this.state.image,
            business: this.props.navigation.state.params.business._id,
            info : this.state.info,
            retail_price: this.state.retail_price,
            category: this.state.categories,



        }
        entityUtils.create('products',product,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){
        let businessId = undefined;
        if(this.props.navigation.state.params.item){
            businessId = this.props.navigation.state.params.item.business
        }else{
            businessId = this.props.navigation.state.params.business._id;
        }
        this.props.fetchProductsByBusiness(businessId);
        this.replaceRoute('home');
    }


    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }

    updateFormData(){

        let product = {
            name:this.state.name,
            image:this.state.image,
            business: this.props.navigation.state.params.item.business,
            info : this.state.info,
            retail_price: this.state.retail_price,
            category: this.state.categories,




        }
        entityUtils.update('products',product,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.props.navigation.state.params.item._id);
    }

    formFailed(error){
        console.log('failed');
    }
    async pickFromCamera() {
        try {
            let image = await ImagePicker.openCamera({
                cropping: true,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                width:2000,
                height:2000,
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
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                width:2000,
                height:2000,
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
        let reduxxCategories = this.props.products['categoriesen' + category];
        if(!reduxxCategories ) {

            this.props.fetchProductCategories(category);
        }
       this.setState({
           categories: categpries

       })

    }



    createPickers() {
           let categories = this.props.products['categoriesenroot'];
        let rootOicker = undefined;
           if(categories) {
               let categoriesWIthBlank = new Array();
               categories.forEach(function (cat) {
                   categoriesWIthBlank.push(cat);
               })
               categoriesWIthBlank.unshift({
                   gid: "",
                   translations:{
                       en:""
                   }
               })
                rootOicker = <Picker
                   iosHeader="Sub type"
                   mode="dropdown"
                   style={{flex: 1}}
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
            let categories = props.products['categoriesen' + gid];
            if(categories && categories.length > 0){
                let categoriesWIthBlank = new Array();
                categories.forEach(function (cat) {
                    categoriesWIthBlank.push(cat);
                })
                categoriesWIthBlank.unshift({
                    gid: "",
                    translations:{
                        en:""
                    }
                })
                return <Picker
                    key={i}
                    iosHeader="Sub type"
                    mode="dropdown"
                    style={{flex: 1}}
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
    componentDidMount(){
        console.log("mountx")
    }
    render() {

        let image ;
        if(this.state.path){
            image =  <Image
                            style={{width: 50, height: 50}}
                            source={{uri: this.state.path}}
                        />


        }



        let saveButton =  <Button transparent
                                  onPress={this.saveFormData.bind(this)}
        >
            <Text>Add Product</Text>
        </Button>
        if(this.props.navigation.state.params && this.props.navigation.state.params.item){
            saveButton = <Button transparent
                                 onPress={this.updateFormData.bind(this)}
            >
                <Text>Update Product</Text>
            </Button>

        }
        let pickers = this.createPickers();



        return (
            <Container>

                <Content style={{margin:10,backgroundColor: '#fff'}}>
                    {pickers}
                    <Item style={{ margin:3 } } regular >
                        <Input  value={this.state.name}  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item style={{ margin:3 } } regular >
                        <Input value={this.state.info}  blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>


                    <Item style={{ margin:3 } } regular >
                        <Input  value={this.state.retail_price} blurOnSubmit={true} returnKeyType='done' ref="3"   onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Price' />
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
                    {saveButton}

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

