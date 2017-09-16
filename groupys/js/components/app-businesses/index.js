import React, {Component} from 'react';
import {Image, Platform,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab, TabHeading,Thumbnail,Left,Drawer,Fab} from 'native-base';

import GeneralComponentHeader from '../header/index';

import Business from '../business/index';





import SideBar from '../drawer/index';



import { bindActionCreators } from "redux";

import * as businessAction from "../../actions/business";

class ApplicationBusinessManager extends Component {
    static navigationOptions = {
        header:null
    };


     constructor(props) {
        super(props)

        this.state = {


            drawerState:'',


        }


    }
    replaceRoute(route) {

        this.props.navigation.navigate(route);
    }










     navigateToAdd(){
        this.replaceRoute('addBusiness');
     }


     componentWillMount() {

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

    }

    render() {

        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };

        const fav =
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: "#ff6400" }}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="add" />

                </Fab>



            return (

                    <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar navigation={this.props.navigation}/>}
                onClose={() => closeDrawer} >

                        <Container>
                            <GeneralComponentHeader showBack={true} openDrawer= {openDrawer} navigation={this.props.navigation} navigate={this.props.navigation.navigate} showAction={true} current='home'
                                                    to={this.state.addComponent}/>

                         <Business navigation={this.props.navigation} ndex={1} navigateAction={this.headerAction.bind(this)}/>



                            {fav}
                        </Container>
            </Drawer>
               );



    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),

    dispatch => bindActionCreators(businessAction, dispatch)
)(ApplicationBusinessManager);


