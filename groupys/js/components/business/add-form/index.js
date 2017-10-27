import React, {Component} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Button, Container, Content, Fab, Footer, Form, Icon, Input, Item, Picker, Text} from 'native-base';
import EntityUtils from "../../../utils/createEntity";
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import BusinessApi from '../../../api/business'
import {CategoryPicker, DynamicMessage, FormHeader, ImagePicker, TextInput} from '../../../ui/index';
import FormUtils from "../../../utils/fromUtils";

let entityUtils = new EntityUtils();
let businessApi = new BusinessApi();

class AddBusiness extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        if (props.navigation.state.params && props.navigation.state.params.item) {
            let item = props.navigation.state.params.item;
            let picture = undefined;
            if (item.pictures.length > 0 && item.pictures[0].pictures[1]) {
                picture = item.pictures[0].pictures[1]
            }
            let category = item.category;
            if (!category) {
                category = '0';
            }
            let subcategory = item.subcategory;
            if (!subcategory) {
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
                category: category,
                subcategory: subcategory,
                categories: [Number(category), Number(subcategory)],
                formData: {},
                active: false,
                showSave: true,
                addressValidation: '',
                coverImage: '',
                valid: true,
            };
        } else {
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
                category: '',
                subcategory: '',
                categories: [],
                formData: {},
                active: false,
                showSave: true,
                locations: {},
                location: {},
                valid: false,
            };
        }
    }

    replaceRoute(route) {
        this.props.navigation.goBack();
    }

    focusNextField(nextField) {
        if (nextField == '6') {
            this.checkAddress()
        }
        this.refs[nextField].focus()
    }

    selectType(value) {
        this.setState({
            type: value
        })
    }

    setCategory(index, category) {
        var milliseconds = (new Date).getTime();
        if (milliseconds - this.state.time < 1000) {
            return;
        }
        if (!category) {
            return;
        }
        let categpries = this.state.categories;
        if (categpries.length <= index) {
            categpries.push(category);
        } else {
            let newCategories = new Array();
            for (i = 0; i + 1 <= index; i++) {
                newCategories.push(categpries[i]);
            }
            categpries = newCategories
            categpries.push(category);
        }
        let reduxxCategories = this.props.categories['en'][category];
        if (!reduxxCategories) {
            this.props.fetchBusinessCategories(category);
        }
        this.setState({
            categories: categpries
        })
        if (categpries.length == 1) {
            this.setState({
                category: categpries[0]
            })
        }
        if (categpries.length == 2) {
            this.setState({
                category: categpries[0],
                subcategory: categpries[1]
            })
        }
    }

    async checkAddress() {
        this.setState({
            addressValidation: '',
            locations: {}
        })
        let address = {
            city: this.state.city,
            address: this.state.address,
            country: 'israel',
        }
        let response = await businessApi.checkAddress(address, this.props.token)
        if (!response.valid) {
            this.setState({
                addressValidation: response.message
            })
            this.focusNextField("4")
            return false;
        }
        if (response.results) {
            this.setState({
                locations: response.results
            })
            return false;
        } else {
            this.setState({
                valid: true,
                location: {
                    lat: response.lat,
                    lng: response.lng
                }
            })
        }
        return true;
    }

    saveFormData() {
        if (this.validateForm()) {
            this.replaceRoute('home');
            this.props.saveBusiness(this.createBusiness());
        }
    }


    createBusiness(){
        return {
            address: this.state.address,
            category: this.state.category,
            subcategory: this.state.subcategory,
            city:this.state.city,
            country:this.state.country,
            image:this.state.coverImage,
            email:this.state.email,
            location: this.state.location,
            name:this.state.name,
            tax_id:this.state.tax_id,
            type:this.state.type,
            website:this.state.website,
            logoImage:this.state.image,
        }

    }
    updateFormData() {
        this.replaceRoute('home');
        this.props.updateBusiness(this.createBusiness());
    }



    setImage(image) {
        this.setState({
            image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            path: image.path
        });
    }

    setCoverImage(image) {
        this.setState({
            coverImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            coverPath: image.path
        });
    }

    validateForm() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    chooseAddress(address) {
        let city = address.address_components.filter(function (component) {
            return component.types.includes("locality")
        });
        let street = address.address_components.filter(function (component) {
            return component.types.includes("route")
        });
        let street_nummber = address.address_components.filter(function (component) {
            return component.types.includes("street_number")
        });
        let address_string = street[0].long_name;
        if (street_nummber.length > 0) {
            address_string = street[0].long_name + ' ' + street_nummber[0].long_name
        }
        this.setState({
            locations: {},
            location: {
                lat: address.geometry.location.lat,
                lng: address.geometry.location.lng,
            },
            city: city[0].long_name,
            address: address_string,
            valid: true,
        })
    }

    keyPad() {
        return true;
    }

    locationToString(location) {
        return location.formatted_address;
    }

    validateAddress() {
        return !(this.state.locations && this.state.locations.length > 0)
    }

    createImageComponent() {
        if (this.state.path) {
            return <View style={styles.business_upper_image_container}>
                <ImagePicker  ref={"logoImage"}  mandatory image= {<Image style={{width: 120, height: 120}} source={{uri: this.state.path}}/>}
                              color='black' pickFromCamera
                              setImage={this.setImage.bind(this)}/>

            </View>
        } else {
            return <View style={styles.business_upper_image_container}>

                <ImagePicker ref={"logoImage"} mandatory color='black' pickFromCamera
                             setImage={this.setImage.bind(this)}/>
                <Text>Logo</Text>

            </View>
        }
    }

    createCoverImageComponnent(){
        if (this.state.coverImage) {
            let  coverImage = <Image
                style={{width: 200,borderWidth:1, borderColor:'white',height: 110}}
                source={{uri: this.state.coverImage.uri}}
            />

            return <View style={styles.addCoverContainer}>
                <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                             setImage={this.setCoverImage.bind(this)}/>
            </View>

        }
        return <View style={styles.addCoverNoImageContainer}>
            <ImagePicker ref={"coverImage"} mandatory color='white' pickFromCamera
                         setImage={this.setCoverImage.bind(this)}/>
            <Text style={styles.addCoverText}>Add a cover photo</Text>
        </View>
    }

    render() {

        let addressMessage = undefined;
        if (this.state.addressValidation) {
            addressMessage = <Text style={{marginLeft: 10, color: 'red'}}>{this.state.addressValidation}</Text>
        }
        let addressOptions = undefined;
        if (this.state.locations && this.state.locations.length > 0) {
            addressOptions =
                <DynamicMessage messagesObject={this.state.locations} messageToString={this.locationToString.bind(this)}
                                onMessage={this.chooseAddress.bind(this)}/>
        }
        return (
            <View style={styles.business_container}>
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={"Add Business"} bgc="#FA8559"/>
                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>
                    <View style={styles.business_upper_container}>
                        <View style={styles.cmeraLogoContainer}>
                            {this.createImageComponent()}
                            {this.createCoverImageComponnent()}
                        </View>

                        <View style={styles.inputTextLayour}>
                            <TextInput fieldColor='white' field='Bussines Name' value={this.state.name}
                                       returnKeyType='next' ref="1" refNext="1"
                                       onSubmitEditing={this.focusNextField.bind(this, "2")}
                                       onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                        </View>

                    </View>

                    <View style={styles.inputTextLayour}>
                        <CategoryPicker ref={"picker"} isMandatory categories={this.props.categories}
                                        selectedCategories={this.state.categories}
                                        setCategory={this.setCategory.bind(this)}/>
                    </View>
                    <View style={styles.inputTextLayour}>


                        <TextInput field='Email' value={this.state.email} returnKeyType='next' ref="2" refNext="2"
                                   onSubmitEditing={this.focusNextField.bind(this, "3")}
                                   validateContent={FormUtils.validateEmail}
                                   onChangeText={(email) => this.setState({email})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayour}>

                        <TextInput field='Website' value={this.state.website} returnKeyType='next' ref="3" refNext="3"
                                   onSubmitEditing={this.focusNextField.bind(this, "4")}
                                   validateContent={FormUtils.validateWebsite}
                                   onChangeText={(website) => this.setState({website})} isMandatory={false}/>
                    </View>
                    <View style={styles.inputTextLayour}>

                        <TextInput field='City' value={this.state.city} returnKeyType='next' ref="4" refNext="4"
                                   onSubmitEditing={this.focusNextField.bind(this, "5")}
                                   validateContent={this.validateAddress.bind(this)}
                                   onChangeText={(city) => this.setState({city})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayour}>

                        <TextInput field='Addresss' value={this.state.address} returnKeyType='next' ref="5" refNext="5"
                                   onSubmitEditing={this.focusNextField.bind(this, "6")}
                                   validateContent={this.validateAddress.bind(this)}
                                   onChangeText={(address) => this.setState({address})} isMandatory={true}/>
                    </View>

                    {addressMessage}
                    {addressOptions}
                    <View style={styles.inputTextLayour}>

                        <TextInput field='Tax ID' value={this.state.tax_id} returnKeyType='done' ref="6" refNext="6"
                                   onChangeText={(tax_id) => this.setState({tax_id})} isMandatory={true}/>
                    </View>


                </ScrollView>


            </View>



        )
            ;
    }
}

export default connect(
    state => ({
        businesses: state.businesses,
        categories: state.businesses.categories,
        token: state.authentication.token
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
