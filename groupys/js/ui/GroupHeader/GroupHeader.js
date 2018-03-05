import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button, Thumbnail} from 'native-base';
import styles from './styles'
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import {ImageController} from '../index'
import {ThisText} from '../../ui/index';

export default class GroupHeader extends Component {
    constructor(props) {
        super(props);
    }

    createBusinessLogo(business) {
        if (business && business.logo) {
            return <ImageController thumbnail size={30} source={{uri: business.logo}}/>
        } else {
            return <ImageController thumbnail size={30} source={require('../../../images/client_1.png')}/>
        }
    }

    createImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            if (group.pictures[group.pictures.length - 1].pictures[3]) {
                return <ImageController thumbnail size={50} source={{uri: group.pictures[0].pictures[3]}}/>
            }
        } else {
            if (group.entity && group.entity.business) {
                if (group.entity.business.logo) {
                    return <ImageController thumbnail size={50} source={{uri: group.entity.business.logo}}/>
                }
            }
        }
        return <ImageController thumbnail size={50} source={require('../../../images/client_1.png')}/>
    }

    createTitle(groupType) {
        switch (groupType) {
            case 'USERS':
                return strings.PublicGroup; //change to icons @yb
            case 'BUSINESS':
                return strings.BusinessGroup;
        }
    }

    createStyle(groupType) {
        switch (groupType) {
            case 'BUSINESS':
                return {color: '#e65100', fontSize: 15}
            case 'USERS':
                return {color: '#2db6c8', fontSize: 15}
        }
    }

    createIcon(groupType) {
        switch (groupType) {
            case 'BUSINESS':
                return <ImageController style={{width: 17, height: 16}}
                                        source={require('../../../images/busiicon.png')}/>
            case 'USERS':
                return <ImageController style={{width: 16, height: 16}}
                                        source={require('../../../images/publicicon.png')}/>
        }
    }

    createBusinessView(business, groupType) {
        if (business) {
            switch (groupType) {
                case 'USERS':
                    return <View style={styles.businessPicker}>
                        <View style={styles.businessTopLogo}>
                            {this.createBusinessLogo(business)}
                        </View>
                        <View style={styles.businessPickerComponent}>
                            <ThisText style={styles.businessNameText}>{business.name}</ThisText>
                        </View>

                    </View>;
            }
        }
        return undefined;
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
        return <TouchableOpacity onPress={onPressAction} disabled={disabled} style={containerStyle}>
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
                        {/*<ThisText style={this.createStyle(group.entity_type)}>{this.createTitle(group.entity_type)}</ThisText>*/}

                        <ImageController
                            style={{marginLeft: 0, marginRight: 8, alignItems: 'flex-start', width: 18, height: 18}}
                            source={require('../../../images/usersicon.png')}/>
                        {group.social_state &&
                        <ThisText style={{fontSize: 15}}>{group.social_state.followers}</ThisText>}


                    </View>

                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end', marginRight: 30
                }}>
                    {this.createIcon(group.entity_type)}
                </View>
            </View>

        </TouchableOpacity>
    }
}




