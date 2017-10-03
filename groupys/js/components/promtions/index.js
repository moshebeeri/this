import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, Fab, InputGroup, Input, Button, View, Item, Header} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import Icon from 'react-native-vector-icons/EvilIcons';
import PromotionListItem from './list-item/index'
import PromotionApi from "../../api/promotion"
import styles from './styles'
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Icon4 from 'react-native-vector-icons/SimpleLineIcons';

let promotionApi = new PromotionApi();
import * as promotionsAction from "../../actions/promotions";
import * as businessAction from "../../actions/business";
import {getBusinessPromotions} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";

class Promotions extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    back() {
        this.props.navigation.goBack();
    }

    componentWillMount() {
        this.setBusinessPromotions();
    }

    setBusinessPromotions() {
        const {actions, navigation} = this.props;
        const business = navigation.state.params.business._id;
        actions.setBusinessPromotions(business);
    }

    renderItem(item) {
        return <PromotionListItem
            item={item.item}
            index={item.index}
            navigation={this.props.navigation}
        />
    }

    navigateToAdd() {
        this.props.navigation.navigate("addPromotions", {business: this.props.navigation.state.params.business});
    }

    onBoardingPromotion() {
        this.props.navigation.navigate("addPromotions", {
            onBoardType: 'BUSINESS',
            business: this.props.navigation.state.params.business
        });
    }

    render() {
        const {navigation, promotions, actions, update} = this.props;
        const menuAction = this.createMenuTag()
        const back = this.createBackButtonTag()
        const businessId = navigation.state.params.business._id;
        return (
            <Container style={{backgroundColor: '#b7b7b7'}}>
                <View style={styles.follow_search} regular>
                    {back}
                    <Text style={{fontSize: 20, color: "#2db6c8"}}>Promotions</Text>
                    {menuAction}
                </View>
                <GenericListManager rows={promotions[businessId]} navigation={navigation} actions={actions}
                                    update={update}
                                    onEndReached={this.setBusinessPromotions.bind(this)}
                                    ItemDetail={this.renderItem.bind(this)}/>

                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#ff6400"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="plus"/>

                </Fab>
            </Container>
        );
    }

    createBackButtonTag() {
        return <Button transparent style={{}} onPress={() => this.back()}>
            <Icon3 active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

        </Button>;
    }

    createMenuTag() {
        return <Menu>
            <MenuTrigger>
                <Icon4 style={{fontSize: 25, color: "#2db6c8"}} name="options-vertical"/>
            </MenuTrigger>
            <MenuOptions>


                <MenuOption onSelect={this.onBoardingPromotion.bind(this)}>
                    <Text>On Boarding Promotions</Text>
                </MenuOption>

            </MenuOptions>
        </Menu>;
    }
}

export default connect(
    state => ({
        promotions: getBusinessPromotions(state),
        update: state.businesses.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Promotions);


