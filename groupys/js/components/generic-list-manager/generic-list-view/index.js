import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    Title,
    InputGroup,
    Input,
    Button,
    Icon,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';
import {ThisText} from '../../../ui/index';

export default class GenericListView extends Component {
    constructor(props) {
        super(props);
    }

    showProduct(props, item) {
        this.props.navigation.navigate(this.props.addform, {item: item});
    }

    render() {
        let row = undefined
        if (this.props.item.pictures && this.props.item.pictures.length > 0) {
            row = <ListItem style={{backgroundColor: '#fff'}} key={this.props.index}
                            onPress={this.showProduct.bind(this, this.props, this.props.item)} thumbnail>
                <Left>
                    <Thumbnail source={{uri: this.props.item.pictures[0].pictures[3]}}/>
                </Left>
                <Body>
                <ThisText>{this.props.item.name}</ThisText>
                <ThisText note>{this.props.item.info}</ThisText>
                </Body>
                <Right>
                    {/*<Button transparent onPress={() =>  this.props.deleteProduct(`${this.props.index}`)}>*/}
                    {/*<ThisText>Remove</ThisText>*/}
                    {/*</Button>*/}
                </Right>
            </ListItem>
        } else {
            row = <ListItem key={this.props.index} onPress={this.showProduct.bind(this, this.props, this.props.item)}
                            thumbnail style={{backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail size={150} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <ThisText>{this.props.item.name}</ThisText>
                <ThisText note>{this.props.item.info}</ThisText>
                </Body>
                <Right>
                    {/*<Button transparent onPress={() =>  this.props.deleteProduct(`${this.props.index}`)}>*/}
                    {/*<ThisText>Remove</ThisText>*/}
                    {/*</Button>*/}
                </Right>
            </ListItem>
        }
        return ( row

        );
    }
}

