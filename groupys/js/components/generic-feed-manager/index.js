import React, {Component} from 'react';
import {Image, Platform, ListView, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container, Content, Text, Title, InputGroup,
    Input, Button, Icon, View, Header, Body, Right, ListItem, Tabs, Tab, Spinner, TabHeading, Thumbnail, Left
} from 'native-base';
import {bindActionCreators} from "redux";

export default class GenericFeedManager extends Component {
    constructor(props) {
        super(props);
    }

    async fetchTopList(id) {
        const {token, feeds, group, actions, entity} = this.props;
        if (id === this.props.feeds[0].fid) {
            actions.fetchTop(feeds, token, entity, group)
        }
    }

    renderItem(item) {
        const {navigation, token, userFollowers, group, ItemDetail, actions, entity} = this.props;
        return <ItemDetail
            user={entity}
            token={token}
            userFollowers={userFollowers}
            group={group}
            navigation={navigation}
            item={item.item}
            fetchTopList={this.fetchTopList.bind(this)}
            actions={actions}/>
    }

    render() {
        const {navigation, loadingDone, showTopLoader, feeds, token, userFollowers, group, ItemDetail, actions, entity, update, setNextFeeds} = this.props;
        const topLoader = showTopLoader ? <View><Spinner color='red'/></View> : null
        if (!loadingDone) {
            return <View><Spinner color='red'/></View>;
        }
        const spining = undefined;

        if (setNextFeeds) {
            return (

                <Content removeClippedSubviews={true} style={{backgroundColor: '#e7e7e7'}}>
                    {topLoader}
                    <FlatList
                        data={feeds}
                        onEndReached={setNextFeeds}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                        keyExtractor={(item, index) => index}
                    />

                    {spining}

                </Content>

            );
        }
        return (

            <Content removeClippedSubviews={true} style={{backgroundColor: '#e7e7e7'}}>
                {topLoader}
                <FlatList
                    data={feeds}
                    onEndReached={actions.setNextFeeds(feeds, token, entity)}
                    renderItem={this.renderItem.bind(this)}
                    extraData={update}
                />

                {spining}

            </Content>

        );
    }
}






