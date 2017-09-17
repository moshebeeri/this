import React, {Component} from 'react';
import {Image, Platform,ListView,FlatList} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';

import { bindActionCreators } from "redux";



 export default class GenericFeedManager extends Component {



    constructor(props) {
        super(props);


    }





      async fetchTopList(id){

          if(id == this.props.feeds[0].fid) {
              this.props.actions.fetchTop(this.props.feeds,this.props.token,this.props.entity)
          }
    }



    renderItem(item){
        const {navigation,token ,userFollowers,group,ItemDetail,actions,entity} = this.props;


        return <ItemDetail
            user={entity}
            token={token}
            userFollowers={userFollowers}
            group = {group}
            navigation={navigation}
            item={item.item}
            fetchTopList={this.fetchTopList.bind(this)}
            actions={actions}  />

    }


    render() {
        const {navigation,loadingDone, showTopLoader,feeds,token ,userFollowers,group,ItemDetail,actions,entity,update,setNextFeeds} = this.props;


        //  let loader = this.state.showLoader?<View><Spinner color='red' /></View>:null
        const topLoader = showTopLoader?<View><Spinner color='red' /></View>:null
        if(!loadingDone){
            return <View><Spinner color='red' /></View>;
        }
        const spining = undefined;
        //
        // if(nextLoad){
        //     spining = <View><Spinner color='red' /></View>;
        // }
        if(setNextFeeds){
            return (

                <Content  removeClippedSubviews={true} style={{  backgroundColor: '#e7e7e7'} } >
                    {topLoader}
                    <FlatList
                        data={feeds}
                        onEndReached={setNextFeeds}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                    />

                    {spining}

                </Content>

            );
        }

        return (

                <Content  removeClippedSubviews={true} style={{  backgroundColor: '#e7e7e7'} } >
                    {topLoader}
                    <FlatList
                        data={feeds}
                        onEndReached={actions.setNextFeeds(feeds,token,entity)}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                    />

                    {spining}

                </Content>

        );
    }


}






