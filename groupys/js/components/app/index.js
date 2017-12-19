import React, {Component} from "react";
import {Dimensions, I18nManager, Image, Platform, StyleSheetm, Text} from "react-native";
import {connect} from "react-redux";
import {Container, Drawer, Fab, Icon, Tab, TabHeading, Tabs, View} from "native-base";
import GeneralComponentHeader from "../header/index";
import Feeds from "../feed/index";
import MydPromotions from "../my-promotions/index";
import Notification from "../notifications/index";
import Groups from "../groups/index";
import BackgroundTimer from "react-native-background-timer";
import LocationApi from "../../api/location";
import ContactApi from "../../api/contacts";
import getStore from "../../store";
import StyleUtils from "../../utils/styleUtils";
import SideBar from "../drawer/index";
import * as actions from "../../reducers/reducerActions";
import {bindActionCreators} from "redux";
import {addComponent, isAuthenticated, showAddAction, showCompoenent} from "../../selectors/appSelector";
import * as mainAction from "../../actions/mainTab";
import * as userAction from "../../actions/user";
import {createSelector} from "reselect";
import {NavigationActions} from "react-navigation";
import '../../conf/global';
import pageSync from "../../refresh/refresher"
import PageRefresher from '../../refresh/pageRefresher'
import {ScrolTabView} from '../../ui/index'


let locationApi = new LocationApi();
let contactApi = new ContactApi();
const store = getStore();
const updateDialogOption = {
    updateTitle: "update"
};
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'login'})
    ]
});
////////// background jobs schedulers ////////////////////////
const warch = navigator.geolocation.watchPosition((position) => {
        try {
            if (store.getState().authentication.token) {
                locationApi.sendLocation(position.coords.longitude, position.coords.latitude, position.timestamp, position.coords.speed);
            }
            store.dispatch({
                type: actions.SET_LOCATION,
                currentLocation: {lat: position.coords.latitude, long: position.coords.longitude}
            })
        } catch (error) {
            store.dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            })
        }
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 100}
);
const timer = BackgroundTimer.setInterval(() => {
    try {
        pageSync.check();
        if (store.getState().authentication.token) {
            contactApi.syncContacts();
        }
        if (store.getState().network.offline) {
            store.dispatch({
                type: actions.NETWORK_IS_ONLINE,
            })
        }
    } catch (error) {
        store.dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        })
    }
}, 60000);
const refresher = BackgroundTimer.setInterval(() => {
    try {
        pageSync.check();
    } catch (error) {
        store.dispatch({
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
            devicetype: StyleUtils.isTablet() ? 'tablet' : 'phone'
        }
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: StyleUtils.isPortrait() ? 'portrait' : 'landscape'
            })
        })
    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    async componentWillMount() {
        const isVerified = await this.props.isAuthenticated
        if (!isVerified) {
            this.props.navigation.dispatch(resetAction);
        }
    }

    onChangeTab(tab) {
        if (tab.i === 0) {
            PageRefresher.visitedFeed();
        }
        if (tab.i === 2) {
            PageRefresher.visitedGroups();
        }
        //this.props.actions.changeTab(tab)
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
        const {selectedTab, showAdd, showComponent} = this.props;
        if (!showComponent) {
            return <View></View>
        }
        //TODO find another way to change the drawer close/open
        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };


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
                            <Feeds tabLabel="notification" index={0} navigation={this.props.navigation}/>


                        </ScrolTabView> :
                        <ScrolTabView initialPage={0} onChangeTab={this.onChangeTab.bind(this)}
                                      tabBarBackgroundColor='white'
                                      tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}}>
                            <Feeds tabLabel="promotions" index={0} navigation={this.props.navigation}/>
                            <MydPromotions tabLabel="save" navigation={this.props.navigation} index={1}/>
                            <Groups tabLabel="groups" navigation={this.props.navigation} index={2}/>
                            <Notification tabLabel="notification" navigation={this.props.navigation} index={3}/>


                        </ScrolTabView>
                    }


                </Container>
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state,
        isAuthenticated: isAuthenticated(state),
        selectedTab: state.mainTab.selectedTab,
        showAdd: showAddAction(state),
        addComponent: addComponent(state),
        showComponent: showCompoenent(state)
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(mainAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch)
    })
)(ApplicationManager);


