import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'native-base';
import styles from './styles'
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class EditButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onPress,iconName,touchSize,size} = this.props;
        let name = "edit";
        if(iconName){
            name = iconName;
        }
        let style ={};
        let defaultSize = 20;
        if(size){
            defaultSize = size;
        }
        if(touchSize){
            style = {height:touchSize,width:touchSize};
        }
        return <TouchableOpacityFix style={style}
                                 onPress={onPress}>
            <Icon2 size={defaultSize} style={styles.productIcon} name={name}/>
        </TouchableOpacityFix>
    }
}




