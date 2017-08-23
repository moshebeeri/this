import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Fab, InputGroup, Input, Button, View,Item,Header} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import Icon from 'react-native-vector-icons/EvilIcons';
import PromotionListItem from './list-item/index'
import PromotionApi from "../../api/promotion"
import styles from './styles'
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
let promotionApi = new PromotionApi();
import * as promotionsAction from "../../actions/promotions";

import { bindActionCreators } from "redux";

 class Promotions extends Component {
     static navigationOptions = {
         header:null
     };
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
     back(){
         this.props.navigation.goBack();
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
        let back = <Button transparent style={{ }} onPress={()=> this.back()}>
            <Icon3 active color={"#2db6c8"} size={20} name="ios-arrow-back" />

        </Button>

        let businessId = this.props.navigation.state.params.business._id;
        let promotions = undefined;
        if(this.props.promotions) {
            promotions = this.props.promotions['promotions' + businessId];
        }

        return (
            <Container style={{backgroundColor:'#b7b7b7'}}>
                    <View style={styles.follow_search}  regular >
                        {back}
                        <Text style={{fontSize:20,color:"#2db6c8"}}>Promotions</Text>
                        <View></View>
                    </View>

            <GenericListManager navigation = {this.props.navigation} rows={promotions} title="Promotion" component="home" addComponent="addPromotions" api={this}
                                ItemDetail={PromotionListItem}/>
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


