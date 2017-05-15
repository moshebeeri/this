import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';



const {
    replaceAt,
} = actions;
;

class GenericListGroupView extends Component {


    constructor(props) {
        super(props);

    }


    replaceRoute(route) {
        this.props.replaceAt('groups', { key: route }, this.props.navigation.key);
    }

    showGroupFeeds(){
        this.replaceRoute('groupfeeds');
    }

    render() {

        let row = undefined

        if(this.props.item.pictures.length > 0){
            row =  <ListItem key={this.props.index}  onPress={this.showGroupFeeds.bind(this)} thumbnail>
                <Left>
                    <Thumbnail square size={80} source={{uri: this.props.item.pictures[0].pictures[3]}} />
                </Left>
                <Body>
                <Text>{this.props.item.name}</Text>
                <Text note>{this.props.item.info}</Text>
                </Body>
                <Right>
                    <text>Promotion Available: 5 </text>
                </Right>
            </ListItem>
        }else {
            row =  <ListItem key={this.props.index}  onPress={this.showGroupFeeds.bind(this)} thumbnail style={{backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail square size={80} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <Text>{this.props.item.name}</Text>
                <Text note>{this.props.item.info}</Text>
                </Body>
                <Right>
                    <text>Promotion Available: 5 </text>
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

export default connect(mapStateToProps, bindActions)(GenericListGroupView);
