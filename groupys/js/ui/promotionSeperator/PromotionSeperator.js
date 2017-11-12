import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Spinner} from 'native-base';
import styles from './styles';
import Triangle from './Triangale'

const {width, height} = Dimensions.get('window');
export default class PromotionSeperator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {height, simple} = this.props;
        return <View style={styles.seperatorContainer}>
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Triangle right/>
            </View>
            <View style={{flex: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
                <View style={styles.roundView}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end',alignItems: 'flex-end'}}>

                <Triangle/>
            </View>
        </View>
    }
}
