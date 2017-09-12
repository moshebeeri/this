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


import ImagePicker from 'react-native-image-crop-picker';



import * as productsAction from "../../../actions/product";
import * as businessAction from "../../../actions/business";

import { bindActionCreators } from "redux";
class AddProduct extends Component {



    constructor(props) {
        super(props);
        const milliseconds = (new Date).getTime();
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
        props.actions.setProductCategories("root");


    }





    replaceRoute(route) {
        this.props.navigation.goBack();
    }





    saveFormData(){
        this.replaceRoute('home');
        const{actions} = this.props;
        const product = this.createProduct();
        actions.saveProduct(product,this.formSuccess.bind(this),this.formFailed.bind(this))

    }

    createProduct() {
        return {
            name: this.state.name,
            image: this.state.image,
            business: this.props.navigation.state.params.business._id,
            info: this.state.info,
            retail_price: this.state.retail_price,
            category: this.state.categories,


        }

    }

    formSuccess(response){

        const{businessAction,navigation} = this.props;
        const businessId = this.getBusinessId(navigation);
        businessAction.setBusinessProducts(businessId);

    }

    getBusinessId(navigation) {
        if (navigation.state.params.item) {
            return navigation.state.params.item.business
        }return navigation.state.params.business._id;
    }


    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }

    updateFormData(){
        const{actions,navigation} = this.props;
        const product = this.createProduct();
        actions.updateProduct(product,this.formSuccess.bind(this),this.formFailed.bind(this),navigation.state.params.item._id)
     }

    formFailed(error){
        //TODO send netwwork failed event
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
        const{actions} = this.props;
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

            actions.setProductCategories(category);
        }
       this.setState({
           categories: categpries

       })

    }



    createPickers() {
        const categories = this.props.products['categoriesenroot'];
        let rootPiker = undefined;
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
               rootPiker = <Picker
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

        const props = this.props;
        const stateCategories = this.state.categories;
        const setCategoryFunction = this.setCategory.bind(this);
        const pickers =  this.state.categories.map(function (gid,i) {
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
      return <View>{rootPiker}{pickers}</View>

    }

    render() {
        const{navigation} = this.props;
        const image = this.createImageTag();
        const saveButton = this.createSaveButtonTag(navigation.state.params.item);
        const pickers = this.createPickers();



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

    createImageTag() {

        if (this.state.path) {
            return <Image
                style={{width: 50, height: 50}}
                source={{uri: this.state.path}}
            />


        }
        return undefined;
    }

    createSaveButtonTag(item) {

        if (item) {
           return <Button transparent
                                 onPress={this.updateFormData.bind(this)}
            >
                <Text>Update Product</Text>
            </Button>

        }
        return <Button transparent
                       onPress={this.saveFormData.bind(this)}
        >
            <Text>Add Product</Text>
        </Button>;
    }
}


export default connect(
    state => ({
        products: state.products,

    }),

    (dispatch) => ({
        actions: bindActionCreators(productsAction, dispatch),
        businessAction: bindActionCreators(businessAction, dispatch),

    })
)(AddProduct);

