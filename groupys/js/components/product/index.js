import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import ProductsHeader from './header';


import store from 'react-native-simple-store';



const {
    replaceAt,
} = actions;


class Product extends Component {

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
            rowsView: []
        }
        ;

        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {

            stateFunc({
                    token: storeToken
                }
            );
        });
        store.get('user_id').then(storeUserId => {
            stateFunc({
                    userId: storeUserId
                }
            );
        });


    }

    fetchProducts(){
        let stateFunc = this.setState.bind(this);


        store.get('token').then(storeToken => {
            fetch(`${server_host}/api/products`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + storeToken

                }

            }).then(function (response) {
                if (response.status == '401') {

                    return;
                }


                response.json().then((responseData) => {

                    stateFunc({
                        rowsView: responseData,

                        }
                    );


                })

            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });

        });




    }

    deleteProduct(index){

        fetch(`${server_host}/api/products/` + this.state.rowsView[index-1]._id , {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + this.state.token

            }

        }).then(function (response) {
            if (response.status == '401') {

                return;
            }





        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
        this.fetchProducts();
    }



    replaceRoute(route) {
        this.props.replaceAt('product', {key: route}, this.props.navigation.key);
    }


    componentWillMount(){
        this.fetchProducts();
    }

    render() {



        let index = 0

        let rows = this.state.rowsView.map((r, i) => {
            index++;
            if(r.pictures.length > 0){
                return <ListItem key={index} thumbnail>
                    <Left>
                        <Thumbnail square size={80} source={{uri: r.pictures[0].pictures[3]}} />
                    </Left>
                    <Body>
                    <Text>{r.name}</Text>
                    <Text note>{r.info}</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={() =>  this.deleteProduct(`${index}`)}>
                            <Text>Remove</Text>
                        </Button>
                    </Right>
                </ListItem>
            }
            return <ListItem key={index} thumbnail style={{  backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail square size={80} source={require('../../../images/client_1.png')} />
                </Left>
                <Body>

                <Text>{r.name}</Text>
                <Text note>{r.info}</Text>
                </Body>
                <Right>
                    <Button transparent onPress={() =>  this.deleteProduct(`${index}`)} >
                        <Text>Remove</Text>
                    </Button>
                </Right>
            </ListItem>
        })


        return (

            <Container>
                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <ProductsHeader />

                </Header>


                <Content  style={{  backgroundColor: '#fff'}}>




                    { rows }
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

export default connect(mapStateToProps, bindActions)(Product);
