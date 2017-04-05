import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListManager from '../generic-list-manager/index';

import GenericListView from '../generic-list-manager/generic-list-view/index'
import BusinessApi from "../../api/business"
let businessApi = new BusinessApi();
const {
    replaceAt,
} = actions;


class Business extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);




    }

    async getAll(){
       let response =  await  businessApi.getAll();
       return response;
    }
    fetchApi(pageOffset,pageSize ) {

        return new Promise(async function(resolve, reject) {
            response =  await  businessApi.getAll();
            resolve(response);
        });


    }

    async componentWillMount(){
        this.props.navigateAction('add-business',this.props.index)
    }

    render() {


        return (
            <GenericListManager title="Business" component="home" addComponent="add-business" api={this}
                                ItemDetail={GenericListView}/>
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

export default connect(mapStateToProps, bindActions)(Business);
