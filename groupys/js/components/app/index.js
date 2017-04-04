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

    async fetchList(){
        try {
            let response = await this.props.api.getAll();
            this.setState({
                rowsView: response
            })

        }catch (error){
            console.log(error);
        }



    }





    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
    }


   async componentWillMount(){
      let initialPage =  await store.get("initialPage");
      if(!initialPage){
          initialPage = 0;
      }
       this.setState({
           initialPage:initialPage,
       })
    }

   async headerAction(compoenet, index){
        await store.save("initialPage",index);
        this.setState({
            addComponent:compoenet,
        })
    }
    render() {


        return (
            <Container>

                <GeneralComponentHeader  current='home' to={this.state.addComponent} />


                <Content  style={{  backgroundColor: '#fff'}}>
                    <Tabs initialPage={this.state.initialPage} style={{ backgroundColor: '#fff',}}>
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


                </Content>
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
