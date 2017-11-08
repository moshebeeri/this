import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'native-base';
import styles from './styles'
export default class EditButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onPress} = this.props
        return <TouchableOpacity style={styles.editButtonConntainer}
                                 onPress={onPress}>
            <Icon2 size={20} style={styles.productIcon} name="edit"/>
        </TouchableOpacity>
    }
}




