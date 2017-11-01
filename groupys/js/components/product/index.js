import React, {Component} from 'react';
import {TouchableOpacity,ScrollView,View} from 'react-native';
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
    Text,
    Thumbnail,
    Title,

} from 'native-base';
import GenericListManager from '../generic-list-manager/index'
import * as businessAction from "../../actions/business";
import {getBusinessProducts} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles'
import RowUtils from "../../utils/rowUtils";

class Product extends Component {
    constructor(props) {
        super(props);
    }



    setBusinessProducts() {
        const {actions, navigation, business} = this.props;
        actions.setBusinessProducts(business._id);
    }

    renderItem(item) {
        const {navigation} = this.props;
        let row = item.map(item => {return this.createItemView(item)} )
        return <View key={item[0]._id} style={{flexDirection:'row'}}>{row}</View>

    }


    createItemView(item){
        if (item.pictures && item.pictures.length > 0) {
            return <TouchableOpacity key={item._id} style={{width:70, height:70}} onPress={this.navigateToEdit.bind(this,item)}>
                <Thumbnail square medium source={{uri: item.pictures[0].pictures[3]}}/>
            </TouchableOpacity>
        }
        return <TouchableOpacity key={item._id} style={{width:70, height:70}} onPress={this.navigateToEdit.bind(this,item)}>
            <Thumbnail square medium size={150} source={require('../../../images/client_1.png')}/>
        </TouchableOpacity>
    }
    navigateToAdd() {
        const {navigation, business} = this.props;
        navigation.navigate("AddProduct", {business: business});
    }

    navigateToEdit(item) {
        const {navigation, business} = this.props;
        navigation.navigate("AddProduct", {item: item});
    }



    render() {
        const {products, navigation, actions, update, business} = this.props;
        const businessId = business._id;
        let rows = undefined;
        if(products[businessId]){
            rows =  RowUtils.splitToArrayRows(products[businessId],5)
            rows = rows.map(row => {return this.renderItem(row)})
        }

        return (
            <View style={{flex: -1}}>
                <View style={styles.addProductContainer}>
                    <TouchableOpacity style={styles.addProductButton}
                                      onPress={this.navigateToAdd.bind(this)}>
                        <Icon2 active color={"#FA8559"} size={18} name="plus"/>
                        <Text style={styles.addProductTextStyle}>Add product</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {rows}
                </ScrollView>

            </View>
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
