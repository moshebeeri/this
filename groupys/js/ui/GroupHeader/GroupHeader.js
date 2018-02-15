import React, {Component} from 'react';
import {I18nManager, Text, View} from 'react-native';
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
                return strings.PublicGroup;
            case 'BUSINESS':
                return strings.BusinessGroup;
        }
    }

    createStyle(groupType) {
        switch (groupType) {
            case 'BUSINESS':
                return {color: '#e65100'}
            case 'USERS':
                return {color: '#2db6c8'}
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
        const {group, noColor} = this.props;
        let containerStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10, marginLeft: 20};
        if (noColor) {
            containerStyle = {};
        }
        return <View style={containerStyle}>
            <View style={[styles.groupHeader, {width: StyleUtils.getWidth()}]}>
                <View style={styles.groupImage}>
                    {this.createImage(group)}

                </View>
                <View style={styles.groupName}>
                    <View style={{flexDirection: 'row'}}>
                        <ThisText
                            style={this.createStyle(group.entity_type)}>{this.createTitle(group.entity_type)}</ThisText>
                        <ThisText> | </ThisText>
                        {group.social_state && <ThisText>{group.social_state.followers} {strings.Members} </ThisText>}
                    </View>
                    <View>
                        <ThisText style={styles.groupNameText}>{group.name}</ThisText>
                    </View>

                </View>
            </View>

        </View>
    }
}




