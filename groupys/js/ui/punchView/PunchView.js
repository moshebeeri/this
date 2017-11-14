import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';

export default class PunchView extends Component {
    constructor(props) {
        super(props);
    }





    render() {
        const {color,numberOfPunches} = this.props;
        let row = this.createPunches(numberOfPunches);
        return  <View style={styles.container}>{row}</View>
    }
    createPunches(number){
        let row =[];
        for (i = 0; i < number; i++) {
            row.push(this.createPunch(i));
        }
        return row
    }



    createPunch(index){
        let style = styles.punch;
        if(this.props.feed) {
            style = styles.punchFeed;
        }
        return <View key={index}style={style}></View>
    }
}
