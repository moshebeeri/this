import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
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

    submitForm(){
        const {submitForm} = this.props;
        submitForm()
    }

    render() {
        const {showBack, title, bgc} = this.props;
        let back = undefined;
        if (showBack) {
            back = <Button transparent style={{}} onPress={() => this.back()}>
                <Icon active color={"white"} size={25} name="ios-arrow-back"/>

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
                <View style={styles.formHeaderSubmitButoon}>
                    <Button transparent style={{}} onPress={() => this.submitForm()}>
                        <Icon2 active color={"white"} size={25} name="check"/>

                    </Button>
                </View>
            </View>
        );
    }
}


