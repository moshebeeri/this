import React, {Component} from 'react';
import {Image, Platform,ListView} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';
import SGListView from 'react-native-sglistview';
import BackgroundTimer from 'react-native-background-timer';


export default class GenericFeedManager extends Component {



    constructor(props) {
        super(props);
        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            ready: true,
            addComponent:'',
            rowsView: [],
            dataset: null,
            showLoader:false,
            showTopLoader:false,
            reRender: false,
            intervalId:{},

        }
        ;

    }



    reRender(){
        if(this.state.reRender){
            this.setState({
                reRender: false
            })
        }else {
            this.setState({
                reRender: true
            })
        }
    }
     componentWillMount(){
        this.fetchList();

         const intervalId = BackgroundTimer.setInterval(() => {
             // this will be executed every 200 ms
             // even when app is the the background
             // if(this.state.rowsView.length > 0) {
             //     this.fetchTopList(this.state.rowsView[0].id, false);
             // }
         }, 60000);

         this.setState({
             intervalId : intervalId
         })

    }

    componentWillUnmount() {
        BackgroundTimer.clearTimeout(this.state.intervalId);
    }

    async fetchList(event){
        try {

            this.setState({
                showLoader:true
            })


            let response = null;
            if(this.state.rowsView.length == 0){
                response =  await this.props.api.getAll('down','start');
            }else{
                response =  await this.props.api.getAll('down',this.state.rowsView[this.state.rowsView.length-1].id);
            }
            if(response.length > 0) {
                let currentRows = this.state.rowsView;
                let newFeeds = response.filter(function (feed) {
                    let filtered = currentRows.filter(function (currentFeed) {
                        if(currentFeed.id == feed.id){
                            return true;
                        }
                        return false;

                    })
                    return filtered.length == 0;
                })
                response = this.state.rowsView.concat(newFeeds);
                this.setState({
                    rowsView: response,
                    showLoader: false
                })
            }else{
                this.setState({
                    showLoader:false
                })

            }

        }catch (error){
            console.log(error);
        }



    }

    async fetchTopList(id,showTimer){
        try {
            if(this.state.rowsView.length > 0 ) {
                if (id == this.state.rowsView[0].id) {
                    if (showTimer) {
                        this.setState({
                            showTopLoader: true
                        })
                    }
                    let response = await this.props.api.getAll('up', this.state.rowsView[0].id);
                    response = response.concat(this.state.rowsView);
                    this.setState({
                        rowsView: response,
                        showTopLoader: false
                    })
                }
            }

        }catch (error){
            console.log(error);
        }

    }





    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
    }




     getDataSource() {

        const dataSource = new ListView.DataSource(
            { rowHasChanged: (r1, r2) => r1.id !== r2.id });


        return dataSource.cloneWithRows(this.state.rowsView);
    }

    endEvent(event){
        this.fetchList(event);
    }
    render() {
        let loader = this.state.showLoader?<View><Spinner color='red' /></View>:null
        let topLoader = this.state.showTopLoader?<View><Spinner color='red' /></View>:null

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
                    {loader}

                </Content>

        );
    }
}


