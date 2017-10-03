/**
 * Created by roilandshut on 23/08/2017.
 */
/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image, Platform, PanResponder, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Thumbnail,
    Button,
    Picker,
    Right,
    Item,
    Left,
    Header,
    Footer,
    Body,
    View,
    Card,
    CardItem
} from 'native-base';
import * as componentCreator from "./feedCommonView";

export default class FeedWelcome extends Component {
    render() {
        return this.createWelcome(this.props.item)
    }

    createWelcome(item) {
        const styles = componentCreator.createStyle();
        const result =
            <View style={styles.Welcome_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.welcome_upperContainer}>
                        <View style={styles.logo_view}>

                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.name} </Text>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>
                            <Text style={styles.promotion_text_description}>{item.message}</Text>

                        </View>
                    </View>


                </View>
            </View>
        return result;
    }
}