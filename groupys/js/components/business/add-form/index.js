import React, {Component} from 'react';
import {Image, ScrollView, View,Dimensions} from 'react-native';
import {Button, Container, Content, Fab, Footer, Form, Icon, Input, Item, Picker, Text} from 'native-base';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {AddressInput, CategoryPicker, FormHeader, ImagePicker, TextInput,Spinner} from '../../../ui/index';
import FormUtils from "../../../utils/fromUtils";
const {width, height} = Dimensions.get('window')
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
                country: item.country,
                city: item.city,
                updateMode:true,
                state: '',
                path: item.logo,
                type: item.type,
                images: '',
                tax_id: item.tax_id,
                formID: '12345',
                item:item,
                category: category,
                subcategory: subcategory,
                categories: [Number(category), Number(subcategory)],
                formData: {},
                coverImage: {uri:picture},
            };
        } else {
            this.state = {
                updateMode:false,
                name: '',
                address: '',
                email: '',
                website: '',
                country: 'Israel',
                city: '',
                state: '',
                path: '',
                image: '',
                type: 'SMALL_BUSINESS',
                images: '',
                tax_id: '',
                formID: '12345',
                userId: '',
                category: '',
                subcategory: '',
                categories: [],
                formData: {},
                locations: {},
                location: {}
            };
        }
    }


    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    setCategory(categories) {
        this.setState({
            category: categories[0],
            subcategory: categories[1]
        })
    }

    saveFormData() {
        if (this.validateForm()) {

            this.props.saveBusiness(this.createBusiness(),this.props.navigation);
        }
    }

    createBusiness() {
        let business =  {
            address: this.state.address,
            category: this.state.category,
            subcategory: this.state.subcategory,
            city: this.state.city,
            country: this.state.country,
            image: this.state.coverImage,
            email: this.state.email,
            location: this.state.location,
            name: this.state.name,
            tax_id: this.state.tax_id,
            type: this.state.type,
            website: this.state.website,
            logoImage: this.state.image,
        };
        if(this.state.item){
            business._id = this.state.item._id;
        }
        return business;
    }

    updateFormData() {
        if (this.validateForm()) {
            ;
            this.props.updateBusiness(this.createBusiness(),this.props.navigation);
        }
    }

    updateLocation(location) {
        this.setState({
            location: location.location,
            city: location.city,
            address: location.address,
            country: location.country,
        })
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
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    createImageComponent(coverPic) {
        if (this.state.path) {
            if(coverPic) {
                return <View style={styles.business_upper_image_container}>
                    <ImagePicker  logo ref={"logoImage"} mandatory
                                 image={<Image style={{width: 111, height: 105}} source={{uri: this.state.path}}/>}
                                 color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>

                </View>
            }else{
                return <View style={styles.business_no_pic_upper_image_container}>
                    <ImagePicker logo ref={"logoImage"} mandatory
                                 image={<Image style={{width: 111, height: 105}} source={{uri: this.state.path}}/>}
                                 color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>

                </View>
            }
        } else {
            return <View style={styles.business_no_pic_upper_image_container}>

                <ImagePicker logo ref={"logoImage"} mandatory color='black' pickFromCamera
                             setImage={this.setImage.bind(this)}/>
                <Text>Logo</Text>

            </View>
        }
    }



    createCoverImageComponnent() {
        if (this.state.coverImage) {
            let coverImage = <View>
                <Image
                style={{width:width -10, height: 210,borderWidth:1,borderColor:'white'}}
                source={{uri: this.state.coverImage.uri}}
            >

            </Image>
                {this.createImageComponent(true)}
            </View>
            return <View style={styles.addCoverContainer}>
                <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                             setImage={this.setCoverImage.bind(this)}/>
            </View>
        }
        return <View style={styles.addCoverNoImageContainer}>
            {this.createImageComponent(false)}
            <ImagePicker ref={"coverImage"} mandatory color='white' pickFromCamera
                         setImage={this.setCoverImage.bind(this)}/>
            <Text style={styles.addCoverText}>Add a cover photo</Text>
        </View>
    }

    render() {
        let savveOperation = this.saveFormData.bind(this);
        if(this.state.updateMode){
            savveOperation = this.updateFormData.bind(this);
        }
        return (
            <View style={styles.business_container}>

                <FormHeader disableAction={this.props.saving} showBack submitForm={savveOperation} navigation={this.props.navigation}
                            title={"Add Business"} bgc="#FA8559"/>

                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>

                    <View style={styles.business_upper_container}>
                        <View style={styles.cmeraLogoContainer}>

                            {this.createCoverImageComponnent()}
                        </View>

                        {this.props.saving && <Spinner/>}

                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput  field='Bussines Name' value={this.state.name}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    </View>

                    <View style={styles.inputTextLayour}>
                        <CategoryPicker ref={"picker"} isMandatory categories={this.props.categories}
                                        selectedCategories={this.state.categories}
                                        setFormCategories={this.setCategory.bind(this)}
                                        setCategoriesApi={this.props.fetchBusinessCategories}/>
                    </View>
                    <View style={styles.inputTextLayour}>


                        <TextInput field='Email' value={this.state.email} returnKeyType='next' ref="2" refNext="2"
                                   onSubmitEditing={this.focusNextField.bind(this, "3")}
                                   validateContent={FormUtils.validateEmail}
                                   onChangeText={(email) => this.setState({email})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayour}>

                        <TextInput field='Website' value={this.state.website} returnKeyType='next' ref="3" refNext="3"
                                   onSubmitEditing={this.focusNextField.bind(this, "5")}
                                   validateContent={FormUtils.validateWebsite}
                                   onChangeText={(website) => this.setState({website})} isMandatory={false}/>
                    </View>
                    <AddressInput city={this.state.city} address={this.state.address} country={this.state.country}
                                  refNext="5" ref="5" isMandatory onSubmitEditing={this.updateLocation.bind(this)}/>

                    <View style={styles.inputTextLayour}>

                        <TextInput field='Tax ID' value={this.state.tax_id} returnKeyType='done' ref="6" refNext="6"
                                   onChangeText={(tax_id) => this.setState({tax_id})} isMandatory={true}/>
                    </View>


                </ScrollView>


            </View>
        );
    }
}

export default connect(
    state => ({
        businesses: state.businesses,
        categories: state.businesses.categories,
        token: state.authentication.token,
        saving:state.businesses.savingForm
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
