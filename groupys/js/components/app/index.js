import React, {Component} from 'react';
import {Image, Platform,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left,Drawer} from 'native-base';

import GeneralComponentHeader from '../header/index';
import Product from '../product/index';
import Business from '../business/index';
import Feeds from '../feed/index'
import Promotions from '../promtions/index'
import Groups from '../groups/index'

import LocationApi from '../../api/location'
import ContactApi from '../../api/contacts'
import BackgroundTimer from 'react-native-background-timer';
let locationApi = new LocationApi();
let contactApi = new ContactApi();

import { NavigationActions } from 'react-navigation'
import codePush from "react-native-code-push";

import SideBar from '../drawer/index';
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home'})
    ]
});

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

export default class ApplicationManager extends Component {
    static navigationOptions = {
        header:null
    };

     constructor(props) {
        super(props)

        let initialPage = 0;


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
            drawerState:''

        }


    }

    onChangeTab(ref){
         let component = 'home';
         switch (ref.i){
             case 0:

                 break;
             case 2:
                 component ='AddProduct'
                 break;
             case 3:
                 component ='addBusiness'
                 break;
             case 4:
                 component ='addPromotions'
                 break;
             case 1:
                 component ='AddGroups'
                 break;

         }


         this.setState({
             addComponent: component,
             index : ref.i,
         });

    }







    extractTabIndexFromNavigation(){

        return this.state.initialPage;


    }

    showAction(index){
        switch (index){
            case 0:
                return false;
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                return true;
            case 4:
                return true;
        }

    }
    componentWillMount() {
        this.props.navigation.dispatch(resetAction);

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


        if(this.props.navigation.state.key == 'Init0') {

            return (

                    <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar/>}
                onClose={() => closeDrawer} >
                        <Container>
                            <GeneralComponentHeader openDrawer= {openDrawer} navigate={this.props.navigation.navigate} showAction={showAction} current='home'
                                                    to={this.state.addComponent}/>

                <Tabs initialPage={index} onChangeTab={this.onChangeTab.bind(this)} style={{backgroundColor: '#fff',}}>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>Home</Text></TabHeading>}>
                        <Feeds index={0} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab
                        heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text style={{color: 'black', fontSize: 11,}}>Groups</Text></TabHeading>}>
                        <Groups navigation={this.props.navigation} index={4}
                                navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }} ><Text
                        style={{color: 'black', fontSize: 11,}}>Products</Text></TabHeading>}>
                        <Product index={1} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text
                        style={{color: 'black', fontSize: 11,}}>Buiesness</Text></TabHeading>}>
                        <Business index={2} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab heading={ <TabHeading style={{ backgroundColor: "#ffe6e6" }}><Text
                        style={{color: 'black', fontSize: 11,}}>Promotions</Text></TabHeading>}>
                        <Promotions index={3} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>

                </Tabs>

                        </Container>
            </Drawer>
               );
        }
        return  <Container></Container>;



    }
}



