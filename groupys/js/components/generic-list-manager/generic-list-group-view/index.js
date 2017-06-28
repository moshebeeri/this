import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';


import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();
export default class GenericListGroupView extends Component {


    constructor(props) {
        super(props);

    }


     showGroupFeeds(props,group){
        groupApi.touch(group._id);
        this.props.navigation.navigate('GroupFeed',{group:group});
    }


    render() {

        let row = undefined

        if(this.props.item.pictures && this.props.item.pictures.length > 0){
            row =  <ListItem key={this.props.index} onPress={this.showGroupFeeds.bind(this,this.props,this.props.item)} thumbnail>
                <Left>
                    <Thumbnail  size={80} source={{uri: this.props.item.pictures[0].pictures[3]}} />
                </Left>
                <Body>
                <Text>{this.props.item.name}</Text>
                <Text note>{this.props.item.info}</Text>
                <Text> New Promotions:  5</Text>
                </Body>
                <Right>

                </Right>
            </ListItem>
        }else {
            row =  <ListItem key={this.props.index} onPress={this.showGroupFeeds.bind(this,this.props,this.props.item)} thumbnail style={{backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail  size={80} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <Text>{this.props.item.name}</Text>
                <Text note>{this.props.item.info}</Text>
                <Text> New Promotions: 5</Text>
                </Body>
                <Right>

                </Right>
            </ListItem>
        }



        return ( row

        );
    }
}

