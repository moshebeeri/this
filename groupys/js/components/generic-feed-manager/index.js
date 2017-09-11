import React, {Component} from 'react';
import {Image, Platform,ListView} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';
import SGListView from 'react-native-sglistview';
import BackgroundTimer from 'react-native-background-timer';
import { bindActionCreators } from "redux";



 export default class GenericFeedManager extends Component {



    constructor(props) {
        super(props);


    }





      async fetchTopList(id){

          if(id == this.props.feeds[0].fid) {
              this.props.actions.fetchTop(id,this.props.token,this.props.user)
          }
    }







     getDataSource() {

        const dataSource = new ListView.DataSource(
            { rowHasChanged: (r1, r2) => r1.id !== r2.id });


        return dataSource.cloneWithRows(this.props.feeds);
    }


    render() {
        const {navigation,loadingDone, showTopLoader,feeds,token ,userFollowers,group,ItemDetail,actions,user} = this.props;


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

        return (

                <Content  removeClippedSubviews={true} style={{  backgroundColor: '#e7e7e7'} } >
                    {topLoader}
                    <SGListView
                        dataSource={this.getDataSource() } //data source
                        ref={'listview'}
                        initialListSize={13}
                        stickyHeaderIndices={[]}
                        onEndReachedThreshold={100}
                        scrollRenderAheadDistance={100}
                        pageSize={13}
                        renderRow={(item) =>
                            <ItemDetail user={user} token={token} userFollowers={userFollowers} group = {group}navigation={navigation} item={item} fetchTopList={this.fetchTopList.bind(this)} actions={actions}  />
                        }
                        onEndReached={(event)=> actions.setNextFeeds(feeds,token,user)}
                        enableEmptySections={true}
                    />
                    {spining}

                </Content>

        );
    }


}






