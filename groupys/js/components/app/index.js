import React, {Component} from "react";
import {Image, Platform, StyleSheetm, Dimensions} from "react-native";
import {connect} from "react-redux";
import {Container, View, Tabs, Tab, TabHeading, Drawer, Fab} from "native-base";
import Icon from "react-native-vector-icons/EvilIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
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
import codePush from "react-native-code-push";
import SideBar from "../drawer/index";
import * as actions from "../../reducers/reducerActions";
import {bindActionCreators} from "redux";
import {isAuthenticated, showAddAction, addComponent, showCompoenent} from "../../selectors/appSelector";
import * as mainAction from "../../actions/mainTab";
import * as userAction from "../../actions/user";
import {createSelector} from "reselect";
import {NavigationActions} from "react-navigation";
const promotions = require('../../../images/promotion.png');
const save = require('../../../images/save.png');
const groups = require('../../../images/groups.png');
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
        this.props.userActions.fetchUsersFollowers();
    }

    onChangeTab(tab) {
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
        codePush.sync({updateDialog: updateDialogOption});
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
        const fav = this.createFabAction(showAdd);
        return (

            <Drawer
                ref={(ref) => {
                    this.drawer = ref;
                }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer}>
                <Container>
                    <GeneralComponentHeader openDrawer={openDrawer} navigate={this.props.navigation.navigate}
                                            showAction={showAdd} current='home'
                                            to={this.state.addComponent}/>

                    <Tabs tabBarUnderlineStyle={ {backgroundColor: '#2db6c8'} } initialPage={selectedTab}
                          onChangeTab={this.onChangeTab.bind(this)} style={{backgroundColor: '#fff',}}>
                        <Tab heading={ <TabHeading style={{backgroundColor: "white"}}><Image
                            style={{tintColor: '#2db6c8', marginLeft: 0, width: 35, height: 35}}
                            source={promotions}/></TabHeading>}>
                            <Feeds index={0} navigation={this.props.navigation}/>
                        </Tab>
                        <Tab heading={ <TabHeading style={{backgroundColor: "white"}}><Image
                            style={{tintColor: '#2db6c8', marginLeft: 0, width: 25, height: 25}}
                            source={save}/></TabHeading>}>
                            <MydPromotions navigation={this.props.navigation} index={1}/>
                        </Tab>

                        <Tab
                            heading={ <TabHeading style={{backgroundColor: "white"}}><Image
                                style={{tintColor: '#2db6c8', marginLeft: 0, width: 55, height: 55}}
                                source={groups}/></TabHeading>}>
                            <Groups navigation={this.props.navigation} index={2}
                            />
                        </Tab>

                        <Tab
                            heading={ <TabHeading style={{width: 15, backgroundColor: "white"}}><Icon2
                                style={{color: '#2db6c8', fontSize: 30,}} name="md-notifications"/></TabHeading>}>
                            <Notification navigation={this.props.navigation} index={3}></Notification>
                        </Tab>


                    </Tabs>
                    {fav}
                </Container>
            </Drawer>
        );
    }

    createFabAction(showAction) {
        if (showAction) {
            return <Fab

                direction="right"
                active={false}
                containerStyle={{marginLeft: 10}}
                style={{backgroundColor: "#e65100"}}
                position="bottomRight"
                onPress={() => this.navigateToAdd()}>
                <Icon size={20} name="plus"/>

            </Fab>
        }
        return undefined;
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


