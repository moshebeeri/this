
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,Provider
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import CheckBox from 'react-native-check-box'
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';
import AddFormHeader from '../../../header/addFormHeader';

import styles from './styles';


class SelectProductsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {

            productList:props.products,

        };
    }



    render() {
        let index = 0;
        let productsRows = this.state.productList.map((r, i) => {
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

                      <Button transparent
                              onPress={() => this.props.selectProduct(r)}
                      >
                          <Text>Select</Text>
                      </Button>
                  </Right>
                </ListItem>
            }
            return <ListItem key={index} thumbnail style={{  backgroundColor: '#fff'}}>
              <Left>
                  <Thumbnail square size={80} source={require('../../../../../images/client_1.png')} />
              </Left>
              <Body>

              <Text>{r.name}</Text>
              <Text note>{r.info}</Text>
              </Body>
              <Right>
                  <Button transparent
                          onPress={() => this.props.selectProduct(r)}
                  >
                      <Text>Select</Text>
                  </Button>
              </Right>
            </ListItem>
        });
        return (
            <Provider>
            <Container>
              <Content  style={{  backgroundColor: '#fff'}}>




                  { productsRows }

              </Content>
            </Container>
            </Provider>

        );
  }
}

function bindAction(dispatch) {
  return {
      replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    openDrawer: () => dispatch(openDrawer()),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SelectProductsComponent);
