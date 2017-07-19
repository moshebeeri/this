/**
 * Created by roilandshut on 19/07/2017.
 */
import React, { Component } from 'react';
import { Image,TextInput, Platform,View} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Thumbnail,Text } from 'native-base';
import styles from './styles'


export default class GroupFeedHeader extends Component {



    navigateBack(){
        this.props.navigation.goBack();
    }
    render() {
        let group = this.props.item;
        let image =  <Thumbnail  square   source={require('../../../../images/client_1.png')}/>
        if(this.props.item.pictures && this.props.item.pictures.length > 0) {
            image =  <Thumbnail  square  source={{uri: this.props.item.pictures[0].pictures[3]}} />

        }
        return <View style={styles.headerContainer}>
            <View style={styles.imageStyle}>
            <Button transparent  onPress={this.navigateBack.bind(this)}>
                <Icon style={{fontSize:35,color:"#2db6c8"}} name="arrow-back" />
            </Button>
            </View>
            <View style={styles.imageStyle}>
            {image}
            </View>
            <View>
                <Text style={styles.group_name_text}>{group.name}</Text>
                <Text  style={styles.group_members}>{group.description}</Text>
            </View>

        </View>
    }
}