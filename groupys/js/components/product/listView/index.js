import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';



const {
    replaceAt,
} = actions;
;

class ProductListView extends Component {


    constructor(props) {
        super(props);

    }





    render() {

        let row = undefined

        if(this.props.product.pictures.length > 0){
            row =  <ListItem key={this.props.index} thumbnail>
                <Left>
                    <Thumbnail square size={80} source={{uri: this.props.product.pictures[0].pictures[3]}} />
                </Left>
                <Body>
                <Text>{this.props.product.name}</Text>
                <Text note>{this.props.product.info}</Text>
                </Body>
                <Right>
                    <Button transparent onPress={() =>  this.props.deleteProduct(`${this.props.index}`)}>
                        <Text>Remove</Text>
                    </Button>
                </Right>
            </ListItem>
        }else {
            row =  <ListItem key={this.props.index} thumbnail style={{backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail square size={80} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <Text>{this.props.product.name}</Text>
                <Text note>{this.props.product.info}</Text>
                </Body>
                <Right>
                    <Button transparent onPress={() =>  this.props.deleteProduct(`${this.props.index}`)}>
                        <Text>Remove</Text>
                    </Button>
                </Right>
            </ListItem>
        }



        return ( row

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

export default connect(mapStateToProps, bindActions)(ProductListView);
