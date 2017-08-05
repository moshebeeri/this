import React, {Component} from 'react';
import {Image ,PanResponder,TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import UserApi from '../../../api/user'
let userApi = new UserApi();
import PromotionApi from '../../../api/promotion'
let promotionApi = new PromotionApi();

import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Entypo';
const ReactNative = require('react-native');
const { StyleSheet, Platform, Dimensions } = ReactNative;

const {width, height} = Dimensions.get('window')

export default class MyPromotionFeedItem extends Component {



    constructor(props) {

        super(props);
        this.state = {
            zone:{}
        }


    }


    componentWillMount() {
        const getDirectionAndColor = ({ moveX, moveY, dx, dy}) => {
            const height = dx;
            const width= dy;
            const draggedDown = dy > 30;
            const draggedUp = dy < -30;
            const draggedLeft = dx < -30;
            const draggedRight = dx > 30;
            const isRed = moveY < 90 && moveY > 40 && moveX > 0 && moveX < width;
            const isBlue = moveY > (height - 50) && moveX > 0 && moveX < width;
            let dragDirection = '';
            if (draggedDown || draggedUp) {
                if (draggedDown) dragDirection += 'dragged down '
                if (draggedUp) dragDirection +=  'dragged up ';
            }
            if (draggedLeft || draggedRight) {
                if (draggedLeft) dragDirection += 'dragged left '
                if (draggedRight) dragDirection +=  'dragged right ';
            }
            if (isRed) return `red ${dragDirection}`
            if (isBlue) return `blue ${dragDirection}`
            if (dragDirection) return dragDirection;
        }

        this._panResponder = PanResponder.create({
             onMoveShouldSetPanResponder:(evt, gestureState) => this.onMove(evt, gestureState),

        });
    }

    realize(){
        this.props.selectApi.props.api.props.navigation.navigate('realizePromotion',{item:this.props.item})
    }

    onMove(evt, gestureState){
        if(gestureState.moveY < 300){
            this.props.selectApi.fetchTopList(this.props.item.id,true)
        }
        return false;
    }

        render() {
            let feed = undefined;
            feed = this.createPromotion(this.props.item);

            return feed;
        }


    comment(){


        this.props.navigation.navigate('genericComments', {
            instance: this.props.item,
            generalId:this.props.item.generalId,
            entities:this.props.item.entities,

        })


        //TODO add comments screen


    }


    createPromotion(item){

        let promotion = undefined;
        let colorStyle = {

            color: item.promotionColor,

            fontFamily:'Roboto-Regular' ,marginLeft:10,marginTop:4,fontSize:16
        }


        promotion = <Text style={colorStyle}>{item.promotion}</Text>

        let buisnessLogo = undefined;
        if(item.businessLogo){
            buisnessLogo =  <Thumbnail  square={true} size={50} source={{uri: item.businessLogo}} />

        }

        let reddemStyle ={
            flex:-1,justifyContent:'center',marginLeft:0 ,flexDirection: 'row',height: 40,width:width/2, backgroundColor: item.promotionColor,
        };
        let postStyle ={
            flex:-1,justifyContent:'center',marginLeft:0 ,flexDirection: 'row',height: 40,width:width/2, backgroundColor: '#363636',
        };


        let result =
            <View style={styles.promotion_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style = {{  flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName } </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.promotion_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                            <View style={styles.promotion_buttom_location}>
                                <Icon2 style={styles.promotion_location}  size={25} name="clock"/>
                                <Text style={styles.promotion_addressText} note>{item.endDate } </Text>

                            </View>
                            <View style={styles.promotion_buttom_location}>
                                <Icon3 style={styles.promotion_location}  size={25} name="location-on"/>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress } </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.promotion_action_container}>
                        <Button  style={postStyle} onPress={this.comment.bind(this)}>


                            <Text>see post</Text>


                        </Button>
                        <Button  style={reddemStyle} onPress={this.realize.bind(this)}>


                            <Text>redeem</Text>


                        </Button>
                    </View>
                    <View style={styles.promotion_button_space}>


                    </View>
            </View>
            </View>


        return result;
    }



}


