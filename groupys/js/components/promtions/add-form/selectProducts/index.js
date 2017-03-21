
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import CheckBox from 'react-native-check-box'
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';
import AddPromotionHeader from '../header';

import styles from './styles';

const {
    replaceAt,
} = actions;


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
                    <CheckBox
                        onClick={()=>this.props.selectProduct(r)}
                        isChecked={r.checked}

                    />

                  </Left>
                  <Body>
                  <Text>{r.name}</Text>
                  <Text note>{r.info}</Text>
                  </Body>
                  <Right>
                    <Thumbnail square size={80} source={{uri: r.pictures[0].pictures[3]}} />
                  </Right>
                </ListItem>
            }
            return <ListItem key={index} thumbnail style={{  backgroundColor: '#fff'}}>
              <Left>
                <CheckBox
                    onClick={()=>this.props.selectProduct(r)}
                    isChecked={r.checked}

                />
              </Left>
              <Body>

              <Text>{r.name}</Text>
              <Text note>{r.info}</Text>
              </Body>
              <Right>
                <Thumbnail square size={80} source={require('../../../../../images/client_1.png')} />
              </Right>
            </ListItem>
        });
        return ( <Container>
              <Content  style={{  backgroundColor: '#fff'}}>

                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}>
                  <AddPromotionHeader />
                </Header>


                  { productsRows }
                <Footer>

                  <Button transparent
                          onPress={() => this.showProducts(false)}
                  >
                    <Text>Select</Text>
                  </Button>
                </Footer>
              </Content>
            </Container>

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
