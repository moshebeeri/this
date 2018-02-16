import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {Icon, Thumbnail,} from 'native-base';
import {Text, TouchableOpacity, View} from 'react-native';
import {ThisText} from '../../../ui/index';

import styles from './styles'
import strings from "../../../i18n/i18n"

export default class UserPreview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let userName = this.props.user? this.props.user.name : '';
        return <View style={styles.textLayout}>
            <ThisText style={{
                fontWeight: 'bold',
                color: '#FA8559',
                marginLeft: 8,
                marginRight: 8
            }}>{strings.User}:</ThisText>
            {
                this.props.user ?
                    <View>
                        <ThisText style={{
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{userName}</ThisText>
                        <Thumbnail square source={{uri: this.props.user.pictures[0].pictures[3]}}/>
                    </View> :
                    <View style={styles.textLayout}>
                        <ThisText style={{
                            fontWeight: 'bold',
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{strings.NoUserSelected}</ThisText>
                    </View>
            }
        </View>;
    }
}