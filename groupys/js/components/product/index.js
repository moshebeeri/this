import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Platform, TouchableOpacity} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Fab,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Spinner,
    Thumbnail,
    Title
} from 'native-base';
import GenericListManager from '../generic-list-manager/index'
import * as businessAction from "../../actions/business";
import {getBusinessProducts} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import {FormHeader} from '../../ui/index';
import Icon3 from 'react-native-vector-icons/Ionicons';
import ProductListView from './listView/index'
import strings from "../../i18n/i18n"

class Product extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setBusinessProducts();
    }

    setBusinessProducts() {
        const {actions, navigation} = this.props;
        actions.setBusinessProducts(navigation.state.params.business._id);
    }

    renderItem(item) {
        const {navigation} = this.props;
        return <ProductListView item={item.item} index={item.index} navigation={navigation}/>
    }

    navigateToAdd() {
        const {navigation} = this.props;
        navigation.navigate("AddProduct", {business: navigation.state.params.business});
    }

    render() {
        const {products, navigation, actions, update, productsLoading} = this.props;
        const businessId = navigation.state.params.business._id;
        let icon = <Icon5 active color={"#FA8559"} size={25} name="plus"/>
        if (Platform.OS === 'ios') {
            icon = <Icon3 active color={"#FA8559"} size={25} name="ios-add"/>;
        }
        return (
            <Container style={{flex: -1}}>
                <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                            title={strings.AddProduct} bgc="white"
                            submitIcon={icon}
                            titleColor="#FA8559" backIconColor="#FA8559"/>
                {!productsLoading[businessId] && <Spinner/>}
                <GenericListManager rows={products[businessId]} navigation={navigation} actions={actions}
                                    update={update}
                                    onEndReached={this.setBusinessProducts.bind(this)}
                                    ItemDetail={this.renderItem.bind(this)}/>

            </Container>
        );
    }


    shouldComponentUpdate() {
        if (this.props.currentScreen === 'Products') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        products: getBusinessProducts(state),
        update: state.businesses.update,
        productsLoading: state.products.loadingDone,
        productsChange: state.products,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Product);
