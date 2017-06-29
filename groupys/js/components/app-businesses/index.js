import React, {Component} from 'react';
import {Image, Platform,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left,Drawer,Fab} from 'native-base';

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

let updateDialogOption = {
    updateTitle:"update"
}
codePush.sync({updateDialog: updateDialogOption})

import LoginUtils from '../../utils/login_utils'
let lu = new LoginUtils();
import { bindActionCreators } from "redux";

import * as businessAction from "../../actions/business";

 class ApplicationBusinessManager extends Component {
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
            addComponent: 'addBusiness',
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

                 component ='addBusiness'
                 break;
             case 1:
                 component ='AddProduct'

                 break;
             case 2:
                 component ='addPromotions'

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

            default :
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
                    active={showAction}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: "#ffb3b3" }}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon name="add" />

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

                         <Business navigation={this.props.navigation} ndex={1} navigateAction={this.headerAction.bind(this)}/>



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
)(ApplicationBusinessManager);


