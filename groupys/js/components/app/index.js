import React, {Component} from "react";
import {Dimensions, I18nManager, Image, Platform, StyleSheetm, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {Container, Drawer, Fab, Icon, Tab, TabHeading, Tabs} from "native-base";
import GeneralComponentHeader from "../header/index";
import Feeds from "../feed/index";
import MydPromotions from "../my-promotions/index";
import Notification from "../notifications/index";
import Groups from "../groups/index";
import BackgroundTimer from "react-native-background-timer";
import LocationApi from "../../api/location";
import ContactApi from "../../api/contacts";
import getStore from "../../store";

import SideBar from "../drawer/index";
import * as actions from "../../reducers/reducerActions";
import {bindActionCreators} from "redux";
import {
    addComponent,
    countUnreadNotifications,
    getPopUpInstance,
    isAuthenticated,
    showAddAction,
    showCompoenent
} from "../../selectors/appSelector";
import * as mainAction from "../../actions/mainTab";
import * as userAction from "../../actions/user";
import * as businessActions from "../../actions/business";
import * as groupsActions from "../../actions/groups";


import {createSelector} from "reselect";
import {NavigationActions} from "react-navigation";
import '../../conf/global';
import pageSync from "../../refresh/refresher"
import PageRefresher from '../../refresh/pageRefresher'
import {BusinessHeader, GroupHeader, ScrolTabView, SubmitButton,BusinessList,GroupsList,TermsOfUse} from '../../ui/index'
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-fcm';
import Icon2 from 'react-native-vector-icons/Ionicons';
import FeedPromotion from '../generic-feed-manager/generic-feed/feed-components/feedPromotion'
import strings from "../../i18n/i18n"

import StyleUtils from "../../utils/styleUtils";

const height = StyleUtils.getHeight();
let locationApi = new LocationApi();
let contactApi = new ContactApi();
const reduxStore = getStore();
import store from 'react-native-simple-store';
const updateDialogOption = {
    updateTitle: "update"
};
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'login'})
    ]
});
import ActionLogger from '../../actions/ActionLogger'
let logger = new ActionLogger();



// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    console.log(notif);
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if (notif.local_notification) {
        //this is a local notification
    }
    if (notif.opened_from_tray) {
        //iOS: app is open/resumed because user clicked banner
        //Android: app is open/resumed because user clicked banner or tapped app icon
    }
    if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
            case NotificationType.Remote:
                notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                break;
            case NotificationType.NotificationResponse:
                notif.finish();
                break;
            case NotificationType.WillPresent:
                notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                break;
        }
    }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
    PageRefresher.updateUserFireBase(token);
})
////////// background jobs schedulers ////////////////////////
const warch = navigator.geolocation.watchPosition((position) => {
        try {
            if (reduxStore.getState().authentication.token) {
                locationApi.sendLocation(position.coords.longitude, position.coords.latitude, position.timestamp, position.coords.speed);
            }
            reduxStore.dispatch({
                type: actions.SET_LOCATION,
                currentLocation: {lat: position.coords.latitude, long: position.coords.longitude}
            })
        } catch (error) {
            reduxStore.dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            })
        }
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 100}
);
const timer = BackgroundTimer.setInterval(() => {
    try {
        pageSync.check();
        if (reduxStore.getState().authentication.token) {
            contactApi.syncContacts();
        }
        if (reduxStore.getState().network.offline) {
            reduxStore.dispatch({
                type: actions.NETWORK_IS_ONLINE,
            })
        }
    } catch (error) {
        reduxStore.dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        })
    }
}, 60000);
const refresher = BackgroundTimer.setInterval(() => {
    try {
        pageSync.check();
    } catch (error) {
        reduxStore.dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        })
    }
}, 1000);

/////////////////////////////////////////////////
class ApplicationManager extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        this.state = {
            orientation: StyleUtils.isPortrait() ? 'portrait' : 'landscape',
            devicetype: StyleUtils.isTablet() ? 'tablet' : 'phone',
            activeTab:'feed'
        }

    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    async componentWillMount() {

        FCM.requestPermissions().then(
            () =>
                console.log('granted')).catch(() =>
            console.log('notification permission rejected'));

        let token = await store.get("token");
        if (!token) {
            this.props.navigation.dispatch(resetAction);
        }
        FCM.getFCMToken().then(token => {
            PageRefresher.updateUserFireBase(token);
        });
        let notification = await  FCM.getInitialNotification();
        if (notification && notification.model === 'instance') {
            this.props.actions.showPromotionPopup(notification._id, notification.notificationId);
            return;
        }
        if (notification && notification.model === 'group') {
            this.props.actions.showGroupPopup(notification._id, notification.notificationId, notification.title, notification.action);
            return;
        }
        if (notification && notification.model === 'business') {
            this.props.actions.showBusinessPopup(notification._id, notification.notificationId, notification.title, notification.action);
            return;
        }
        if (notification && notification.title) {
            this.props.actions.showGenericPopup(notification.title, notification.notificationId, notification.action);
        }
    }

    onChangeTab(tab) {
        if (tab.i === 0) {

            if(I18nManager.isRTL && (Platform.OS === 'android')){
                logger.screenVisited('notification')
            }else {
                logger.screenVisited('feed')
                PageRefresher.visitedFeed();
                this.setState({
                    activeTab: 'feed'
                })
            }
        }
        if (tab.i === 1 ){
            if(I18nManager.isRTL && (Platform.OS === 'android')){
                logger.screenVisited('groups')
                PageRefresher.visitedGroups();
            }else {
                logger.screenVisited('savedPromotion')
                this.setState({
                    activeTab: 'savedPromotion'
                })
            }

        }
        //this.p
        if (tab.i === 2) {

            if(I18nManager.isRTL && (Platform.OS === 'android')){
                logger.screenVisited('savedPromotion')
                this.setState({
                    activeTab: 'savedPromotion'
                })
            }else {
                PageRefresher.visitedGroups();
                logger.screenVisited('groups')
                this.setState({
                    activeTab:'groups'
                })
            }

        }
        if (tab.i === 3){

            if(I18nManager.isRTL && (Platform.OS === 'android')){
                logger.screenVisited('feed')
                PageRefresher.visitedFeed();
                this.setState({
                    activeTab: 'feed'
                })

            }else {
                logger.screenVisited('notification')
            }
        }
        this.props.actions.changeTab(tab)
    }

    navigateToAdd() {
        this.replaceRoute(this.props.addComponent);
    }

    openDrawer() {
        this._drawer._root.open();
    }

    closeDrawer() {
        this._drawer._root.close();
    }

    componentDidMount() {
        //  codePush.sync({updateDialog: updateDialogOption});
    }

    renderTabeBar(props) {
        switch (props.activeTab) {
            default:
                return <View ref={'tabs'}> <Text>bla</Text>

                </View>
        }
    }

    render() {
        const {selectedTab, showAdd, showComponent, notifications,
            item, location, showPopup, token, notificationTitle,
            notificationAction, notificationGroup, notificationBusiness,
            showSearchResults,businesses,businessActions,groups,groupsActions} = this.props;

        if (!showComponent) {
            return <View></View>
        }
        let notificationPopupHeight = 300;
        let notificationnTopPadding = 150
        if (item) {
            notificationPopupHeight = 80
            notificationnTopPadding = 30;
        }
        let notificationActionString
        if (notificationAction) {
            notificationActionString = this.translateNotificationAction(notificationAction)
        }

        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };
        let notificationLabel = 'notification_' + notifications;
        return (

            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}


                content={<SideBar closeDrawer={closeDrawer} navigation={this.props.navigation}/>}
                onClose={() => closeDrawer}>
                <Container>

                    <GeneralComponentHeader openDrawer={openDrawer} navigate={this.props.navigation.navigate}
                                            showAction={showAdd} current='home'
                                            to={this.state.addComponent}/>

                    {I18nManager.isRTL && (Platform.OS === 'android') ?
                        <ScrolTabView initialPage={3} onChangeTab={this.onChangeTab.bind(this)}
                                      tabBarBackgroundColor='white'
                                      tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>
                            <Notification tabLabel="promotions" navigation={this.props.navigation} index={3}/>
                            <Groups tabLabel="save" navigation={this.props.navigation} index={2}/>
                            <MydPromotions tabLabel="groups" navigation={this.props.navigation} index={1}/>
                            <Feeds tabLabel={notificationLabel} index={0} navigation={this.props.navigation}/>


                        </ScrolTabView> :
                        <ScrolTabView initialPage={0} onChangeTab={this.onChangeTab.bind(this)}
                                      tabBarBackgroundColor='white'
                                      tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>
                            <Feeds  activeTab={this.state.activeTab} tabLabel="promotions" index={0} navigation={this.props.navigation}/>
                            <MydPromotions  activeTab={this.state.activeTab}  tabLabel="save" navigation={this.props.navigation} index={1}/>
                            <Groups   activeTab={this.state.activeTab}  tabLabel="groups" navigation={this.props.navigation} index={2}/>
                            <Notification   activeTab={this.state.activeTab}  tabLabel={notificationLabel} navigation={this.props.navigation} index={3}/>


                        </ScrolTabView>
                    }

                    {showSearchResults && businesses &&  <View style={{ top:45,position: 'absolute',backgroundColor:'white',width: StyleUtils.getWidth()  }}>

                    <BusinessList businesses={businesses} followBusiness={businessActions.followBusiness}/>
                </View>}


                    {showSearchResults && groups &&  <View style={{ top:45,position: 'absolute',backgroundColor:'white',width: StyleUtils.getWidth()  }}>

                        <GroupsList groups={groups} joinGroup={groupsActions.joinGroup}/>
                    </View>}
                    {showPopup && <View style={{
                        left: 2.5,
                        borderBottomWidth: 2,
                        borderTopWidth: 2,
                        borderColor: 'black',
                        top: notificationnTopPadding,
                        position: 'absolute',
                        width: StyleUtils.getWidth()  - 5,
                        height: height - notificationPopupHeight,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        <TouchableOpacity style={{paddingTop: 5, paddingLeft: 10, justifyContent: 'flex-end'}}
                                          onPress={() => this.closePopup(false)}>
                            <Icon2 style={{fontSize: 30}} name="ios-close-circle-outline"/>

                        </TouchableOpacity>

                        {item &&
                        <View style={{flex: 1, width: StyleUtils.getWidth()  - 5, justifyContent: 'center', alignItems: 'center'}}>
                            <FeedPromotion showActions={true} token={token}
                                           location={location} hideSocial={true} showInPopup={true}
                                           navigation={this.props.navigation} item={item}/>
                        </View>}
                        {notificationTitle &&
                        <View style={{flex: 1, width: StyleUtils.getWidth() - 5, justifyContent: 'flex-start', alignItems: 'center'}}>


                            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                {notificationGroup && <GroupHeader group={notificationGroup}/>}
                                {notificationBusiness && <BusinessHeader noProfile business={notificationBusiness}
                                                                         businessLogo={notificationBusiness.logo}
                                                                         businessName={notificationBusiness.name}
                                                                         noMargin
                                                                         hideMenu
                                                                         showActions={false}/>
                                }
                                <Text style={{paddingLeft:10,paddingTop: 10}}>{notificationTitle}</Text>
                            </View>
                            {notificationActionString && <View style={{flex: 1, paddingBottom: 10, justifyContent: 'flex-end',}}>
                                <SubmitButton color={'#2db6c8'} title={notificationActionString}
                                              onPress={this.handleGenericNotification.bind(this)}/>
                            </View>}
                        </View>}
                    </View>}

                </Container>
            </Drawer>
        );
    }

    translateNotificationAction(action) {
        if (action === 'APPROVE') {
            return strings.Approve.toUpperCase();
        }
        if (action === 'FOLLOW') {
            return strings.Follow.toUpperCase();;
        }
        return undefined;
    }

    closePopup() {
        const {notificationId} = this.props;
        this.props.actions.closePopup(notificationId);
    }

    handleGenericNotification() {
        const {notificationAction, notificationId} = this.props;
        this.props.actions.doNotification(notificationId, notificationAction);
        //Add generic API result
    }
}

const mapStateToProps = (state) => {
    return {
        state: state,
        isAuthenticated: isAuthenticated(state),
        selectedTab: state.mainTab.selectedTab,
        showPopup: state.mainTab.showPopup,
        notifications: countUnreadNotifications(state),
        showAdd: showAddAction(state),
        addComponent: addComponent(state),
        showComponent: showCompoenent(state),
        serFollower: state.user.followers,
        item: getPopUpInstance(state),
        notificationAction: state.mainTab.notificationAction,
        notificationTitle: state.mainTab.notificationTitle,
        notificationId: state.mainTab.notificationId,
        notificationGroup: state.mainTab.notificationGroup,
        notificationBusiness: state.mainTab.notificationBusiness,
        location: state.phone.currentLocation,
        token: state.authentication.token,
        businesses: state.follow_businesses.businesses,
        groups: state.follow_businesses.groups,
        showSearchResults: state.follow_businesses.showSearchResults,
        businessesState: state.follow_businesses
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(mainAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch),
        businessActions: bindActionCreators(businessActions, dispatch),
        groupsActions: bindActionCreators(groupsActions, dispatch),
    })
)(ApplicationManager);


