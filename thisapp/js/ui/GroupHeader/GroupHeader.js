import React, {Component} from 'react';
import {TouchableOpacity, View,I18nManager} from 'react-native';
import {Button, Thumbnail} from 'native-base';
import styles from './styles'
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import {ImageController} from '../index'
import {ThisText} from '../../ui/index';
import {connect} from 'react-redux';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {bindActionCreators} from "redux";
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
import * as groupActions from "../../actions/groups";

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);

class GroupHeader extends Component {
    constructor(props) {
        super(props);
    }

    createImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            if (group.pictures[group.pictures.length - 1].pictures[3]) {
                return <ImageController thumbnail size={StyleUtils.scale(50)}
                                        source={{uri: group.pictures[group.pictures.length - 1].pictures[3]}}/>
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
            case 'USER':
                return strings.PublicGroup; //change to icons @yb
            case 'BUSINESS':
                return strings.BusinessGroup;
        }
    }
    isMyGroup(){
        const {businesses,group,user} = this.props;
        let business = group.entity.business;
        if(business && businesses.myBusinesses[business._id]){
            return true;
        }

        let groupUser = group.entity.user;
        if(groupUser && groupUser._id  ===  user._id){
            return true;
        }

        return false;

    }
    unFollowGroup() {
        const {group,actions,user} = this.props;
        actions.unFollowGroup(group._id);
    }

    render() {
        const {group, noColor, enablePress, onPressAction,showUnfollow} = this.props;
        let containerStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 0, marginLeft: 20};
        if (noColor) {
            containerStyle = {};
        }
        let disabled = true;
        if (enablePress) {
            disabled = false;
        }
        let menuAction = <Menu>
            <MenuTrigger placement="right">
                <Icon2 style={{color: 'black', paddingLeft: 10, fontSize: StyleUtils.scale(15)}}
                       name="options"/>
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {marginLeft: I18nManager.isRTL ? 100 : 0}}}>

            <MenuOption onSelect={this.unFollowGroup.bind(this)}>
                    <ThisText style={{padding: 10, paddingTop: 5}}>{strings.unfollowGroup}</ThisText>
                </MenuOption>
            </MenuOptions>
        </Menu>;
        return <TouchableOpacityFix onPress={onPressAction} disabled={disabled} style={containerStyle}>
            <View style={[styles.groupHeader, {width: StyleUtils.getWidth()}]}>
                <View style={styles.groupImage}>
                    {this.createImage(group)}

                </View>
                <View style={styles.groupName}>
                    <View style={{flexDirection: 'row' ,justifyContent:'space-between'}}>
                        <ThisText numberOfLines={2} style={styles.groupNameText}>{group.name}</ThisText>
                        {!this.isMyGroup() && showUnfollow &&<View style={{marginLeft:StyleUtils.scale(25)}}>
                            {menuAction}
                        </View>}
                    </View>
                    <View style={{
                        flexDirection: 'row', flex: 5, marginTop: 8,
                        alignItems: 'center'
                    }}>
                        <ThisText
                            style={[styles.groupEntity, {marginRight: 5}]}>{this.createTitle(group.entity_type)}</ThisText>


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

export default connect(
    state => ({
        businesses: state.businesses,
        user: state.user.user,
    }),
    dispatch => ({
        actions: bindActionCreators(groupActions, dispatch)
    })
)(GroupHeader);

