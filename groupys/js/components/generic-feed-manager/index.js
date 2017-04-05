import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup,
    Input, Button, Icon, View,Header, Body, Right, ListItem,Tabs,Tab,Spinner, TabHeading,Thumbnail,Left} from 'native-base';


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

        }
        ;

    }

    setupImpagination() {
        let fetchApi = this.props.api.fetchApi.bind(this);
        let dataset = new Dataset({
            pageSize: 5,
            observe: (rowsView) => {
                this.setState({rowsView});
            },

            // Where to fetch the data from.

            fetch(pageOffset, pageSize, stats) {
                return fetchApi(pageOffset + 1,pageSize );

            }
        });
        dataset.setReadOffset(0);
        this.setState({dataset});
    }

    componentWillMount(){
        if(this.props.api.fetchApi) {
            this.setupImpagination();
        }else{
            this.fetchList();
        }
    }

    async fetchList(){
        try {
            let response = await this.props.api.getAll();
            this.setState({
                rowsView: response
            })

        }catch (error){
            console.log(error);
        }



    }





    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
    }



    setCurrentReadOffset (event) {
        let itemHeight = 402;
        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        let currentItemIndex = Math.ceil(currentOffset / itemHeight);
        this.state.dataset.setReadOffset(currentItemIndex);
    }


    render() {
        let index = 0
        let rows = undefined;
        if(this.state.rowsView.length > 0) {
             rows = this.state.rowsView.map((r, i) => {
                 if (!r.isSettled) {
                     return <Spinner key={Math.random()}/>;
                 }
                index++;
                return <this.props.ItemDetail key= {index} index={index} item={r} />
            });
        }

        return (

                <Content  removeClippedSubviews={true} style={{  backgroundColor: '#fff'} } scrollEventThrottle={300} onScroll={this.setCurrentReadOffset.bind(this)}>
                             { rows }

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
