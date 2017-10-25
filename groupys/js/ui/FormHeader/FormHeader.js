import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
export default class FormHeader extends Component {
    constructor(props) {
        super(props);
    }

    back() {
        this.props.navigation.goBack();
    }

    render() {
        const {showBack, title, bgc} = this.props;
        let back = undefined;
        if (showBack) {
            back = <Button transparent style={{}} onPress={() => this.back()}>
                <Icon active color={"white"} size={20} name="ios-arrow-back"/>

            </Button>
        }
        return (
            <View style={{
                height: vh * 7, flexDirection: 'row', alignItems: 'center', backgroundColor: bgc,
                justifyContent: 'center',
            }}>
                <View style={styles.formHeaderBackButoon}>
                    {back}
                </View>
                <Text transparent style={styles.formHeadrTitleStyle}>{title}</Text>

            </View>
        );
    }
}


