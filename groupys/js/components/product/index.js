import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Fab,
    Text,
    Title,
    InputGroup,
    Input,
    Button,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';
import GenericListView from '../generic-list-manager/generic-list-view/index'
import GenericListManager from '../generic-list-manager/index'
import Icon from 'react-native-vector-icons/EvilIcons';
import * as businessAction from "../../actions/business";
import {getBusinessProducts} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles'
class Product extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setBusinessProducts();
    }

    setBusinessProducts() {
        const {actions, navigation,business} = this.props;
        actions.setBusinessProducts(business);
    }

    renderItem(item) {
        const {navigation} = this.props;
        return <GenericListView
            item={item.item}
            index={item.index}
            addform={"AddProduct"}
            navigation={navigation}
        />
    }

    navigateToAdd() {
        const { navigation,business} = this.props;

       navigation.navigate("AddProduct", {business: business});
    }

    render() {
        const {products, navigation, actions, update,business} = this.props;
        const businessId = business._id;
        return (
            <Container style={{flex: -1}}>
                <View style={styles.addProductContainer}>
                    <TouchableOpacity style={styles.addProductButton}
                                      onPress={this.navigateToAdd.bind(this)}>
                        <Icon2 active color={"#FA8559"} size={18} name="plus"/>
                        <Text style={styles.addProductTextStyle}>Add product</Text>
                    </TouchableOpacity>
                </View>
                <GenericListManager rows={products[businessId]} navigation={navigation} actions={actions} update={update}
                                    onEndReached={this.setBusinessProducts.bind(this)}
                                    ItemDetail={this.renderItem.bind(this)}/>

            </Container>
        );
    }
}

export default connect(
    state => ({
        products: getBusinessProducts(state),
        update: state.businesses.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Product);
