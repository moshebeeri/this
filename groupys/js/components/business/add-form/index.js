import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    TouchableHighlight
} from 'react-native';



import {Picker,Item} from 'native-base';

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

        <ScrollView style={styles.container}>
            <View style={styles.itemborder}>
                <View style={styles.item}>
                <Picker

                    iosHeader="Select one"
                    mode="dropdown"

                    selectedValue={this.state.type}

                    onValueChange={this.selectType.bind(this)}>
                    <Item label="Small Business" value="SMALL_BUSINESS" />
                    <Item label="Personal Services" value="PERSONAL_SERVICES" />
                    <Item label="Company" value="COMPANY" />
                    <Item label="Enterprise" value="ENTERPRISE" />


                </Picker>
                </View>
            </View>
            <View style={styles.itemborder}>

                <TextInput
                    style={styles.item}

                    onSubmitEditing={this.focusNextField.bind(this,"2")}
                    placeholder="Name"
                    returnKeyType='next'
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                />
            </View>
            <View style={styles.itemborder}>

                <TextInput  style={styles.item}
                            placeholder="Email"
                            returnKeyType='next'
                            onChangeText={(email) => this.setState({email})}
                            onSubmitEditing={this.focusNextField.bind(this,"3")}

                            value={this.state.email}
                            ref="2"
                />
            </View>
            <View style={styles.itemborder}>

                <TextInput  style={styles.item}
                            placeholder="WebSite"
                            returnKeyType='next'
                            onChangeText={(website) => this.setState({website})}
                            onSubmitEditing={this.focusNextField.bind(this,"4")}

                            value={this.state.website}
                            ref="3"
                />
            </View>
            {/*<View style={styles.itemborder}>*/}

                {/*<TextInput  style={styles.item}*/}
                            {/*placeholder="Country"*/}
                            {/*returnKeyType='next'*/}
                            {/*onChangeText={(country) => this.setState({country})}*/}
                            {/*onSubmitEditing={this.focusNextField.bind(this,"5")}*/}

                            {/*value={this.state.country}*/}
                            {/*ref="4"*/}
                {/*/>*/}
            {/*</View>*/}
            {/*<View style={styles.itemborder}>*/}

                {/*<TextInput  style={styles.item}*/}
                            {/*placeholder="State"*/}
                            {/*returnKeyType='next'*/}
                            {/*onChangeText={(state) => this.setState({state})}*/}
                            {/*onSubmitEditing={this.focusNextField.bind(this,"6")}*/}

                            {/*value={this.state.state}*/}
                            {/*ref="5"*/}
                {/*/>*/}
            {/*</View>*/}
            <View style={{ paddingLeft:18,flexDirection: 'row'}}>
                <View style={styles.itemborder}>

                    <TextInput  style={styles.shortItem}
                                placeholder="City"
                                returnKeyType='next'
                                onChangeText={(city) => this.setState({city})}
                                onSubmitEditing={this.focusNextField.bind(this,"6")}

                                value={this.state.city}
                                ref="4"
                    />
                </View>
                <View style={styles.itemborder}>

                    <TextInput  style={styles.shortItem}
                                placeholder="Address"
                                returnKeyType='next'
                                onChangeText={(address) => this.setState({address})}
                                onSubmitEditing={this.focusNextField.bind(this,"7")}

                                value={this.state.address}
                                ref="6"
                    />
                </View>
            </View>
            <View style={styles.itemborder}>

                <TextInput  style={styles.item}
                            placeholder="Tax id"
                            returnKeyType='done'
                            onChangeText={(tax_id) => this.setState({tax_id})}

                            value={this.state.tax_id}
                            ref="7"

                />
            </View>
            <View style = {styles.buttonsBorder}>
                <View style = {styles.buttonsBorder}>
                    <TouchableOpacity success  style={styles.buttons}
                                      onPress={() => this.pickPicture()}>
                        <Text style={styles.text}> Take Picture </Text>

                    </TouchableOpacity>

                </View>
                <View style = {styles.buttonsBorder}>
                    <TouchableOpacity success  style={styles.buttons}
                                      onPress={() => this.pickFromCamera()}>
                        <Text style={styles.text}> Pic Picture </Text>

                    </TouchableOpacity>

                </View>
            </View>
            <View style = {styles.buttonsBorder}>
                <TouchableOpacity success  style={styles.addButton}
                                  onPress={() => this.saveFormData()}>
                    <Text style={styles.addButtonText}> Add Bussiness </Text>

                </TouchableOpacity>

            </View>


        </ScrollView>



        );
    }
}
//
// <Container>
//
//
//     <Content  style={{backgroundColor: '#fff'}}>
//         <Form>

//             <Item underline>
//                 <Input  blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} autoFocus = {true} onChangeText={(name) => this.setState({name})} placeholder='Name' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="2"  onSubmitEditing={this.focusNextField.bind(this,"3")}  onChangeText={(email) => this.setState({email})} placeholder='Email' />
//             </Item>
//
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="3"  onSubmitEditing={this.focusNextField.bind(this,"4")}  onChangeText={(website) => this.setState({website})} placeholder='Website' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="4"  onSubmitEditing={this.focusNextField.bind(this,"5")}  onChangeText={(country) => this.setState({country})} placeholder='Country' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="5"  onSubmitEditing={this.focusNextField.bind(this,"6")}  onChangeText={(state) => this.setState({state})} placeholder='State' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="6"  onSubmitEditing={this.focusNextField.bind(this,"7")}  onChangeText={(city) => this.setState({city})} placeholder='City' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='next' ref="7"  onSubmitEditing={this.focusNextField.bind(this,"8")}  onChangeText={(address) => this.setState({address})} placeholder='Addresss' />
//             </Item>
//             <Item underline>
//                 <Input blurOnSubmit={true} returnKeyType='done' ref="8"   onChangeText={(tax_id) => this.setState({tax_id})} placeholder='Tax ID' />
//             </Item>
//
//
//             <View style={{ flexDirection: 'row',marginTop:5 }}>
//
//                 <Button   transparent  onPress={() => this.pickPicture()}>
//                     <Text> select image </Text>
//                 </Button>
//
//                 {image}
//             </View>
//             <View style={{ flexDirection: 'row',marginTop:5 }}>
//
//                 <Button   transparent  onPress={() => this.pickFromCamera()}>
//                     <Text> take picture </Text>
//                 </Button>
//
//                 {image}
//             </View>
//
//
//
//
//
//         </Form>
//
//
//     </Content>
//     <Footer>
//
//         <Button transparent
//                 onPress={this.saveFormData.bind(this)}
//         >
//             <Text>Add Business</Text>
//         </Button>
//     </Footer>
// </Container>
export default connect(
    state => ({
        businesses: state.businesses
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
