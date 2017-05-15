/**
 * Created by roilandshut on 15/05/2017.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';


import { StackNavigator } from 'react-navigation';


export default class ApplicationManager extends Component {
    static navigationOptions = {
        title: 'Groupies',
        header:{}
    };



    constructor(props) {
        super(props)

        let initialPage = 0;

        // if(this.props.scene){
        //     if(this.props.scene.scenes && this.props.scene.scenes.length == 2){
        //         let productKey = this.props.scene.scenes[1].route.key;
        //         switch (productKey){
        //             case 'home':
        //                 initialPage =  0;
        //                 break;
        //             case 'add-product':
        //                 initialPage =  1;
        //                 break;
        //             case 'add-business':
        //                 initialPage =  2;
        //                 break;
        //             case 'add-promotions':
        //                 initialPage =  3;
        //                 break;
        //             case 'add-group':
        //                 initialPage =  4;
        //                 break;
        //         }
        //
        //
        //     }
        //
        //
        // }


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

                <Text> hello</Text>

            </Container>
        );
    }
}




