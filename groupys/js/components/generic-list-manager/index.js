import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header,Spinner, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GeneralComponentHeader from '../header/index';


import Dataset from 'impagination';


const {
    replaceAt,
} = actions;

class GenericListManager extends Component {

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
            rowsView: []
        }
        ;
        this.fetchList();




    }

    setupImpagination() {
        let fetchApi = this.props.api.fetchApi.bind(this);
        let dataset = new Dataset({
            pageSize: 8,
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

    async deleteProduct(index){

        try {
            await this.props.api.delete(index);
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


    componentWillMount(){
        if(this.props.api.fetchApi) {
            this.setupImpagination();
        }else{
            this.fetchList();
        }
    }

    render() {
        let index = 0
        let rows = undefined;
        if(this.state.rowsView.length > 0) {

             rows = this.state.rowsView.map((r, i) => {
                 if (!r.isSettled && r.isSettled != undefined) {
                     return <Spinner key={Math.random()}/>;
                 }
                index++;
                 if(r.content){
                     return <this.props.ItemDetail key= {index} index={index} item={r.content} deleteProduct={this.deleteProduct.bind(this)}/>

                 }
                return <this.props.ItemDetail key= {index} index={index} item={r} deleteProduct={this.deleteProduct.bind(this)}/>
            });
        }

        return (

                <Content  style={{  backgroundColor: '#fff'}}>
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

export default connect(mapStateToProps, bindActions)(GenericListManager);
