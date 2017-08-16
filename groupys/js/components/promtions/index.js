import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Fab, InputGroup, Input, Button, View,Header} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import Icon from 'react-native-vector-icons/EvilIcons';
import GenericListView from '../generic-list-manager/generic-list-view/index'
import PromotionApi from "../../api/promotion"
let promotionApi = new PromotionApi();
import * as promotionsAction from "../../actions/promotions";

import { bindActionCreators } from "redux";

 class Promotions extends Component {

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
        let id = this.props.navigation.state.params.business._id;

        this.props.fetchFromStorePromotions(id)

    }




    fetchApi(pageOffset,pageSize ) {
        let id = this.props.api.props.navigation.state.params.business._id;
       this.props.api.props.fetchPromotions(id);
        let response = this.props.api.props.promotions['promotions' + id];


        return new Promise(async function(resolve, reject) {
            resolve(response);
        });

    }


     navigateToAdd(){

         this.props.navigation.navigate("addPromotions",{business:this.props.navigation.state.params.business});
     }

    render() {

        let businessId = this.props.navigation.state.params.business._id;
        let promotions = undefined;
        if(this.props.promotions) {
            promotions = this.props.promotions['promotions' + businessId];
        }

        return (
            <Container>
            <GenericListManager navigation = {this.props.navigation} rows={promotions} title="Promotion" component="home" addComponent="addPromotions" api={this}
                                ItemDetail={GenericListView}/>
                <Fab

            direction="right"
            active={false}
            containerStyle={{ marginLeft: 10 }}
            style={{ backgroundColor: "#ff6400" }}
            position="bottomRight"
            onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="plus" />

                </Fab>
            </Container>
        );
    }
}


export default connect(
    state => ({
        promotions: state.promotions
    }),

    dispatch => bindActionCreators(promotionsAction, dispatch)
)(Promotions);


