import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';

export default class PunchView extends Component {
    constructor(props) {
        super(props);
    }





    render() {
        const {color,numberOfPunches,numberRealized} = this.props;
        let row = this.createPunches(numberOfPunches,numberRealized);
        return  <View style={styles.container}>{row}</View>
    }
    createPunches(number,numberRealized){

        let row =[];
        for (i = 0; i < number; i++) {
            let isFull = false;
            if(numberRealized && i < numberRealized){
                isFull = true;
            }
            row.push(this.createPunch(i,isFull));
        }
        return row
    }



    createPunch(index,isFull){
        let style = styles.punch;
        if(this.props.feed) {
            style = styles.punchFeed;
        }
        if(isFull){
            style = styles.punchFeedFull;
        }
        return <View key={index}style={style}></View>
    }
}
