import React, {Component} from 'react';
import {Text} from 'react-native';

export default class ThisText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Text note={this.props.note} style={[this.props.style, {}]}>{this.props.children}</Text>
    }
}
