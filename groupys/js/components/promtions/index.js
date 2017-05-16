import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header} from 'native-base';
import GeneralComponentHeader from '../header/index';
import GenericListManager from '../generic-list-manager/index';

import GenericListView from '../generic-list-manager/generic-list-view/index'
import PromotionApi from "../../api/promotion"
let promotionApi = new PromotionApi();


const {
    replaceAt,
} = actions;


export default class Promotions extends Component {

    //
    // on: {
    //     business: this.state.business,
    //     product: this.state.product,
    // },
    // path: this.state.path,
    // image: this.state.image,
    // type: this.state.type,
    // percent: this.state.percent,
    // amount: Number(this.state.amount),
    // retail_price: Number(this.state.retail_price),
    // total_discount: Number(this.state.total_discount),
    // percent_range: this.state.percent_range,
    // start: this.state.start,
    // end: this.state.end,
    // location: this.state.location,
    // info: this.state.info,
    // name: this.state.name,

    constructor(props) {
        super(props);
        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            rowsView: [],
            promotions:{}
        }
        ;



    }


    async getAll(){
        let response =  await  promotionApi.getAll();
        return response;
    }
    fetchApi(pageOffset,pageSize ) {

        return new Promise(async function(resolve, reject) {
            response =  await  promotionApi.getAll();
            resolve(response);
        });


    }

    async componentWillMount(){
        this.props.navigateAction('addPromotions',this.props.index)
    }

    render() {
        return (
            <GenericListManager title="Promotion" component="home" addComponent="addPromotions" api={this}
                                ItemDetail={GenericListView}/>

        );
    }
}

