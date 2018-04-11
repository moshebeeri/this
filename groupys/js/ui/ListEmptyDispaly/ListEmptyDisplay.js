import React, {Component} from 'react';
import {View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import StyleUtils from '../../utils/styleUtils'

export default class ListEmptyDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View>
            <Entypo size={StyleUtils.scale(100)} name={'text-document'}/>
        </View>
    }
}




