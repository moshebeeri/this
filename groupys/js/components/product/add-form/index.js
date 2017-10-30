import React, {Component} from 'react';
import {Image, ScrollView,Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {
    Button,
    Container,
    Content,
    Footer,
    Header,
    Icon,
    Input,
    InputGroup,
    Item,
    Picker,
    Text,
    View
} from 'native-base';
const {width, height} = Dimensions.get('window')
import * as productsAction from "../../../actions/product";
import * as businessAction from "../../../actions/business";
import {bindActionCreators} from "redux";
import styles from './styles'
import {CategoryPicker, FormHeader, ImagePicker, TextInput} from '../../../ui/index';

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
                retail_price: item.retail_price.toString(),
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

    saveFormData() {
        const {navigation, actions} = this.props;
        this.replaceRoute('home');
        const product = this.createProduct();
        const businessId = this.getBusinessId(navigation);
        actions.saveProduct(product, businessId)
    }

    createProduct() {
        const {navigation} = this.props;
        let product = {
            name: this.state.name,
            image: this.state.coverImage,
            business: this.getBusinessId(navigation),
            info: this.state.info,
            retail_price: this.state.retail_price,
            category: this.state.categories,
        }
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

    setCategory(categories) {
        this.setState({categories: categories});
    }

    setCoverImage(image) {
        this.setState({
            coverImage: image
        })
    }

    createCoverImageComponnent() {
        if (this.state.coverImage) {
            let coverImage = <Image
                style={{ width:width -10, height: 210,borderWidth:1,borderColor:'white'}}
                source={{uri: this.state.coverImage.path}}
            >

            </Image>
            return <View style={styles.product_upper_container}>
                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>
                        <ImagePicker ref={"coverImage"} mandatory image={coverImage} color='white' pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>
                    </View>
                </View>
            </View>
        }
        return <View style={styles.product_upper_container}>
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} mandatory color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    <Text style={styles.addCoverText}>Add a cover photo</Text>
                </View>
            </View>

        </View>
    }

    render() {
        return (
            <View style={styles.product_container}>
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={"Add Product"} bgc="#FA8559"/>
                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>

                    {this.createCoverImageComponnent()}

                    <View style={styles.inputTextLayour}>
                        <TextInput field='Product Name' value={this.state.name}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(name) => this.setState({name})} isMandatory={true}/>
                    </View>

                    <View style={styles.inputTextLayour}>
                        <CategoryPicker ref={"picker"} isMandatory categories={this.props.products.categories}
                                        selectedCategories={this.state.categories}
                                        setFormCategories={this.setCategory.bind(this)}
                                        setCategoriesApi={this.props.actions.setProductCategories}/>
                    </View>
                    <View style={styles.inputTextLayour}>


                        <TextInput field='Description' value={this.state.info} returnKeyType='next' ref="2" refNext="2"
                                   onSubmitEditing={this.focusNextField.bind(this, "6")}

                                   onChangeText={(info) => this.setState({info})}/>
                    </View>

                    <View style={styles.inputTextLayour}>

                        <TextInput field='Price' value={this.state.retail_price} returnKeyType='done' ref="6"
                                   refNext="6"
                                   keyboardType="numeric" placeholder="Price in shekels"
                                   onChangeText={(retail_price) => this.setState({retail_price})} isMandatory={true}/>
                    </View>


                </ScrollView>


            </View>
        );
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

