import React, {Component} from "react";
import {Image, Platform, TouchableOpacity, Dimensions} from "react-native";
import {Text, Button, View, Thumbnail} from "native-base";

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

    read(notification_id) {
        const {item, actions} = this.props;
        if (!item.read) {
            actions.readNotification(notification_id)
        }
    }

    createView() {
        const {item} = this.props;
        const viewItem = item.item;
        if (viewItem.note === "approve_invite" || viewItem.note === "ask_invite") {
            let group = viewItem.group;
            let user = viewItem.actor_user;
            let image = <Thumbnail source={require('../../../../images/client_1.png')}/>
            if (group.pictures && group.pictures.length > 0) {
                image = <Thumbnail source={{uri: group.pictures[0].pictures[3]}}/>
            } else {
                if (group.entity && group.entity.business) {
                    image = <Thumbnail source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
                }
            }
            let reddemStyle = {
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
            let backgroundColor = '#fef8e0'
            let actionStyle = {
                backgroundColor: '#fef8e0',
                width: width,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flex: -1,
            }
            if (viewItem.read) {
                backgroundColor = 'white';
                actionStyle = {
                    backgroundColor: 'white',
                    width: width,
                    height: vh * 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: -1,
                }
            }
            let action = <View style={actionStyle}>

                <Button style={reddemStyle} onPress={this.accept.bind(this)}>


                    <Text style={{fontWeight: 'bold', color: '#e65100'}}>Accept</Text>


                </Button>
            </View>
            if (viewItem.action) {
                action = undefined;
            }
            let nameWidth = viewItem.group.name.length * 10;
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
        return <View><Text>new notification with code: {viewItem.id} And note:{viewItem.note} </Text></View>
    }

    render() {
        return this.createView();
    }

    renderItem() {
        return this.createView();
    }
}
