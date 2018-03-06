import React, {Component} from 'react';
import {Text,Platform} from 'react-native';


export default class ThisText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Text ellipsizeMode={this.props.ellipsizeMode} numberOfLines={this.props.numberOfLines} onPress={this.props.onPress} note={this.props.note} style={[this.props.style, {fontFamily: (Platform.OS === 'ios') ? 'Helvetica Neue' : 'Roboto-Regular'}]}>{this.props.children}</Text>
    }
}
