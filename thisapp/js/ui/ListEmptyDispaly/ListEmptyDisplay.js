import React, {Component} from 'react';
import {Image, View} from 'react-native';
import StyleUtils from '../../utils/styleUtils'

const empty = require('../../../images/THIS-symbol-gray.png');
export default class ListEmptyDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View style={{width: StyleUtils.getWidth(),alignItems:'center',justifyContent:'center'}}>
            <Image style={{width: StyleUtils.scale(200), height: StyleUtils.scale(200)}} source={empty}/>

        </View>
    }
}




