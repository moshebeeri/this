import React, {Component} from 'react';
import {Image, Platform, ListView,TouchableOpacity, FlatList,View} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container, Content, Text, Title, InputGroup,
    Input, Button, Icon,  Header, Body, Right, ListItem, Tabs, Tab, Spinner, TabHeading, Thumbnail, Left
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


    _renderItem(item) {
        return <View>
            <Text> what + {item.item.value}</Text>
        </View>
    }
    renderItem(item) {
        const {navigation, token, userFollowers, group, ItemDetail, actions, entity,location} = this.props;
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
    onEndReach(){
        const {feeds, token,  actions, entity, } = this.props;
        actions.setNextFeeds(feeds, token, entity);
        this.goToEnd();
    }

    render() {
        const { loadingDone, showTopLoader, feeds ,update, setNextFeeds,color} = this.props;
        const topLoader = showTopLoader ? <View><Spinner color='red'/></View> : null;
        if (!loadingDone) {
            return <View><Spinner color='red'/></View>;
        }
        const spining = undefined;
        let backgroundColor = '#e7e7e7';
        if(color){
            backgroundColor = color;
        }

        if (setNextFeeds) {
            return (

                <View  style={{backgroundColor: backgroundColor}}>
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

            <View  style={{backgroundColor: backgroundColor}}>
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





    goToEnd() {
        if (this.refs && this.refs.flatList) {
            this.refs.flatList.scrollToEnd({animated: false});
        }
    }
}






