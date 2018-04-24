import React, {Component} from "react";
import {AppState, I18nManager, Platform, StyleSheetm, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {Container, Drawer, Fab, Icon, Tab, TabHeading, Tabs,} from "native-base";
import GeneralComponentHeader from "../header/index";
import Feeds from "../feed/index";
import MydPromotions from "../my-promotions/index";
import Notification from "../notifications/index";
import Groups from "../groups/index";
import LocationApi from "../../api/location";
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
import * as feedAction from "../../actions/feedsMain";
import * as userAction from "../../actions/user";
import * as businessActions from "../../actions/business";
import * as myPromotionsActions from "../../actions/myPromotions";
import * as groupsActions from "../../actions/groups";
import * as notificationsActions from "../../actions/notifications";
import * as instanceGroupCommentsAction from "../../actions/instanceGroupComments"
import {createSelector} from "reselect";
import {NavigationActions} from "react-navigation";
import '../../conf/global';
import PageRefresher from '../../refresh/pageRefresher'
import Tasks from '../../tasks/tasks'
import dataSync from '../../sync/DataSyncronizer';
import NotificationHandler from '../notifications/NotificationHandler'
import {
    BusinessHeader,
    BusinessList,
    GroupHeader,
    GroupsList,
    ScrolTabView,
    SubmitButton,
    ThisText
} from '../../ui/index'
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
import store from 'react-native-simple-store';
import ActionLogger from '../../actions/ActionLogger'
import handler from '../../actions/ErrorHandler'

const height = StyleUtils.getHeight();
let locationApi = new LocationApi();
const reduxStore = getStore();
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'login'})
    ]
});
let logger = new ActionLogger();
// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    //console.log(notif);
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if (notif.local_notification) {
        //this is a local notification
    }
    if (notif.opened_from_tray) {
        //iOS: app is open/resumed because user clicked banner
        //Android: app is open/resumed because user clicked banner or tapped app icon
    }
    let token = reduxStore.getState().authentication.token;
    NotificationHandler.handleFrontNotification(notif, reduxStore.getState(), reduxStore.dispatch);
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
    } else {
        if (!token) {
            FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number));
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
            let lastPosition = reduxStore.getState().phone.currentLocation;
            if (!lastPosition || (lastPosition && lastPosition.lat !== position.coords.latitude && lastPosition.long !== position.coords.longitude)) {
                reduxStore.dispatch({
                    type: actions.SET_LOCATION,
                    currentLocation: {lat: position.coords.latitude, long: position.coords.longitude}
                })
            }
        } catch (error) {
            handler.handleError(actions.SET_LOCATION, dispatch, 'SET_LOCATION')
        }
    }, (error) => {
        console.log('unable to get location')
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 100}
);

/////////////////////////////////////////////////
class ApplicationManager extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        FCM.getFCMToken().then(token => {
            PageRefresher.updateUserFireBase(token);
        });
        this.state = {
            orientation: StyleUtils.isPortrait() ? 'portrait' : 'landscape',
            devicetype: StyleUtils.isTablet() ? 'tablet' : 'phone',
            activeTab: 'feed'
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
        FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(0));
        this.props.actions.resetBadge();
        Tasks.start();
        let notification = await  FCM.getInitialNotification();
        NotificationHandler.handleBackNotification(notification, this.props.actions, this.props.navigation, reduxStore.getState(), reduxStore.dispatch);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.props.userActions.resetForm();
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState !== 'active') {
            Tasks.stop();
        } else {
            Tasks.start();
        }
    }

    onChangeTab(tab) {
        const {feedAction, instanceGroupCommentsAction} = this.props;
        feedAction.stopMainFeedsListener();
        dataSync.syncData();
    }

    openDrawer() {
        this._drawer._root.open();
    }

    closeDrawer() {
        this._drawer._root.close();
    }

    componentDidMount() {
        dataSync.syncData();
    }

    savePromotionFromPopup(id, navigation, feed) {
        const {feedAction} = this.props;
        this.closePopup();
        feedAction.saveFeed(id, navigation, feed);
    }

    render() {
        const {
            showAdd, showComponent, notifications, feedAction,
            item, location, showPopup, token, notificationTitle,
            notificationAction, notificationGroup, notificationBusiness,
            showSearchResults, businesses, businessActions, groups, groupsActions, showSearchGroupResults, notificationOnAction
        } = this.props;
        console.log(this.state.activeTab);
        if (!showComponent) {
            return <View></View>
        }
        let notificationPopupHeight = 350;
        let notificationnTopPadding = 150;
        let leftPadding = 10;
        let sideMargin = 20;
        let borderSideWidth = 4;
        if (item) {
            notificationPopupHeight = StyleUtils.scale(230);
            notificationnTopPadding = StyleUtils.scale(150);
            leftPadding = StyleUtils.scale(10);
            borderSideWidth = 4;
            sideMargin = StyleUtils.scale(20);
            ;
        }
        let notificationActionString
        if (notificationOnAction) {
            notificationActionString = this.translateNotificationAction(notificationOnAction)
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
                            <Feeds activeTab={this.state.activeTab} tabLabel="promotions" index={0}
                                   navigation={this.props.navigation}/>
                            <MydPromotions activeTab={this.state.activeTab} tabLabel="save"
                                           navigation={this.props.navigation} index={1}/>
                            <Groups activeTab={this.state.activeTab} tabLabel="groups"
                                    navigation={this.props.navigation} index={2}/>
                            <Notification activeTab={this.state.activeTab} tabLabel={notificationLabel}
                                          navigation={this.props.navigation} index={3}/>


                        </ScrolTabView>
                    }

                    {showSearchResults && businesses && <View
                        style={{top: 45, position: 'absolute', backgroundColor: 'white', width: StyleUtils.getWidth()}}>

                        <BusinessList navigation={this.props.navigation} businesses={businesses}
                                      followBusiness={businessActions.followBusiness}/>
                    </View>}


                    {showSearchGroupResults && groups && <View
                        style={{top: 45, position: 'absolute', backgroundColor: 'white', width: StyleUtils.getWidth()}}>

                        <GroupsList groups={groups} joinGroup={groupsActions.joinGroup}/>
                    </View>}
                    {showPopup && <View style={{
                        left: leftPadding,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: '#ddd',
                        borderBottomWidth: 0,
                        top: notificationnTopPadding,
                        position: 'absolute',
                        width: StyleUtils.getWidth() - sideMargin,
                        height: height - notificationPopupHeight,
                        shadowOffset: {width: 0, height: 0},
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        elevation: 10,
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        <TouchableOpacity style={{paddingTop: 5, paddingLeft: 10, justifyContent: 'flex-end'}}
                                          onPress={() => this.closePopup(false)}>
                            <Icon2 style={{fontWeight: 'bold', color: 'black', fontSize: 30}}
                                   name="ios-close-circle-outline"/>

                        </TouchableOpacity>

                        {item ?
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <FeedPromotion minimizeSize={StyleUtils.scale(18)} scanner showActions={true}
                                               token={token}
                                               location={location} actions={feedAction}
                                               navigation={this.props.navigation} item={item}
                                               like={feedAction.like} unlike={feedAction.unlike}
                                               save={this.savePromotionFromPopup.bind(this)}/>


                            </View> :
                            <View style={{
                                flex: 1,
                                width: StyleUtils.getWidth() - 5,
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>


                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    {notificationGroup && <GroupHeader group={notificationGroup}/>}
                                    {notificationBusiness && <BusinessHeader noProfile business={notificationBusiness}
                                                                             businessLogo={notificationBusiness.logo}
                                                                             businessName={notificationBusiness.name}
                                                                             noMargin
                                                                             hideMenu
                                                                             showActions={false}/>
                                    }
                                    <ThisText style={{
                                        width: StyleUtils.getWidth() - 40,
                                        paddingTop: 10
                                    }}>{notificationTitle}</ThisText>
                                </View>
                                {notificationActionString &&
                                <View style={{flex: 1, paddingBottom: 10, justifyContent: 'flex-end',}}>
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
            return strings.Follow.toUpperCase();
            ;
        }
        return action;
    }

    closePopup() {
        const {notificationId, notificationAction} = this.props;
        notificationAction.readNotification(notificationId);
        this.props.actions.closePopup(notificationId);
    }

    handleGenericNotification() {
        const {notificationAction, notificationId, notificationGroup, notificationOnAction} = this.props;
        this.props.actions.doNotification(notificationId, notificationAction);
        notificationAction.readNotification(notificationId);
        //Add generic API result
        if (notificationOnAction === strings.JoinGroup.toUpperCase()) {
            this.props.groupsActions.acceptInvitation(notificationGroup);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
        showPopup: state.mainTab.showPopup,
        notifications: countUnreadNotifications(state),
        showAdd: showAddAction(state),
        addComponent: addComponent(state),
        showComponent: showCompoenent(state),
        serFollower: state.user.followers,
        item: getPopUpInstance(state),
        notificationOnAction: state.mainTab.notificationAction,
        notificationTitle: state.mainTab.notificationTitle,
        notificationId: state.mainTab.notificationId,
        notificationGroup: state.mainTab.notificationGroup,
        notificationBusiness: state.mainTab.notificationBusiness,
        location: state.phone.currentLocation,
        token: state.authentication.token,
        businesses: state.follow_businesses.businesses,
        groups: state.follow_businesses.groups,
        showSearchResults: state.follow_businesses.showSearchResults,
        showSearchGroupResults: state.follow_businesses.showSearchGroupResults,
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
        notificationAction: bindActionCreators(notificationsActions, dispatch),
        myPromotionsAction: bindActionCreators(myPromotionsActions, dispatch),
        feedAction: bindActionCreators(feedAction, dispatch),
        instanceGroupCommentsAction: bindActionCreators(instanceGroupCommentsAction, dispatch)
    })
)(ApplicationManager);


