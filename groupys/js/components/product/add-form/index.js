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

import AddProductHeader from './header';

var createEntity = require("../../../utils/createEntity");

import ImagePicker from 'react-native-image-crop-picker';
import store from 'react-native-simple-store';
import BusinessApi from "../../../api/business"

const {
    replaceAt,
} = actions;

let businessApi = new BusinessApi();
class AddProduct extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


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
        store.get('user_id').then(storeUserId => {
            stateFunc({
                userId: storeUserId
                }
            );
        });
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
        this.props.replaceAt('add-product', {key: route}, this.props.navigation.key);
    }



    initBusiness(responseData){

        this.setState({
            services: responseData,
            business: responseData[0]._id
        });
    }


    saveFormData(){


        createEntity('products',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){

        this.replaceRoute('product');
    }

    selectBusiness(value){
        this.setState({
            business:value
        })


    }


    formFailed(error){
        console.log('failed');
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
                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <AddProductHeader />
                </Header>

                <Content  style={{backgroundColor: '#fff'}}>

                    <Item underline>
                        <Input onChangeText={(name) => this.setState({name})} placeholder='Name' />
                    </Item>
                    <Item underline>
                        <Input onChangeText={(info) => this.setState({info})} placeholder='Description' />
                    </Item>


                    <Item underline>
                        <Input onChangeText={(retail_price) => this.setState({retail_price})} placeholder='Price' />
                    </Item>

                    {pikkerTag}

                    <View style={{ flexDirection: 'row',marginTop:5 }}>

                        <Button   transparent  onPress={() => this.pickSingle(true)}>
                            <Text> select image </Text>
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


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(AddProduct);
