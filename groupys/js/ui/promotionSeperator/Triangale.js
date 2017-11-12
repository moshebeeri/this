


import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Spinner} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window');
export default class Triangle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const{right} = this.props;
        let style = styles.triangleLeft;
        if(right){
            style = styles.triangleRight;
        }
        return <View style={style}>

        </View>
    }
}
