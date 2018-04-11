import React, {Component} from 'react';
import {Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Button, Container, Content, Footer, Header, Icon, Input, InputGroup, Item, Picker, View} from 'native-base';
import * as productsAction from "../../../actions/product";
import * as businessAction from "../../../actions/business";
import {bindActionCreators} from "redux";
import styles from './styles'
import {BarcodeScanner, CategoryPicker, FormHeader, ImagePicker, Spinner, TextInput, ThisText} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";

const {width, height} = Dimensions.get('window')

class AddProduct extends Component {
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
            let categories = item.category.split(',');
            if (categories.length > 0) {
                categories = categories.filter(catString => catString).map(catString => parseInt(catString));
            }
            this.state = {
                name: item.name,
                coverImage: {path: picture},
                business: item.business,
                info: item.info,
                retail_price: item.retail_price ? item.retail_price.toString() : '',
                SKU: '',
                token: '',
                item: item,
                updateMode: true,
                categories: categories
            };
        } else {
            this.state = {
                name: '',
                coverImage: '',
                info: '',
                retail_price: '',
                SKU: '',
                token: '',
                categories: [],
                updateMode: false,
            };
        }
        props.actions.setProductCategories("root");
    }

    replaceRoute(route) {
        this.props.navigation.goBack();
    }

    componentWillMount() {
        this.props.actions.resetForm()
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

    saveFormData() {
        const {navigation, actions, saving} = this.props;
        if (saving) {
            return
        }
        Keyboard.dismiss();
        const product = this.createProduct();
        if (this.validateForm()) {
            const businessId = this.getBusinessId(navigation);
            actions.saveProduct(product, businessId, navigation)
        }
    }

    createProduct() {
        const {navigation} = this.props;
        let product = {
            name: this.state.name,
            image: this.state.coverImage,
            business: this.getBusinessId(navigation),
            info: this.state.info,
            SKU: this.state.SKU,
            barcode: this.state.barcode,
            retail_price: this.state.retail_price,
            category: this.state.categories,
        };
        if (this.state.item) {
            product._id = this.state.item._id;
        }
        return product;
    }

    getBusinessId(navigation) {
        if (navigation.state.params.item) {
            return navigation.state.params.item.business
        }
        return navigation.state.params.business._id;
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    handleCode(code) {
        this.setState({barcode: code.data})
    }

    setCategory(categories) {
        this.setState({categories: categories});
    }

    setCoverImage(image) {
        this.setState({
            coverImage: image
        })
    }

    openMenu() {
        this.refs["coverImage"].openMenu();
    }

    createCoverImageComponnent() {
        const {saving} = this.props;
        if (this.state.coverImage) {
            let coverImage = <Image
                style={{width: width - 10, height: StyleUtils.relativeHeight(30, 30), borderWidth: 1, borderColor: 'white'}}
                source={{uri: this.state.coverImage.path}}/>;
            return <View style={[styles.product_upper_container, {width: StyleUtils.getWidth()}]}>

                <View style={styles.cmeraLogoContainer}>
                    <View style={styles.addCoverContainer}>
                        <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>
                        {saving && <Spinner/>}
                    </View>
                </View>
            </View>
        }
        return <TouchableOpacity onPress={this.openMenu.bind(this)}
                                 style={[styles.product_upper_container, {width: StyleUtils.getWidth()}]}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"}
                                 text={<ThisText style={styles.addCoverText}>{strings.AddACoverPhoto}</ThisText>}
                                 customStyles={{
                                     triggerWrapper: {
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         width: StyleUtils.getWidth(),
                                         height: StyleUtils.relativeHeight(30, 30),
                                     }
                                 }} mandatory color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={'position'}
                                      style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
                    {this.createView()}
                </KeyboardAvoidingView>
            );
        }
        return (
            <View style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
                {this.createView()}
            </View>
        );
    }

    createView() {
        return <View>
            <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                        title={strings.AddProduct} bgc="#FA8559"/>
            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }} style={styles.contentContainer}>

                {this.createCoverImageComponnent()}

                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.ProductName} value={this.state.name}
                               returnKeyType='next' ref="1" refNext="1"
                               onSubmitEditing={this.focusNextField.bind(this, "2")}
                               onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                </View>



                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>


                    <TextInput field={strings.Description} value={this.state.info} returnKeyType='next' ref="2"
                               refNext="2"
                               onSubmitEditing={this.focusNextField.bind(this, "6")}

                               onChangeText={(info) => this.setState({info})}/>
                </View>

                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.Price} value={this.state.retail_price} returnKeyType='next' ref="6"
                               refNext="6"
                               keyboardType="numeric"
                               onSubmitEditing={this.saveFormData.bind(this)}
                               onChangeText={(retail_price) => this.setState({retail_price})} isMandatory={true}/>
                </View>

                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <TextInput field={strings.SKU} value={this.state.SKU} returnKeyType='next' ref="7"
                               refNext="6"
                               onSubmitEditing={this.saveFormData.bind(this)}
                               onChangeText={(SKU) => this.setState({SKU})}/>
                </View>

                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                    <BarcodeScanner handleCode={this.handleCode.bind(this)} navigation={this.props.navigation}/>
                </View>
                <View style={{height: StyleUtils.scale(30),width: StyleUtils.getWidth()}}></View>

            </ScrollView>
        </View>;
    }

    shouldComponentUpdate() {
        return this.props.currentScreen === 'AddProduct';
    }
}

export default connect(
    state => ({
        products: state.products,
        saving: state.products.savingForm,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(productsAction, dispatch),
        businessAction: bindActionCreators(businessAction, dispatch),
    })
)(AddProduct);

