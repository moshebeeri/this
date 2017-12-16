import React, {Component} from 'react';
import {Text, View,I18nManager} from 'react-native';
import {Button, Thumbnail} from 'native-base';
import styles from './styles'
import strings from "../../i18n/i18n"

export default class GroupHeader extends Component {
    constructor(props) {
        super(props);
    }

    createBusinessLogo(business) {
        if (business && business.logo) {
            return <Thumbnail small square source={{uri: business.logo}}/>
        } else {
            return <Thumbnail source={require('../../../images/client_1.png')}/>
        }
    }

    createImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            if (group.pictures[0].pictures[3]) {
                return <Thumbnail medium source={{uri: group.pictures[0].pictures[3]}}/>
            }
        } else {
            if (group.entity && group.entity.business) {
                if (group.entity.business.logo) {
                    return <Thumbnail medium source={{uri: group.entity.business.logo}}/>
                }
            }
        }
        return <Thumbnail medium source={require('../../../images/client_1.png')}/>
    }

    createTitle(groupType) {
        switch (groupType) {
            case 'USERS':
                return 'Public Group';
            case 'BUSINESS':
                return 'Business Group';
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
                            <Text style={styles.businessNameText}>{business.name}</Text>
                        </View>

                    </View>;
            }
        }
        return undefined;
    }

    render() {
        const {group,noColor} = this.props;
        let containerStyle = {backgroundColor:'white'};
        if(noColor){
            containerStyle = {};
        }

        return <View style={containerStyle}>
            <View style={styles.groupHeader}>
                <View style={styles.groupImage}>
                    {this.createImage(group)}

                </View>
                <View style={styles.groupName}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={this.createStyle(group.entity_type)}>{this.createTitle(group.entity_type)} | </Text>
                        {group.social_state &&  <Text>{group.social_state.followers} {strings.Members} </Text>}
                    </View>
                    <View>
                        <Text style={styles.groupNameText}>{group.name}</Text>
                    </View>

                </View>
            </View>

        </View>
    }
}




