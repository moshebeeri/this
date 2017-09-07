import React, {Component} from 'react';
import {Image, Platform,StyleSheetm,Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left,Drawer,Fab} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';

import GeneralComponentHeader from '../header/index';


import Feeds from '../feed/index'
import MydPromotions from '../my-promotions/index'
import Notification from '../notifications/index'
import Groups from '../groups/index'


import BackgroundTimer from 'react-native-background-timer';

const promotions =  require('../../../images/promotion.png');
const save =  require('../../../images/save.png');
const groups =  require('../../../images/groups.png');


import StyleUtils from '../../utils/styleUtils'
import codePush from "react-native-code-push";

import SideBar from '../drawer/index';

const warch = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        locationApi.sendLocation(position.coords.longitude,position.coords.latitude,position.timestamp,position.coords.speed);

    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:100}
);

const timer = BackgroundTimer.setInterval(() =>{
    console.log('sync contacts')
    // this will be executed every 200 ms
    // even when app is the the background
    contactApi.syncContacts();



}, 60000);

let updateDialogOption = {
    updateTitle:"update"
}



import { bindActionCreators } from "redux";
import { isAuthenticated } from './appSelector'
import * as mainAction from "../../actions/mainTab";

 class ApplicationManager extends Component {
    static navigationOptions = {
        header:null
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



    onChangeTab(tab){
        this.props.mainAction.changeTab(tab)
        this.props.mainAction.showFab(this.showAction(tab.i))
    }






     navigateToAdd(){
        this.replaceRoute(this.state.addComponent);
     }


    showAction(index){
        switch (index){
            case 0:
                return false;
            case 1:
                return false;
            case 2:
                return true;
            case 3:
                return false;
            case 4:
                return true;
            case 5:
                return true;

        }

    }

    componentWillMount() {
        if (!this.props.isAuthenticated){
            this.replaceRoute('login');
         }
    }




    openDrawer() {
        this._drawer._root.open();
    }

    closeDrawer() {
        this._drawer._root.close();
    }
    componentDidMount(){
         codePush.sync({updateDialog: updateDialogOption});
    }

    render() {
        const { selectedTab,showAdd } = this.props;

        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };


        const fav = this.createFabAction(showAdd);

            return (

                    <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer} >
                        <Container>
                            <GeneralComponentHeader openDrawer= {openDrawer} navigate={this.props.navigation.navigate} showAction={showAdd} current='home'
                                                    to={this.state.addComponent}/>

                <Tabs tabBarUnderlineStyle={ {backgroundColor: '#2db6c8'} } initialPage={selectedTab} onChangeTab={this.onChangeTab.bind(this)} style={{backgroundColor: '#fff',}}>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "white" }}><Image style={{tintColor:'#2db6c8',marginLeft:0,width:35,height:35}} source={promotions}/></TabHeading>}>
                        <Feeds index={0}  navigation={this.props.navigation} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "white" }}><Image style={{tintColor:'#2db6c8',marginLeft:0,width:25,height:25}} source={save}/></TabHeading>}>
                        <MydPromotions  navigation={this.props.navigation}  index={1} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>

                    <Tab
                        heading={ <TabHeading style={{ backgroundColor: "white" }}><Image style={{tintColor:'#2db6c8',marginLeft:0,width:55,height:55}} source={groups}/></TabHeading>}>
                        <Groups navigation={this.props.navigation} index={2}
                                navigateAction={this.headerAction.bind(this)}/>
                    </Tab>

                    <Tab
                        heading={ <TabHeading style={{ width:15,backgroundColor: "white" }}><Icon2 style={{color: '#2db6c8', fontSize: 30,}}name="md-notifications"/></TabHeading>}>
                         <Notification navigation={this.props.navigation} index={3} navigateAction={this.headerAction.bind(this)}></Notification>
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



const mapStateToProps = state => {
    return {
        isAuthenticated: isAuthenticated(state)
    }
}
export default connect(
    state => ({
        selectedTab: state.mainTab.selectedTab,
        showAdd:state.mainTab.showAdd,
        mapStateToProps,
    }),
    (dispatch) => ({
        actions: bindActionCreators(mainAction, dispatch)
    })
)(ApplicationManager);


