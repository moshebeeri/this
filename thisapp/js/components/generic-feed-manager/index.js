import React, {Component} from 'react';
import {Dimensions, FlatList, Platform, TouchableOpacity, View} from 'react-native';
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
//  'Offensive', 'Nudity', 'Hate', 'Violence', 'Weapons'
import strings from "../../i18n/i18n"
import Icon2 from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
import {ThisText,ListEmptyDisplay} from '../../ui/index';

const {width, height} = Dimensions.get('window')
export default class GenericFeedManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showActions: false,
        }
    }

    async fetchTopList(id) {
        const {token, feeds, group, actions, entity} = this.props;
        if (id === this.props.feeds[0].fid) {
            //   actions.fetchTop(feeds, token, entity, group)
        }
    }

    renderItem(item) {
        const {user, navigation, navigateToChat, token, userFollowers, group, ItemDetail, actions, entity, location, visibleItem, realize, visibleFeeds,shouldUpdateFeeds} = this.props;
        let id = item.item.id;
        if (!id) {
            id = item.item._id;
        }
        return <ItemDetail
            key={id}
            navigateToChat={navigateToChat}
            user={user}
            token={token}
            currentUser={user}
            location={location}
            userFollowers={userFollowers}
            visibleItem={visibleItem}
            shouldUpdateFeeds={shouldUpdateFeeds}
            group={group}
            visibleFeeds={visibleFeeds}
            realize={realize}
            navigation={navigation}
            item={item.item}
            fetchTopList={this.fetchTopList.bind(this)}
            showActions={this.showActions.bind(this)}
            actions={actions}/>
    }

    onEndReach() {
        const {feeds, token, actions, entity,} = this.props;
        actions.setNextFeeds(feeds, token, entity);
    }

    showActions(show, activityId) {
        const {showFab} = this.props;
        this.setState({
            showActions: show,
            activityId: activityId
        })
        if (showFab) {
            showFab(!show);
        }
    }

    reportActivity(report) {
        const {activityAction} = this.props;
        activityAction.reportActivity(this.state.activityId, report);
        this.setState({
            showActions: false,
            activityId: undefined
        })
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        const {onRefresh, refreshing, loadingDone, showTopLoader, feeds, update, setNextFeeds, color, nextBulkLoad, initialNumToRender, noLegacy} = this.props;
        const topLoader = showTopLoader ? <View><Spinner color='red'/></View> : null;
        if (!loadingDone) {
            return <View><Spinner color='red'/></View>;
        }

        if (!feeds || (feeds && feeds.length === 0)) {
            return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor: `${appBackgroundColor}`}}>
               <ListEmptyDisplay/>
            </View>
        }
        const spining = undefined;
        let backgroundColor = '#E6E6E6';
        if (color) {
            backgroundColor = color;
        }
        let isRefresh = false;
        if (refreshing) {
            isRefresh = true;
        }
        if (setNextFeeds) {
            return (

                <View style={{flex: 1,backgroundColor: `${appBackgroundColor}`}}>
                    {topLoader}

                    <FlatList
                        inverted
                        data={feeds}
                        ref='flatList'
                        onEndReached={setNextFeeds}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                        onRefresh={onRefresh}
                        refreshing={isRefresh}
                        initialNumToRender={3}
                        legacyImplementation={Platform.OS === 'android' && !noLegacy}

                    />
                    {nextBulkLoad &&
                    <View style={{bottom: 0, width: width, backgroundColor: `${appBackgroundColor}`, position: 'absolute'}}>
                        <Spinner color='red'/>
                    </View>}
                    {this.state.showActions && <View style={{
                        bottom: 0,
                        position: 'absolute',
                        width: StyleUtils.getWidth(),
                        height: 150,
                        backgroundColor: 'white'
                    }}>
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                borderTopWidth: 10,
                                borderColor: `${appBackgroundColor}`,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width
                            }}>
                                <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <ThisText>{strings.reportActivity}</ThisText>
                                </View>
                                <TouchableOpacity
                                    style={{flex: 0.5, paddingTop: 5, paddingRight: 10, justifyContent: 'flex-end'}}
                                    onPress={() => this.showActions(false)}>
                                    <Icon2 style={{fontSize: 30}} name="ios-close-circle-outline"/>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{
                            flex: 1,
                            padding: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('FalseDeal')}>
                                <ThisText style={{fontSize: 14}}>{strings.falseDeal}</ThisText>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('Nudity')}>
                                <ThisText style={{fontSize: 14}}>{strings.Nudity}</ThisText>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('Hate')}>
                                <ThisText style={{fontSize: 14}}>{strings.Hate}</ThisText>
                            </TouchableOpacity>


                        </View>
                        <View style={{
                            flex: 1,
                            padding: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('Violence')}>
                                <ThisText style={{fontSize: 14}}>{strings.Violence}</ThisText>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('Offensive')}>
                                <ThisText style={{fontSize: 14}}>{strings.Offensive}</ThisText>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                borderRadius: 10,
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#cccccc'
                            }} onPress={() => this.reportActivity('Weapons')}>
                                <ThisText style={{fontSize: 14}}>{strings.Weapons}</ThisText>
                            </TouchableOpacity>

                        </View>
                    </View>}

                </View>

            );
        }
        return (

            <View style={{flex: 1,backgroundColor: `${appBackgroundColor}`}}>

                <FlatList
                    ref='flatList'
                    data={feeds}
                    onRefresh={onRefresh}
                    refreshing={isRefresh}
                    onEndReached={this.onEndReach.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    extraData={update}
                    initialNumToRender={3}
                    legacyImplementation={Platform.OS === 'android' && !noLegacy}

                />

                {nextBulkLoad && !showTopLoader &&
                <View style={{bottom: 0, width: width, backgroundColor: `${appBackgroundColor}`, position: 'absolute'}}>
                    <Spinner color='red'/>
                </View>}
                {this.state.showActions &&
                <View style={{bottom: 0, position: 'absolute', width: width, height: 150, backgroundColor: 'white'}}>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            borderTopWidth: 10,
                            borderColor: '#cccccc',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: width
                        }}>
                            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
                                <ThisText>{strings.reportActivity}</ThisText>
                            </View>
                            <TouchableOpacity
                                style={{flex: 0.5, paddingTop: 5, paddingRight: 10, justifyContent: 'flex-end'}}
                                onPress={() => this.showActions(false)}>
                                <Icon2 style={{fontSize: 30}} name="ios-close-circle-outline"/>

                            </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{
                        flex: 1,
                        padding: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('FalseDeal')}>
                            <ThisText style={{fontSize: 14}}>{strings.falseDeal}</ThisText>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('Nudity')}>
                            <ThisText style={{fontSize: 14}}>{strings.Nudity}</ThisText>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('Hate')}>
                            <ThisText style={{fontSize: 14}}>{strings.Hate}</ThisText>
                        </TouchableOpacity>


                    </View>
                    <View style={{
                        flex: 1,
                        padding: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('Violence')}>
                            <ThisText style={{fontSize: 14}}>{strings.Violence}</ThisText>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('Offensive')}>
                            <ThisText style={{fontSize: 14}}>{strings.Offensive}</ThisText>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            borderRadius: 10,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: '#cccccc'
                        }} onPress={() => this.reportActivity('Weapons')}>
                            <ThisText style={{fontSize: 14}}>{strings.Weapons}</ThisText>
                        </TouchableOpacity>

                    </View>
                </View>}
            </View>

        );
    }
}






