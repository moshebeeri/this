import React, {Component} from 'react';
import {Image, Platform,ListView} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';
import SGListView from 'react-native-sglistview';
import BackgroundTimer from 'react-native-background-timer';
import { bindActionCreators } from "redux";

import * as feedsAction from "../../actions/feeds";

 export default class GenericFeedManager extends Component {



    constructor(props) {
        super(props);


    }


     componentWillMount(){
        this.props.api.fetchFeeds();
    }



      async fetchTopList(id,showTimer){
         this.props.api.fetchTop(id)

    }






x

     getDataSource() {

        const dataSource = new ListView.DataSource(
            { rowHasChanged: (r1, r2) => r1.id !== r2.id });


        return dataSource.cloneWithRows(this.props.feeds);
    }

    endEvent(event){
        this.props.api.fetchFeeds();
    }
    render() {
      //  let loader = this.state.showLoader?<View><Spinner color='red' /></View>:null
        let topLoader = this.props.showTopLoader?<View><Spinner color='red' /></View>:null

        return (

                <Content  removeClippedSubviews={true} style={{  backgroundColor: '#fff'} } >
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
                            <this.props.ItemDetail item={item} selectApi={this}  />
                        }
                        onEndReached={(event)=>this.endEvent(event)}
                        enableEmptySections={true}
                    />


                </Content>

        );
    }


}






