import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Spinner} from 'native-base';
import styles from './styles';
import Triangle from './Triangale'
import StyleUtils from '../../utils/styleUtils'
const {width, height} = Dimensions.get('window');
export default class PromotionSeperator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {height, simple,narrowWidth} = this.props;
        let defaultNarrow = 0;
        if(narrowWidth){
            defaultNarrow = narrowWidth;
        }
        let seperatorContainer = {
            alignItems:'center',
                justifyContent: 'space-between',

                height:20,
                flexDirection:'row',
                flex: 1,
                width:StyleUtils.getWidth() - defaultNarrow,

                backgroundColor:'white',
                position: 'absolute',
        }
        return <View style={seperatorContainer}>

            <View style={{flex: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
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

        </View>
    }
}
