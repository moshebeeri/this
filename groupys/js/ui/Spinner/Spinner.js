import React, {Component} from 'react';
import {Dimensions, TextInput, View} from 'react-native';
import {Spinner} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window');
export default class MySpinner extends Component {
    constructor(props) {
        super(props);

    }


    render() {
       return  <View style={styles.spinnerContainer}>
        <Spinner color='#FA8559'></Spinner>
       </View>
    }
}
