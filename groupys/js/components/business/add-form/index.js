import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import {Button, Container, Content, Fab, Footer, Form, Icon, Input, Item, Picker} from 'native-base';
import styles from './styles'
import * as businessAction from "../../../actions/business";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {
    AddressInput,
    CategoryPicker,
    DocumentPicker,
    FormHeader,
    ImagePicker,
    Spinner,
    TextInput,
    ThisText
} from '../../../ui/index';
import FormUtils from "../../../utils/fromUtils";
import strings from '../../../i18n/i18n';
import StyleUtils from "../../../utils/styleUtils";

const {height} = Dimensions.get('window');

class AddBusiness extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        let templateBusiness = props.templateBusiness;
        if (props.navigation.state.params && props.navigation.state.params.item) {
            let item = props.navigation.state.params.item;
            let picture = null;
            let source = null;
            if (item.pictures.length > 0 && item.pictures[0].pictures[0]) {
                picture = item.pictures[0].pictures[1];
                source = {uri: picture};
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
                updateMode: true,
                state: '',
                path: item.logo,
                type: item.type,
                images: '',
                tax_id: item.tax_id,
                formID: '12345',
                item: item,
                hideIds: true,
                category: category,
                subcategory: subcategory,
                categories: [Number(category), Number(subcategory)],
                formData: {},
                coverImage: source,
            };
        } else {
            let categories = [];
            if (templateBusiness.category) {
                categories.push(Number(templateBusiness.category))
            }
            if (templateBusiness.subcategory) {
                categories.push(Number(templateBusiness.subcategory))
            }
            let path = '';
            if (templateBusiness.logoImage) {
                if (templateBusiness.logoImage.path) {
                    path = templateBusiness.logoImage.path;
                } else {
                    path = templateBusiness.logoImage.uri;
                }
            }
            let coverPath = '';
            if (templateBusiness.image) {
                if (templateBusiness.image.path) {
                    coverPath = templateBusiness.image.path;
                } else {
                    coverPath = templateBusiness.image.uri;
                }
            }
            this.state = {
                hideIds: false,
                updateMode: false,
                name: templateBusiness.name,
                address: templateBusiness.address,
                email: templateBusiness.email,
                website: templateBusiness.website,
                country: 'Israel',
                city: templateBusiness.city,
                state: '',
                path: path,
                image: templateBusiness.logoImage,
                coverImage: templateBusiness.image,
                coverPath: coverPath,
                type: 'SMALL_BUSINESS',
                images: '',
                tax_id: templateBusiness.tax_id,
                formID: '12345',
                userId: '',
                category: templateBusiness.category,
                subcategory: templateBusiness.subcategory,
                categories: categories,
                formData: {},
                locations: {},
                location: templateBusiness.location,
                IdIdentifierImage: templateBusiness.IdIdentifierImage,
                LetterOfIncorporationImage: templateBusiness.LetterOfIncorporationImage,
            };
        }
    }

    componentWillMount() {
        this.props.resetSave();
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
        this.setReduxState({
            category: categories[0],
            subcategory: categories[1]
        })
    }

    saveFormData() {
        let formIsValid = this.validateForm(this.saveFormData.bind(this));
        Keyboard.dismiss();
        if (formIsValid) {
            this.props.saveBusiness(this.createBusiness(), this.props.navigation);
        }
    }

    createBusiness() {
        let business = {
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
            IdIdentifierImage: this.state.IdIdentifierImage,
            LetterOfIncorporationImage: this.state.LetterOfIncorporationImage
        };
        if (this.state.item) {
            business._id = this.state.item._id;
        }
        return business;
    }

    async setReduxState(value) {
        await this.setState(value);
        if (value.name) {
            return;
        }
        if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.updating) {
            return;
        }
        if (value.website) {
            return;
        }
        if (value.email) {
            return;
        }
        if (value.tax_id) {
            return;
        }
        let partialBusiness = this.createBusiness();
        this.props.saveBusinessTemplate(partialBusiness);
    }

    updateFormData() {
        if (this.validateForm(this.updateFormData.bind(this))) {
            this.props.updateBusiness(this.createBusiness(), this.props.navigation);
        }
    }

    updateLocation(location) {
        this.setReduxState({
            location: location.location,
            city: location.city,
            address: location.address,
            country: location.country,
        })
    }

    setImage(image) {
        this.setReduxState({
            image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            path: image.path
        });
    }

    setCoverImage(image) {
        this.setReduxState({
            coverImage: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            coverPath: image.path
        });
    }

    dismissKyeboard() {
        Keyboard.dismiss();
    }

    validateForm(onValid) {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid(onValid)) {
                result = false;
            }
        });
        return result
    }

    setIdDocument(image) {
        this.setReduxState({
            IdIdentifierImage: image
        })
    }

    setLetterDocument(image) {
        this.setReduxState({
            LetterOfIncorporationImage: image
        })
    }

    createImageComponent(coverPic) {
        if (this.state.path) {
            if (coverPic) {
                return <View onPress={this.openLogoMenu.bind(this)} style={styles.business_upper_image_container}>
                    <ImagePicker logo name={"logoImage"} ref={"logoImage"} mandatory
                                 image={<Image resizeMode="cover" style={{width:  StyleUtils.scale(111), height:  StyleUtils.scale(105)}}
                                               source={{uri: this.state.path}}/>}
                                 color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>

                </View>
            } else {
                return <View style={styles.business_no_pic_no_cover_upper_image_container}>
                    <ImagePicker logo name={"logoImage"} ref={"logoImage"} mandatory
                                 image={<Image resizeMode="cover" style={{width:  StyleUtils.scale(111), height:  StyleUtils.scale(105)}}
                                               source={{uri: this.state.path}}/>}
                                 color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>

                </View>
            }
        } else {
            if (coverPic) {
                return <TouchableOpacity onPress={this.openLogoMenu.bind(this)}
                                         style={styles.business_no_pic_upper_image_container}>

                    <ImagePicker logo name={"logoImage"} ref={"logoImage"} mandatory color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>
                    <ThisText>{strings.Logo}</ThisText>

                </TouchableOpacity>
            } else {
                return <TouchableOpacity onPress={this.openLogoMenu.bind(this)}
                                         style={styles.business_no_pic_no_cover_upper_image_container}>

                    <ImagePicker logo name={"logoImage"} ref={"logoImage"} mandatory color='black' pickFromCamera
                                 setImage={this.setImage.bind(this)}/>
                    <ThisText>{strings.Logo}</ThisText>

                </TouchableOpacity>
            }
        }
    }

    openLogoMenu() {
        this.refs["logoImage"].openMenu();
    }

    openoMenu() {
        this.refs["coverImage"].openMenu();
    }

    createCoverImageComponent() {
        if (this.state.coverImage) {
            let coverImage =
                <View>
                    <Image
                        resizeMode="cover"
                        style={{width: StyleUtils.getWidth(), height: StyleUtils.relativeHeight(30,30), alignSelf: 'stretch', borderColor: 'white'}}
                        source={{uri: this.state.coverImage.uri}}
                    >

                    </Image>
                    {this.createImageComponent(true)}
                </View>;
            return (
                <View style={styles.addCoverContainer}>
                    <ImagePicker name={"coverImage"} ref={"coverImage"} mandatory image={coverImage} color='white'
                                 pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                </View>)
        }
        return (
            <TouchableOpacity onPress={this.openoMenu.bind(this)} style={styles.addCoverNoImageContainer}>
                {this.createImageComponent(false)}
                <ImagePicker name={"coverImage"} ref={"coverImage"} mandatory color='white' pickFromCamera
                             setImage={this.setCoverImage.bind(this)}/>
                <ThisText style={styles.addCoverText}>{strings.AddACoverPhoto}</ThisText>
            </TouchableOpacity>)
    }

    render() {
        let saveOperation = this.state.updateMode ? this.updateFormData.bind(this) : this.saveFormData.bind(this);
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={'position'}
                                      style={[styles.business_container, {width: StyleUtils.getWidth()}]}>

                    {this.createView(saveOperation)}

                </KeyboardAvoidingView>
            );
        }
        return (
            <View
                style={[styles.business_container, {width: StyleUtils.getWidth()}]}>

                {this.createView(saveOperation)}

            </View>
        );
    }

    createView(saveOperation) {
        return <View>
            <FormHeader disableAction={this.props.saving} showBack submitForm={saveOperation}
                        navigation={this.props.navigation}
                        title={strings.AddBusiness} bgc="#FA8559"/>

            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }} style={[styles.contentContainer, {width: StyleUtils.getWidth()}]}>

                <View style={[styles.business_upper_container, {width: StyleUtils.getWidth()}]}>
                    <View style={[styles.cmeraLogoContainer, {width: StyleUtils.getWidth()}]}>

                        {this.createCoverImageComponent()}
                    </View>


                </View>
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.BusinessName} value={this.state.name}
                               returnKeyType='next' ref="1" refNext="1"
                               onSubmitEditing={this.focusNextField.bind(this, "2")}
                               onChangeText={(name) => this.setReduxState({name})} isMandatory={true}/>
                </View>

                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <CategoryPicker ref={"picker"} isMandatory categories={this.props.categories}
                                    selectedCategories={this.state.categories}
                                    setFormCategories={this.setCategory.bind(this)}
                                    setCategoriesApi={this.props.fetchBusinessCategories}/>
                </View>
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>


                    <TextInput keyboardType={'email-address'} field={strings.Email} value={this.state.email}
                               returnKeyType='next' ref="2"
                               refNext="2"
                               placeholder={strings.validateByEmail}
                               onSubmitEditing={this.focusNextField.bind(this, "3")}
                               validateContent={FormUtils.validateEmail}
                               onChangeText={(email) => this.setReduxState({email})} isMandatory={true}/>
                </View>
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.Website} value={this.state.website} returnKeyType='next' ref="3"
                               refNext="3"

                               onSubmitEditing={this.focusNextField.bind(this, "5")}
                               validateContent={FormUtils.validateWebsite}
                               onChangeText={(website) => this.setReduxState({website})} isMandatory={false}/>
                </View>
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    <AddressInput city={this.state.city} address={this.state.address} country={this.state.country}
                                  refNext="5" ref="5" isMandatory onSubmitEditing={this.updateLocation.bind(this)}/>
                </View>
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.TaxID} value={this.state.tax_id} returnKeyType='next' ref="6"
                               refNext="6"
                               onSubmitEditing={this.dismissKyeboard.bind(this)}
                               onChangeText={(tax_id) => this.setReduxState({tax_id})} isMandatory={true}/>
                </View>

                {!this.state.hideIds && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <DocumentPicker value={this.state.IdIdentifierImage} ref="id" isMandatory
                                    field={strings.IdIdentifier}
                                    setDocument={this.setIdDocument.bind(this)}/>

                </View>}
                {!this.state.hideIds && <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <DocumentPicker value={this.state.LetterOfIncorporationImage} ref="LetterOfIncorporation"
                                    isMandatory field={strings.LetterOfIncorporation}
                                    setDocument={this.setLetterDocument.bind(this)}/>

                </View>}

            </ScrollView>

            {this.props.saving && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: StyleUtils.getWidth(),
                opacity: 0.7,
                height: height,
                top: 40,
                backgroundColor: 'white'
            }}>
                <Spinner/>
            </View>}
        </View>;
    }

    shouldComponentUpdate() {
        return this.props.currentScreen === 'addBusiness';
    }
}

export default connect(
    state => ({
        businesses: state.businesses,
        categories: state.businesses.categories,
        token: state.authentication.token,
        saving: state.businesses.savingForm,
        currentScreen: state.render.currentScreen,
        network: state.network,
        templateBusiness: state.businesses.templateBusiness,
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(AddBusiness);
