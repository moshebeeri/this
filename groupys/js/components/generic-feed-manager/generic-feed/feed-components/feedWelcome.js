/**
 * Created by roilandshut on 23/08/2017.
 */
/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image, PanResponder, Platform, TouchableHighlight} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Text,
    Thumbnail,
    View
} from 'native-base';
import * as componentCreator from "./feedCommonView";
import StyleUtils from '../../../../utils/styleUtils'
import {ThisText} from '../../../../ui/index';

export default class FeedWelcome extends Component {
    render() {
        return this.createWelcome(this.props.item)
    }

    createWelcome(item) {
        const styles = componentCreator.createStyle();
        const result =
            <View  style={[styles.Welcome_container, {width: StyleUtils.getWidth()}]}>
                <View  style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>
                    <View style={styles.welcome_upperContainer}>
                        <View style={styles.logo_view}>

                            <View style={{flexDirection: 'column'}}>
                                <ThisText style={styles.promotion_nameText} note>{item.name} </ThisText>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>
                            <ThisText style={styles.promotion_text_description}>{item.message}</ThisText>

                        </View>
                    </View>


                </View>
            </View>
        return result;
    }
}