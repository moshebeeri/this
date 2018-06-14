import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {Icon, Thumbnail,} from 'native-base';
import {Text, TouchableOpacity, View} from 'react-native';
import {ThisText} from '../../../ui/index';

import styles from './styles'
import strings from "../../../i18n/i18n"

export default class ProductPreview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let productName = this.props.product? this.props.product.name : '';
        return <View style={styles.textLayout}>
            <ThisText style={{
                fontWeight: 'bold',
                color: '#FA8559',
                marginLeft: 8,
                marginRight: 8
            }}>{this.props.type === 'gift' ? strings.Gift : strings.PromotionOn}:</ThisText>
            {
                this.props.product ?
                    <View>
                        <ThisText style={{
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{productName}</ThisText>
                        {this.props.product.pictures.length > 0 ?  <Thumbnail square source={{uri: this.props.product.pictures[0].pictures[3]}}/> : <Thumbnail square source={require('../../../../images/client_1.png')}/> }
                    </View> :
                    <View style={styles.textLayout}>
                        <ThisText style={{
                            fontWeight: 'bold',
                            color: '#FA8559',
                            marginLeft: 8,
                            marginRight: 8
                        }}>{this.props.type === 'gift' ? strings.NoGiftSelected : strings.NoProductSelected}</ThisText>
                    </View>
            }
        </View>;
    }
}