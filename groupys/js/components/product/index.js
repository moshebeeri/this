import React, {Component} from 'react';
import {connect} from 'react-redux';
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
    Thumbnail,
    Title,
} from 'native-base';
import GenericListManager from '../generic-list-manager/index'
import * as businessAction from "../../actions/business";
import {getBusinessProducts} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import {FormHeader} from '../../ui/index';
import ProductListView from './listView/index'

class Product extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
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
        const {products, navigation, actions, update} = this.props;
        const businessId = navigation.state.params.business._id;
        return (
            <Container style={{flex: -1}}>
                <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                            title={"Add Product"} bgc="white"
                            submitIcon={<Icon5 active color={"#FA8559"} size={25} name="plus"/>}
                            titleColor="#FA8559" backIconColor="#FA8559"/>

                <GenericListManager rows={products[businessId]} navigation={navigation} actions={actions}
                                    update={update}
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
