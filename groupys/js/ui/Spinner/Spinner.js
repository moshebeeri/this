import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Spinner} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window');
export default class MySpinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {height,simple} = this.props;
        if(simple) {
            return <View>
                <Spinner color='#FA8559'></Spinner>
            </View>
        }
        let viewStyle = styles.spinnerContainer;
        if (height) {
            viewStyle = {
                alignItems: 'center',
                justifyContent: 'center',
                width: width,
                height: height,
                opacity: 0.8,
                flex: 1,
                backgroundColor: 'white',
                position: 'absolute',
            }
        }
        return <View style={viewStyle}>
            <Spinner color='#FA8559'></Spinner>
        </View>
    }
}
