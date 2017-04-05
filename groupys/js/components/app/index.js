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

import store from 'react-native-simple-store';


const {
    replaceAt,
} = actions;

class GenericFeedManager extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


     constructor(props) {
        super(props);



        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            ready: true,
            addComponent:'',
            rowsView: [],
            initialPage: 0
        }
        ;




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

         }

         this.setState({
             addComponent: component,
             initialPage: ref.i
         });

    }







    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
    }


    extractTabIndexFromNavigation(){
        if(this.props.scene){
            if(this.props.scene.scenes && this.props.scene.scenes.length == 2){
                let productKey = this.props.scene.scenes[1].route.key;
                switch (productKey){
                    case 'home':
                        return 0;
                    case 'add-product':
                        return 1;
                    case 'add-business':
                        return 2;
                    case 'add-promotions':
                        return 3;
                }

                return this.state.initialPage;
            }


        }
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
        }

    }

    componentWillMount(){

    }

   async headerAction(compoenet, index){
       this.setState({
            initialPage:index,
            addComponent:compoenet,
        })
    }
    render() {
        let index = this.extractTabIndexFromNavigation();
        let showAction = this.showAction(index);

        return (
            <Container>

                <GeneralComponentHeader  showAction = {showAction} current='home' to={this.state.addComponent} />


                <Tabs onChangeTab={this.onChangeTab.bind(this)} initialPage={index} style={{ backgroundColor: '#fff',}}>
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

export default connect(mapStateToProps, bindActions)(GenericFeedManager);
