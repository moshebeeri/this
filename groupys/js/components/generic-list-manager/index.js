import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header,Spinner, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import store from 'react-native-simple-store';

import Dataset from 'impagination';
import {DeviceEventEmitter} from 'react-native'



export default class GenericListManager extends Component {


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
        let setState = this.setState.bind(this);
        let component = this.props.title;
        let componentListener = this.props.addComponent;
        let dataset = new Dataset({
            pageSize: 8,
            observe: (rowsView) => {
                this.setState({rowsView});
            },

            // Where to fetch the data from.

            fetch(pageOffset, pageSize, stats) {
                let promise =  fetchApi(pageOffset + 1,pageSize );
                promise.then(function(response){
                    store.save(component,response);

                    DeviceEventEmitter.addListener(componentListener, (e)=>{
                        let rows = response;
                        rows.push(e);
                        setState({
                            rowsView: rows,
                        })});
                });
                return promise;


            }
        });
        dataset.setReadOffset(0);
        this.setState({dataset});
    }

    async fetchList(){
        try {
            let response = await store.get(this.props.title);
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





    componentWillMount(){


        this.fetchList();
        if(this.props.api.fetchApi) {
            this.setupImpagination();
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
                     return <this.props.ItemDetail navigation={this.props.navigation} key= {index} index={index} item={r.content} deleteProduct={this.deleteProduct.bind(this)}/>

                 }
                return <this.props.ItemDetail navigation={this.props.navigation} key= {index} index={index} item={r} deleteProduct={this.deleteProduct.bind(this)}/>
            });
        }

        return (

                <Content  style={{  backgroundColor: '#fff'}}>
                    { rows }
                </Content>

        );
    }
}


