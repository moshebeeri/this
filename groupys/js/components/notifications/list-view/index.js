import React, {Component} from "react";
import {Dimensions, TouchableOpacity} from "react-native";
import {Button, Text, Thumbnail, View} from "native-base";
import * as notification from "./notofications";
import strings from "../../../i18n/i18n"
import {ThisText,SubmitButton} from '../../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100;
import StyleUtils from "../../../utils/styleUtils";
import FCM from 'react-native-fcm';

export default class NotificationListView extends Component {
    constructor(props) {
        super(props);
    }

    accept() {
        const {item, groupActions, actions} = this.props;
        const viewItem = item.item;
        groupActions.acceptInvitation(viewItem.group);
        actions.doNotification(viewItem._id)
    }
    shouldComponentUpdate() {


        return false;
    }

    notify(notification) {
        const {item, actions} = this.props;
        actions.doNotification(item._id, notification)
    }

    create(group) {
        const {item, actions} = this.props;
        actions.doNotification(item._id)
        if (group.entity.business) {
            this.props.navigation.navigate("addPromotions", {business: group.entity.business, group: group});
        }
    }

    createBusiness(business) {
        const {item, actions} = this.props;
        actions.doNotification(item._id)
        this.props.navigation.navigate("addPromotions", {business: business, onBoardType: 'BUSINESS'});
    }

    read(notification_id) {
        const {item, actions} = this.props;
        if (!item.read) {
            FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number -1));
            actions.readNotification(notification_id)
        }
    }

    render() {
        const {item} = this.props;
        //console.log("rendering notification " )
        switch (item.note) {
            case notification.APPROVE_GROUP_INVITATION:
            case notification.ASK_GROUP_INVITATION:
                return this.createApproveUi(item);
            case notification.ADD_FOLLOW_PROMOTION:
                return this.createFollowUi(item);
            case notification.ADD_BUSINESS_FOLLOW_ON_ACTION:
                return this.createBusinessFollowOn(item);
            default:
                return this.createGeneralAction(item);
        }
    }

    createGeneralAction(item) {
        const viewItem = item;
        const redeemStyle = {
            flex: -1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: StyleUtils.getWidth() / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: StyleUtils.getWidth()  / 2,
            backgroundColor: 'white',
            borderColor: '#2db6c8',
        };
        let title = viewItem.note;
        if (viewItem.title) {
            title = viewItem.title;
        }
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getAvalibaleActions(viewItem, actionStyle, redeemStyle);
        return (
            <View style={{padding: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaeaea'}}
                  regular>
                <TouchableOpacity onPress={() => this.read(viewItem._id)} style={{
                    flex: -1,
                    backgroundColor: backgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                    <View style={{flexDirection: 'column', marginLeft: 5, width: StyleUtils.getWidth() , height: vh * 10}}>
                        <View style={{width: StyleUtils.getWidth()  - 20, flexDirection: 'row'}}>
                            <ThisText numberOfLines={2}
                                  style={{height: vh * 7}}>
                                {title}
                            </ThisText>
                        </View>
                    </View>
                </TouchableOpacity>
                {action}
            </View>


        );
    }

    createBusinessFollowOn(item) {
        const viewItem = item;
        const business = viewItem.business;
        if (!business) {
            return <View></View>;
        }
        const redeemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: StyleUtils.getWidth()  / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: StyleUtils.getWidth()  / 2,
            backgroundColor: 'white',
            borderColor: '#2db6c8',
        };
        const image = this.extractGroupImage(business);
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getPromotioBusinessnAction(viewItem, actionStyle, redeemStyle);
        const nameWidth = viewItem.business.name.length * 10;
        return (
            <View style={{padding: 5, backgroundColor: '#eaeaea'}} regular>
                <TouchableOpacity onPress={() => this.read(viewItem._id)} style={{
                    flex: -1,
                    backgroundColor: backgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {image}
                    <View style={{flexDirection: 'column', marginLeft: 5, width: StyleUtils.getWidth()  - 50, height: vh * 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <ThisText numberOfLines={2}
                                  style={{width: vw * 75, height: vh * 7}}>{strings.CreatePromotionForEveryoneBusiness}
                                <ThisText style={{
                                    marginLeft: vw * 3,
                                    fontWeight: 'bold',
                                    height: vh * 5,
                                    width: nameWidth
                                }}> {viewItem.business.name} </ThisText>
                            </ThisText>
                        </View>
                    </View>
                </TouchableOpacity>
                {action}
            </View>


        );
    }

    extractGroupImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            return <Thumbnail source={{uri: group.pictures[0].pictures[3]}}/>
        } else {
            if (group.entity && group.entity.business && group.entity.business.pictures && group.entity.business.pictures.length > 0) {
                return <Thumbnail source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
            }
        }
        return <Thumbnail source={require('../../../../images/client_1.png')}/>
    }

    getNotificationColor(viewItem) {
        if (viewItem.read) {
            return 'white';
        }
        return '#d3f9ff'
    }

    getActionStyle(viewItem) {
        if (viewItem.read) {
            return {
                backgroundColor: 'white',
                width: StyleUtils.getWidth() ,
                height: vh * 9,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }
        return {
            backgroundColor: '#d3f9ff',
            width: StyleUtils.getWidth() ,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }
    }

    getAvalibaleActions(viewItem, actionStyle, redeemStyle) {
        if (viewItem.actionDone) {
            return undefined;
        }
        if (viewItem.available_actions) {
            switch (viewItem.available_actions) {
                case 'FOLLOW':
                    return <View style={actionStyle}>
                        <TouchableOpacity style={redeemStyle} onPress={this.notify.bind(this, 'FOLLOW')}>
                            <ThisText style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#2db6c8'
                            }}>{strings.Follow}</ThisText>
                        </TouchableOpacity>
                    </View>
                case 'APPROVE':
                    return <View style={actionStyle}>
                        <TouchableOpacity style={redeemStyle} onPress={this.notify.bind(this, 'APPROVE')}>
                            <ThisText style={{fontWeight: 'bold', color: '#2db6c8'}}>{strings.Approve}</ThisText>
                        </TouchableOpacity>
                        <TouchableOpacity style={redeemStyle} onPress={this.notify.bind(this, 'DECLINE')}>
                            <ThisText style={{fontWeight: 'bold', color: '#2db6c8'}}>{strings.Decline}</ThisText>
                        </TouchableOpacity>
                    </View>
            }
        }
    }

    getAction(viewItem, actionStyle, redeemStyle) {
        if (viewItem.actionDone) {
            return undefined;
        }
        return <View style={actionStyle}>
            <SubmitButton  title={strings.Accept.toUpperCase()}  color={'#2db6c8'}
                           onPress={() => this.accept()}/>

        </View>
    }

    getPromotioBusinessnAction(viewItem, actionStyle, redeemStyle) {
        if (viewItem.actionDone) {
            return undefined;
        }
        return <View style={actionStyle}>

            <SubmitButton  title={strings.Create.toUpperCase()} color={'#2db6c8'}
                          onPress={() => this.createBusiness(viewItem.business)}/>

        </View>
    }

    getPromotionAction(viewItem, actionStyle, redeemStyle) {
        if (viewItem.actionDone) {
            return undefined;
        }
        return <View style={actionStyle}>
            <SubmitButton  title={strings.Create.toUpperCase()}  color={'#2db6c8'}
                           onPress={() => this.create(viewItem.group)}/>

        </View>
    }

    createApproveUi(item) {
        const viewItem = item;
        const group = viewItem.group;
        const user = viewItem.actor_user;
        const image = this.extractGroupImage(group);
        const redeemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: StyleUtils.getWidth()  / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: StyleUtils.getWidth()  / 2,
            backgroundColor: 'white',
            borderColor: '#2db6c8',
        };
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getAction(viewItem, actionStyle, redeemStyle);
        const nameWidth = viewItem.group.name.length * 10;
        return (
            <View style={{padding: 5, backgroundColor: '#eaeaea'}} regular>
                <TouchableOpacity onPress={() => this.read(viewItem._id)} style={{
                    flex: -1,
                    backgroundColor: backgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {image}
                    <View style={{flexDirection: 'column', width: StyleUtils.getWidth()  - 50, height: vh * 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <ThisText style={{fontWeight: 'bold', marginLeft: vw * 4}}>{user.name}</ThisText>
                            <ThisText style={{height: vh * 4}}>{strings.InvitesYouToJoinGroup}</ThisText>
                        </View>
                        <ThisText style={{
                            marginLeft: vw * 3,
                            fontWeight: 'bold',
                            height: vh * 5,
                            width: nameWidth
                        }}> {viewItem.group.name} </ThisText>
                    </View>
                </TouchableOpacity>
                {action}
            </View>
        );
    }

    createFollowUi(item) {
        const viewItem = item;
        const group = viewItem.group;
        const user = viewItem.actor_user;
        const redeemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: StyleUtils.getWidth()  / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: StyleUtils.getWidth()  / 2,
            backgroundColor: 'white',
            borderColor: '#2db6c8',
        };
        const image = this.extractGroupImage(group);
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getPromotionAction(viewItem, actionStyle, redeemStyle);
        const nameWidth = viewItem.group.name.length * 10;
        return (
            <View style={{padding: 5, backgroundColor: '#eaeaea'}} regular>
                <TouchableOpacity onPress={() => this.read(viewItem._id)} style={{
                    flex: -1,
                    backgroundColor: backgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {image}
                    <View style={{flexDirection: 'column', marginLeft: 5, width: StyleUtils.getWidth()  - 50, height: vh * 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <ThisText numberOfLines={2}
                                  style={{width: vw * 75, height: vh * 7}}>{strings.CreatePromotionForEveryoneGroup}
                                <ThisText style={{
                                    marginLeft: vw * 3,
                                    fontWeight: 'bold',
                                    height: vh * 5,
                                    width: nameWidth
                                }}> {viewItem.group.name} </ThisText>
                            </ThisText>
                        </View>
                    </View>
                </TouchableOpacity>
                {action}
            </View>


        );
    }

    renderItem() {
        return this.render();
    }
}
