import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {Icon, Thumbnail,} from 'native-base';
import {Text, TouchableOpacity, View} from 'react-native';
import {ThisText} from '../../../ui/index';

import styles from './styles'
import strings from "../../../i18n/i18n"

export default class BusinessPreview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let businessName = this.props.business? this.props.business.name : '';
        return <View style={styles.textLayout}>
            <ThisText style={{
                fontWeight: 'bold',
                color: '#FA8559',
                marginLeft: 8,
                marginRight: 8
            }}>{strings.Business}:</ThisText>
            {
                this.props.business ?
                    <View>
                        <ThisText style={{
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{businessName}</ThisText>
                        <Thumbnail square source={{uri: this.props.business.pictures[0].pictures[3]}}/>
                    </View> :
                    <View style={styles.textLayout}>
                        <ThisText style={{
                            fontWeight: 'bold',
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{strings.NoBusinessSelected}</ThisText>
                    </View>
            }
        </View>;
    }
}