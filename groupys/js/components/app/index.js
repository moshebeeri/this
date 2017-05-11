import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left} from 'native-base';

import GeneralComponentHeader from '../header/index';
import Product from '../product/index';
import Business from '../business/index';
import Feeds from '../feed/index'
import Promotions from '../promtions/index'
import Groups from '../groups/index'

import store from 'react-native-simple-store';
import LocationApi from '../../api/location'
import ContactApi from '../../api/contacts'
import BackgroundTimer from 'react-native-background-timer';
let locationApi = new LocationApi();
let contactApi = new ContactApi();
const {
    replaceAt,
} = actions;

class ApplicationManager extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


     constructor(props) {
        super(props)

        let initialPage = 0;

         if(this.props.scene){
             if(this.props.scene.scenes && this.props.scene.scenes.length == 2){
                 let productKey = this.props.scene.scenes[1].route.key;
                 switch (productKey){
                     case 'home':
                         initialPage =  0;
                         break;
                     case 'add-product':
                         initialPage =  1;
                         break;
                     case 'add-business':
                         initialPage =  2;
                         break;
                     case 'add-promotions':
                         initialPage =  3;
                         break;
                     case 'add-group':
                         initialPage =  4;
                         break;
                 }


             }


         }


        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            ready: true,
            addComponent: '',
            rowsView: [],
            initialPage: initialPage,
            index: initialPage

        }
        ;


         // add location

         this.watchID = navigator.geolocation.watchPosition((position) => {
             var lastPosition = JSON.stringify(position);
             console.log(lastPosition);
             locationApi.sendLocation(position.coords.longitude,position.coords.latitude,position.timestamp,position.coords.speed);

             },
             (error) => alert(JSON.stringify(error)),
             {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:100}
         );

         //add contacts
         const intervalId = BackgroundTimer.setInterval(() => {
             // this will be executed every 200 ms
             // even when app is the the background
             contactApi.syncContacts();
         }, 60000);


    }

    onChangeTab(ref){
         let component = 'home';
         switch (ref.i){
             case 0:
                 component ='add-producthome'
                 break;
             case 1:
                 component ='add-product'
                 break;
             case 2:
                 component ='add-business'
                 break;
             case 3:
                 component ='add-promotions'
                 break;
             case 4:
                 component ='add-group'
                 break;

         }


         this.setState({
             addComponent: component,
             index : ref.i,
         });

    }






    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
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



   async headerAction(compoenet, index){
       this.setState({
            addComponent:compoenet,
        })
    }


    render() {


        let showAction = this.showAction(this.state.index);
        let index = this.state.initialPage;

        return (
            <Container>

                <GeneralComponentHeader     showAction = {showAction} current='home' to={this.state.addComponent} />


                <Tabs initialPage={index} onChangeTab={this.onChangeTab.bind(this)} style={{ backgroundColor: '#fff',}}>
                    <Tab  heading={ <TabHeading><Text style={{ color:'black', fontSize: 11,}}>Home</Text></TabHeading>}>
                        <Feeds index={0} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab  heading={ <TabHeading><Text style={{ color:'black',fontSize: 11,}}>Products</Text></TabHeading>}>
                        <Product index={1} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab  heading={ <TabHeading><Text style={{ color:'black',fontSize: 11,}}>Buiesness</Text></TabHeading>}>
                        <Business  index={2} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab   heading={ <TabHeading><Text style={{ color:'black',fontSize: 11,}}>Promotions</Text></TabHeading>}>
                        <Promotions  index={3} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                    <Tab   heading={ <TabHeading><Text style={{ color:'black',fontSize: 11,}}>Groups</Text></TabHeading>}>
                        <Groups  index={4} navigateAction={this.headerAction.bind(this)}/>
                    </Tab>
                </Tabs>

            </Container>
        );
    }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(ApplicationManager);
