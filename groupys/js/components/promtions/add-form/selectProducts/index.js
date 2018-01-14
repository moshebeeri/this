import React, {Component} from "react";
import {connect} from "react-redux";
import {Platform, Provider} from "react-native";
import {Container, Content, Text, Button, Body, Fab, Icon, Left, ListItem, Right, Thumbnail} from "native-base";
import {bindActionCreators} from "redux";
import * as promotionsAction from "../../../../actions/promotions";
import strings from "../../../../i18n/i18n"
import {I18nManager} from 'react-native';
class SelectProductsComponent extends Component {
    constructor(props) {
        super(props);
    }

    navigateToAdd() {
        this.props.navigation.navigate("AddProduct", {business: {_id: this.props.navigation.state.params.businessId}});
    }

    selectProduct(product) {
        this.props.navigation.state.params.selectProduct(product)
        this.props.navigation.goBack();
    }

    render() {
        const {businesses} = this.props;
        let index = 0;
        let productsRows = undefined
        const products = businesses.businessesProducts[this.props.navigation.state.params.businessId];
        if (products && products.length > 0) {
            productsRows = products.map((r, i) => {
                index++;
                if (r.pictures.length > 0) {
                    return <ListItem key={index} thumbnail>
                        <Left>
                            {I18nManager.isRTL &&       <Thumbnail square size={80} source={{uri: r.pictures[0].pictures[3]}}/>}
                            {!I18nManager.isRTL &&   <Button transparent
                                                             onPress={() => this.selectProduct(r)}
                            >
                                <Text>{strings.Select}</Text>
                            </Button>}

                        </Left>
                        <Body  style={{ alignItems:  'flex-start' , justifyContent:  'flex-start' ,}}>
                        <Text style={{ justifyContent: 'flex-start' ,}}>{r.name}</Text>
                        <Text style={{ justifyContent: 'flex-start',}}note>{r.info}</Text>
                        </Body>
                        <Right>
                            {!I18nManager.isRTL &&  <Thumbnail square size={80} source={{uri: r.pictures[0].pictures[3]}}/>}

                            {I18nManager.isRTL &&   <Button transparent
                                                            onPress={() => this.selectProduct(r)}
                            >
                                <Text>{strings.Select}</Text>
                            </Button>}
                        </Right>
                    </ListItem>
                }
                return <ListItem key={index} thumbnail style={{backgroundColor: '#fff'}}>
                    <Left>
                        {I18nManager.isRTL && <Thumbnail square size={80} source={require('../../../../../images/client_1.png')}/>}
                        {!I18nManager.isRTL &&   <Button transparent
                                                        onPress={() => this.selectProduct(r)}
                        >
                            <Text>{strings.Select}</Text>
                        </Button>}
                    </Left>
                    <Body  style={{ alignItems: 'flex-start', justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',}}>

                    <Text style={{ justifyContent:  'flex-start' ,}}>{r.name}</Text>
                    <Text style={{ justifyContent: 'flex-start' }}note>{r.info}</Text>
                    </Body>
                    <Right>
                        {!I18nManager.isRTL && <Thumbnail square size={80} source={require('../../../../../images/client_1.png')}/>}

                        {I18nManager.isRTL &&   <Button transparent
                                onPress={() => this.selectProduct(r)}
                        >
                            <Text>{strings.Select}</Text>
                        </Button>}
                    </Right>
                </ListItem>
            });
        }
        return (

            <Container>
                <Content style={{backgroundColor: '#fff'}}>


                    {productsRows}

                </Content>
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#ff6400"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="ios-add"/>

                </Fab>
            </Container>


        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'SelectProductsComponent') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        promotions: state.promotions,
        products: state.products,
        businesses: state.businesses,
        currentScreen: state.render.currentScreen,
    }),
    dispatch => bindActionCreators(promotionsAction, dispatch)
)(SelectProductsComponent);