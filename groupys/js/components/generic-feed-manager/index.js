import React, {Component} from 'react';
import {FlatList, Image, ListView, Platform, TouchableOpacity, View,Dimensions,Text} from 'react-native';
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
const {width, height} = Dimensions.get('window')
import Icon2 from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
export default class GenericFeedManager extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showActions:false,
        }
    }

    async fetchTopList(id) {
        const {token, feeds, group, actions, entity} = this.props;
        if (id === this.props.feeds[0].fid) {
         //   actions.fetchTop(feeds, token, entity, group)
        }
    }

    renderItem(item) {
        const {navigation, token, userFollowers, group, ItemDetail, actions,entity, location} = this.props;
        return <ItemDetail
            key={item.item.id}
            user={entity}
            token={token}
            location={location}
            userFollowers={userFollowers}
            group={group}
            navigation={navigation}
            item={item.item}
            fetchTopList={this.fetchTopList.bind(this)}
            showActions = {this.showActions.bind(this)}
            actions={actions}/>
    }

    onEndReach() {
        const {feeds, token, actions, entity,} = this.props;
        actions.setNextFeeds(feeds, token, entity);
    }

    showActions(show,activityId){
        const{showFab} = this.props;
        this.setState({
            showActions:show,
            activityId:activityId
        })
        if(showFab){
            showFab(!show);
        }
    }


    reportActivity(report){

        const {activityAction} = this.props;

        activityAction.reportActivity(this.state.activityId,report);
        this.setState({
            showActions:false,
            activityId:undefined
        })
    }



    render() {
        const {loadingDone, showTopLoader, feeds, update, setNextFeeds, color,nextBulkLoad} = this.props;
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
                    {nextBulkLoad &&  <View style={ {bottom:0,width:width,backgroundColor:'#cccccc',position:'absolute'}}>
                        <Spinner color='red'/>
                    </View>}
                    {this.state.showActions && <View style={{bottom:0,position:'absolute',width:StyleUtils.getWidth(),height:150,backgroundColor:'white'}}>
                        <View>
                            <View style={{flexDirection:'row',borderTopWidth:10,borderColor:'#cccccc' ,justifyContent:'flex-end',alignItems:'center',width:width}}>
                                <View style={{flex:4,alignItems:'center',justifyContent:'center'}}>
                                    <Text>{strings.reportActivity}</Text>
                                </View>
                                <TouchableOpacity style= {{flex:0.5,paddingTop:5,paddingRight:10,justifyContent:'flex-end'}} onPress={() => this.showActions(false)}>
                                    <Icon2 style={{fontSize: 30}} name="ios-close-circle-outline"/>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('FalseDeal')}>
                                <Text style={{fontSize:14}}>{strings.falseDeal}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Nudity')}>
                                <Text style={{fontSize:14}}>{strings.Nudity}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Hate')}>
                                <Text style={{fontSize:14}}>{strings.Hate}</Text>
                            </TouchableOpacity>


                        </View>
                        <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Violence')}>
                                <Text style={{fontSize:14}}>{strings.Violence}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Offensive')}>
                                <Text style={{fontSize:14}}>{strings.Offensive}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Weapons')}>
                                <Text style={{fontSize:14}}>{strings.Weapons}</Text>
                            </TouchableOpacity>

                        </View>
                    </View> }

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

                {nextBulkLoad && !showTopLoader &&  <View style={ {bottom:0,width:width,backgroundColor:'#cccccc',position:'absolute'}}>
                <Spinner color='red'/>
                </View>}
                {this.state.showActions && <View style={{bottom:0,position:'absolute',width:width,height:150,backgroundColor:'white'}}>
                    <View>
                        <View style={{flexDirection:'row',borderTopWidth:10,borderColor:'#cccccc' ,justifyContent:'flex-end',alignItems:'center',width:width}}>
                            <View style={{flex:4,alignItems:'center',justifyContent:'center'}}>
                                <Text>{strings.reportActivity}</Text>
                            </View>
                        <TouchableOpacity style= {{flex:0.5,paddingTop:5,paddingRight:10,justifyContent:'flex-end'}} onPress={() => this.showActions(false)}>
                          <Icon2 style={{fontSize: 30}} name="ios-close-circle-outline"/>

                        </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('FalseDeal')}>
                            <Text style={{fontSize:14}}>{strings.falseDeal}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Nudity')}>
                            <Text style={{fontSize:14}}>{strings.Nudity}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Hate')}>
                            <Text style={{fontSize:14}}>{strings.Hate}</Text>
                        </TouchableOpacity>


                    </View>
                    <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Violence')}>
                            <Text style={{fontSize:14}}>{strings.Violence}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Offensive')}>
                            <Text style={{fontSize:14}}>{strings.Offensive}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style= {{borderRadius:10,width:100,justifyContent:'center',alignItems:'center',height:40,backgroundColor:'#cccccc'}} onPress={() => this.reportActivity('Weapons')}>
                            <Text style={{fontSize:14}}>{strings.Weapons}</Text>
                        </TouchableOpacity>

                    </View>
                </View> }
            </View>

        );
    }
}






