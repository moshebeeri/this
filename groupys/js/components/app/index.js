import React, {Component} from 'react';
import {Image, Platform,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left,Drawer,Fab} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import GeneralComponentHeader from '../header/index';
import Product from '../product/index';
import Business from '../business/index';
import Feeds from '../feed/index'
import MydPromotions from '../my-promotions/index'
import Promotions from '../promtions/index'
import Groups from '../groups/index'

import LocationApi from '../../api/location'
import UserApi from '../../api/user'
import ContactApi from '../../api/contacts'
import BackgroundTimer from 'react-native-background-timer';
let locationApi = new LocationApi();
let contactApi = new ContactApi();
let userApi = new UserApi();

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
codePush.sync({updateDialog: updateDialogOption})

import LoginUtils from '../../utils/login_utils'
let lu = new LoginUtils();
import { bindActionCreators } from "redux";

import * as businessAction from "../../actions/business";

 class ApplicationManager extends Component {
    static navigationOptions = {
        header:null
    };


     getInitialState(){

     }

     constructor(props) {
        super(props)

        let initialPage = 0;
         this.props.fetchBusiness();

        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            ready: true,
            addComponent: '',
            rowsView: [],
            initialPage: initialPage,
            index: initialPage,
            drawerState:'',
            start:true,

        }
         userApi.getUser();


    }
    replaceRoute(route) {

        this.props.navigation.navigate(route);
    }

    async calc_login_status() {
        return new Promise(async(resolve, reject) => {

            try {
                const token = await lu.getToken();
                if (!token) {
                    this.replaceRoute('login');
                    return resolve(true);
                }
            }catch(error){
                this.replaceRoute('login');
                return resolve(true);
            }
            return resolve(true);

        })
    }


    onChangeTab(ref){
         let component = 'home';
         switch (ref.i){
             case 0:

                 break;
             case 1:

                 break;
             case 2:
                 component ='AddGroups'
                 break;
             case 3:
                 component ='addBusiness'
                 break;


         }


         this.setState({
             addComponent: component,
             index : ref.i,
         });

    }






     navigateToAdd(){
        this.replaceRoute(this.state.addComponent);
     }
    extractTabIndexFromNavigation(){

        return this.state.initialPage;


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
                return true;
            case 4:
                return true;
            case 5:
                return true;

        }

    }
    async componentWillMount() {
        await this.calc_login_status();
        this.setState({start:false});

    }

   async headerAction(compoenet, index){
       this.setState({
            addComponent:compoenet,
        })
    }



    openDrawer() {
        this._drawer._root.open();
    }

    closeDrawer() {
        this._drawer._root.close();
    }
    componentDidMount(){
    //   this.openDrawer();
    }

    render() {

        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };
        let showAction = this.showAction(this.state.index);
        let index = this.state.initialPage;
        let fav= undefined;
        if(showAction){
            fav =
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: "#ffb3b3" }}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="plus" />

                </Fab>
        }

        if(!this.start) {

            return (

                    <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer} >
                        <Container>
                            <GeneralComponentHeader openDrawer= {openDrawer} navigate={this.props.navigation.navigate} showAction={showAction} current='home'
                                                    to={this.state.addComponent}/>

                <Tabs initialPage={index} onChangeTab={this.onChangeTab.bind(this)} style={{backgroundColor: '#fff',}}>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>Home</Text></TabHeading>}>
                        <Feeds index={0}  navigation={this.props.navigation} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>My Promotions</Text></TabHeading>}>
                        <MydPromotions  navigation={this.props.navigation}  index={1} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab
                        heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>Groups</Text></TabHeading>}>
                        <Groups navigation={this.props.navigation} index={2}
                                navigateAction={this.headerAction.bind(this)}/>
                    </Tab>

                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>Business</Text></TabHeading>}>

                        <Business navigation={this.props.navigation} index={3} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>



                </Tabs>
                            {fav}
                        </Container>
            </Drawer>
               );
        }
        return  <Container></Container>;



    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),

    dispatch => bindActionCreators(businessAction, dispatch)
)(ApplicationManager);


