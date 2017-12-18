import React, {Component} from 'react';
import {FlatList, Image, ListView, Platform, TouchableOpacity, View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Header,
    Icon,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Spinner,
    Tab,
    TabHeading,
    Tabs,
    Thumbnail,
    Title
} from 'native-base';

export default class GenericFeedManager extends Component {
    constructor(props) {
        super(props);
    }

    async fetchTopList(id) {
        const {token, feeds, group, actions, entity} = this.props;
        if (id === this.props.feeds[0].fid) {
         //   actions.fetchTop(feeds, token, entity, group)
        }
    }

    renderItem(item) {
        const {navigation, token, userFollowers, group, ItemDetail, actions, entity, location} = this.props;
        return <ItemDetail
            user={entity}
            token={token}
            location={location}
            userFollowers={userFollowers}
            group={group}
            navigation={navigation}
            item={item.item}
            fetchTopList={this.fetchTopList.bind(this)}
            actions={actions}/>
    }

    onEndReach() {
        const {feeds, token, actions, entity,} = this.props;
        actions.setNextFeeds(feeds, token, entity);
    }

    render() {
        const {loadingDone, showTopLoader, feeds, update, setNextFeeds, color} = this.props;
        const topLoader = showTopLoader ? <View><Spinner color='red'/></View> : null;
        if (!loadingDone) {
            return <View><Spinner color='red'/></View>;
        }
        const spining = undefined;
        let backgroundColor = '#cccccc';
        if (color) {
            backgroundColor = color;
        }
        if (setNextFeeds) {
            return (

                <View style={{backgroundColor: 'white'}}>
                    {topLoader}

                    <FlatList
                        inverted
                        data={feeds}
                        ref='flatList'
                        onEndReached={setNextFeeds}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                        keyExtractor={(item, index) => index}


                    />

                    {spining}

                </View>

            );
        }
        return (

            <View style={{backgroundColor: backgroundColor}}>
                {topLoader}
                <FlatList
                    ref='flatList'
                    data={feeds}
                    onEndReached={this.onEndReach.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    extraData={update}

                />

                {spining}

            </View>

        );
    }
}






