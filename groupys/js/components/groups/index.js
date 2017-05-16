import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListGroupView from '../generic-list-manager/generic-list-group-view/index'
import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'

const {
    replaceAt,
} = actions;
import GroupApi from "../../api/groups"
let groupApi = new GroupApi();

class Group extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);


    }

    async componentWillMount(){
        this.props.navigateAction('add-product',this.props.index)
    }

    async getAll(){
        let response =  await  groupApi.getAll();
        return response;
    }
    fetchApi(pageOffset,pageSize ) {

        return new Promise(async function(resolve, reject) {
            response =  await  groupApi.getAll();
            resolve(response);
        });


    }

    render() {


        return (
           <GenericListManager title="Groups" component="home" addComponent="add-group" api={this}
                               ItemDetail = {GenericListView}/>
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

export default connect(mapStateToProps, bindActions)(Group);
