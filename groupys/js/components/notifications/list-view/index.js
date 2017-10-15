import React, {Component} from "react";
import {Dimensions, TouchableOpacity} from "react-native";
import {Button, Text, Thumbnail, View} from "native-base";
import * as notification from "./notofications";

const covefr = require('../../../../images/cover2.png');
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
export default class NotificationListView extends Component {
    constructor(props) {
        super(props);
    }

    accept() {
        const {item, groupActions, actions} = this.props;
        const viewItem = item.item;
        groupActions.acceptInvatation(viewItem.group);
        actions.doNotification(viewItem._id)
    }

    create(group) {
        const {item, actions} = this.props;
        const viewItem = item.item;
        actions.doNotification(viewItem._id)
        if(group.entity.business) {
            this.props.navigation.navigate("addPromotions", {business: group.entity.business, group: group});
        }

    }

    read(notification_id) {
        const {item, actions} = this.props;
        if (!item.read) {
            actions.readNotification(notification_id)
        }
    }

    render() {
        const {item} = this.props;
        switch (item.item.note) {
            case notification.APPROVE_GROUP_INVATATION:
            case notification.ASK_GROUP_INVATATION:
                return this.createApproveUi(item);
            case notification.ADD_FOLLOW_PROMOTION:
                return this.createFollowUi(item);
            default:
                const viewItem = item.item;
                return <View><Text>new notification with code: {viewItem.id} And note:{viewItem.note} </Text></View>
        }
    }

    extractGroupImage(group) {
        if (group.pictures && group.pictures.length > 0) {
            return <Thumbnail source={{uri: group.pictures[0].pictures[3]}}/>
        } else {
            if (group.entity && group.entity.business) {
                return <Thumbnail source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
            }
        }
        return <Thumbnail source={require('../../../../images/client_1.png')}/>
    }

    getNotificationColor(viewItem) {
        if (viewItem.read) {
            return 'white';
        }
        return '#fef8e0'
    }

    getActionStyle(viewItem) {
        if (viewItem.read) {
            return {
                backgroundColor: 'white',
                width: width,
                height: vh * 9,
                justifyContent: 'center',
                alignItems: 'center',
                flex: -1,
            }
        }
        return {
            backgroundColor: '#fef8e0',
            width: width,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flex: -1,
        }
    }

    getAction(viewItem, actionStyle, reddemStyle) {
        if (viewItem.action) {
            return undefined;
        }
        return <View style={actionStyle}>
            <Button style={reddemStyle} onPress={this.accept.bind(this)}>
                <Text style={{fontWeight: 'bold', color: '#e65100'}}>Accept</Text>
            </Button>
        </View>
    }

    getAction

    getPromotionAction(viewItem, actionStyle, reddemStyle) {
        if (viewItem.action) {
            return undefined;
        }
        return <View style={actionStyle}>
            <Button style={reddemStyle} onPress={this.create.bind(this,viewItem.group)}>
                <Text style={{fontWeight: 'bold', color: '#e65100'}}>Create</Text>
            </Button>
        </View>
    }

    createApproveUi(item) {
        const viewItem = item.item;
        const group = viewItem.group;
        const user = viewItem.actor_user;
        const image = this.extractGroupImage(group);
        const reddemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: width / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: width / 2,
            backgroundColor: 'white',
            borderColor: '#e65100',
        };
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getAction(viewItem, actionStyle, reddemStyle);
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
                    <View style={{flexDirection: 'column', width: width - 50, height: vh * 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', marginLeft: vw * 4}}>{user.name}</Text>
                            <Text style={{height: vh * 4}}> invites you to join group </Text>
                        </View>
                        <Text style={{
                            marginLeft: vw * 3,
                            fontWeight: 'bold',
                            height: vh * 5,
                            width: nameWidth
                        }}> {viewItem.group.name} </Text>
                    </View>
                </TouchableOpacity>
                {action}
            </View>
        );
    }

    createFollowUi(item) {
        const viewItem = item.item;
        const group = viewItem.group;
        const user = viewItem.actor_user;
        const reddemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: width / 4,
            borderWidth: 1,
            flexDirection: 'row',
            height: 40,
            width: width / 2,
            backgroundColor: 'white',
            borderColor: '#e65100',
        };
        const image = this.extractGroupImage(group);
        const backgroundColor = this.getNotificationColor(viewItem);
        const actionStyle = this.getActionStyle(viewItem);
        const action = this.getPromotionAction(viewItem, actionStyle, reddemStyle);
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
                    <View style={{flexDirection: 'column', marginLeft: 5, width: width - 50, height: vh * 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text numberOfLines={2} style={{width: vw * 75, height: vh * 7}}>Create a promotion for
                                everyone who joins group
                                <Text style={{
                                    marginLeft: vw * 3,
                                    fontWeight: 'bold',
                                    height: vh * 5,
                                    width: nameWidth
                                }}> {viewItem.group.name} </Text>
                            </Text>
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
