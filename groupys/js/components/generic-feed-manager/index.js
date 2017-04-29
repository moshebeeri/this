import React, {Component} from 'react';
import {Image, Platform,ListView} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';
import SGListView from 'react-native-sglistview';


 import Dataset from 'impagination';

//

const {
    replaceAt,
} = actions;

class GenericFeedManager extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


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

        }
        ;

    }



     componentWillMount(){
         console.log('compone')
        this.fetchList();

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

            response =  this.state.rowsView.concat(response);
            this.setState({
                rowsView: response,
                showLoader:false
            })

        }catch (error){
            console.log(error);
        }



    }

    async fetchTopList(id){
        try {
            if(id== this.state.rowsView[0].id) {

                this.setState({
                    showTopLoader: true
                })
                let response = await this.props.api.getAll('up', this.state.rowsView[0].id);
                response = response.concat(this.state.rowsView);
                this.setState({
                    rowsView: response,
                    showTopLoader: false
                })
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
        console.log('end event')
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
                    />
                    {loader}

                </Content>

        );
    }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(GenericFeedManager);
