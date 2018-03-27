import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button, Thumbnail} from 'native-base';
import styles from './styles'
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import {ImageController} from '../index'
import {ThisText} from '../../ui/index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class GroupHeader extends Component {
    constructor(props) {
        super(props);
    }

    createImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            if (group.pictures[group.pictures.length - 1].pictures[3]) {
                return <ImageController thumbnail size={StyleUtils.scale(50)}
                                        source={{uri: group.pictures[0].pictures[3]}}/>
            }
        } else {
            if (group.entity && group.entity.business) {
                if (group.entity.business.logo) {
                    return <ImageController thumbnail size={StyleUtils.scale(50)}
                                            source={{uri: group.entity.business.logo}}/>
                }
            }
        }
        return <ImageController thumbnail size={StyleUtils.scale(50)} source={require('../../../images/client_1.png')}/>
    }

    createTitle(groupType) {
        switch (groupType) {
            case 'USERS':
                return strings.PublicGroup; //change to icons @yb
            case 'BUSINESS':
                return strings.BusinessGroup;
        }
    }

    render() {
        const {group, noColor, enablePress, onPressAction} = this.props;
        let containerStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 0, marginLeft: 20};
        if (noColor) {
            containerStyle = {};
        }
        let disabled = true;
        if (enablePress) {
            disabled = false;
        }
        return <TouchableOpacityFix onPress={onPressAction} disabled={disabled} style={containerStyle}>
            <View style={[styles.groupHeader, {width: StyleUtils.getWidth()}]}>
                <View style={styles.groupImage}>
                    {this.createImage(group)}

                </View>
                <View style={styles.groupName}>
                    <View style={{flexDirection: 'row'}}>
                        <ThisText style={styles.groupNameText}>{group.name}</ThisText>
                    </View>
                    <View style={{
                        flexDirection: 'row', flex: 5, marginTop: 8,
                        alignItems: 'center'
                    }}>
                        <ThisText style={styles.groupEntity}>{this.createTitle(group.entity_type)}</ThisText>


                        {group.social_state && <View style={{flexDirection: 'row'}}>
                            <ThisText style={styles.groupEntity}> | {group.social_state.followers}</ThisText>
                            <ThisText style={styles.groupEntity}> {strings.Members}</ThisText>
                        </View>}


                    </View>

                </View>

            </View>

        </TouchableOpacityFix>
    }
}




