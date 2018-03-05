import React, {Component} from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Fab, Header, Input, InputGroup, Item, Spinner, View} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import PromotionListItem from './list-item/index'
import Icon3 from 'react-native-vector-icons/Ionicons';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import * as businessAction from "../../actions/business";
import {getBusinessPromotions} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import {FormHeader, ThisText} from '../../ui/index';
import PageRefresher from '../../refresh/pageRefresher'
import * as promotionsAction from "../../actions/promotions";
import strings from "../../i18n/i18n"

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
        const {navigation, promotions, promotionsChange, actions, update, promotionsLoading} = this.props;
        const businessId = navigation.state.params.business._id;
        if ((promotions && !promotions[businessId]) || !promotionsChange.loadingDone[businessId]) {
            PageRefresher.addBusinessPromotion(businessId);
            this.setBusinessPromotions();
        }
        PageRefresher.visitedPromotions(businessId);
    }

    setBusinessPromotions() {
        const {actions, navigation} = this.props;
        actions.setBusinessPromotions(navigation.state.params.business._id);
    }

    renderItem(item) {
        const {location, navigation} = this.props;
        return <PromotionListItem
            item={item.item}
            businessId={navigation.state.params.business._id}
            index={item.index}
            key={item.item._id}
            location={location}
            navigation={this.props.navigation}
        />
    }

    navigateToAdd() {
        const {navigation, promotionActions} = this.props;
        promotionActions.resetForm();
        this.props.navigation.navigate("addPromotions", {business: navigation.state.params.business});
    }

    onBoardingPromotion() {
        const {business,navigation,onBoardingPromotion} = this.props;
        let addToBusiness = business;
        if(!addToBusiness){
            addToBusiness = navigation.state.params.business;
        }
        this.props.navigation.navigate("addPromotions", {
            onBoardType: 'BUSINESS',
            business: addToBusiness,
            onBoardingPromotion: onBoardingPromotion[addToBusiness._id]
        });
    }

    onProximityPromotion() {
        const {business,navigation,proximityPromotion} = this.props;
        let addToBusiness = business;
        if(!addToBusiness){
            addToBusiness = navigation.state.params.business;
        }
        this.props.navigation.navigate("addPromotions", {
            onBoardType: 'PROXIMITY',
            business: addToBusiness,
            proximityPromotion: proximityPromotion[addToBusiness._id]
        });
    }

    render() {
        const {navigation, promotions, actions, update, promotionsLoading} = this.props;
        const businessId = navigation.state.params.business._id;
        let icon = <Icon5 active color={"#FA8559"} size={25} name="plus"/>
        if (Platform.OS === 'ios') {
            icon = <Icon3 active color={"#FA8559"} size={25} name="ios-add"/>;
        }
        let headerMenu = <Menu>
            <MenuTrigger placement="right">
                {icon}
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={this.navigateToAdd.bind(this)}>
                    <ThisText>{strings.AddPromotion}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.onBoardingPromotion.bind(this)}>
                    <ThisText>{strings.OnBoardingPromotion}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.onProximityPromotion.bind(this)}>
                    <ThisText>{strings.OnProximityPromotion}</ThisText>
                </MenuOption>
            </MenuOptions>
        </Menu>;
        return (
            <Container style={{backgroundColor: '#b7b7b7'}}>
                <FormHeader showBack submitForm={this.navigateToAdd.bind(this)} navigation={this.props.navigation}
                            title={strings.MyPromotions} bgc="white"
                            submitIcon={icon}
                            menu={headerMenu}
                            titleColor="#FA8559" backIconColor="#FA8559"/>
                {!promotionsLoading[businessId] && <Spinner/>}
                {promotions[businessId] && promotions[businessId].length > 0 &&
                <GenericListManager rows={promotions[businessId]} navigation={navigation} actions={actions}
                                    update={update}
                                    noRefresh
                                    ItemDetail={this.renderItem.bind(this)}/>}


            </Container>
        );
    }
}

export default connect(
    state => ({
        promotions: getBusinessPromotions(state),
        update: state.businesses.update,
        location: state.phone.currentLocation,
        promotionsLoading: state.promotions.loadingDone,
        proximityPromotion: state.promotions.proximityPromotion,
        onBoardingPromotion: state.promotions.onBoardingPromotion,
        promotionsChange: state.promotions,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
        promotionActions: bindActionCreators(promotionsAction, dispatch)
    })
)(Promotions);


