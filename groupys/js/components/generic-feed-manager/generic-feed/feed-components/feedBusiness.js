/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image ,Platform,PanResponder,TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';



import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';


import Icon4 from 'react-native-vector-icons/Entypo';

import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'

export default class FeedBusiness extends Component {




    render(){
        return this.createBussines(this.props.item,this.props.like,this.props.unlike,this.props.showUsers,this.props.comment)
    }



    createBussines(item,like,unlike,showUsers,comment){
        let styles = stylesPortrate
        if(StyleUtils.isLandscape()){
            styles = stylesLandscape;
        }

        if(!item.name){
            return <View></View>;
        }

        let likes = 0;

        if(item.social) {

            likes = new String(item.social.numberLikes);
        }
        let likeIcon = <Button transparent style={styles.promotion_iconView} onPress={() => like(item.id)}>

            <Icon style={styles.promotion_unlike}  size={25} name="heart"/>
            <Text>{likes}</Text>

        </Button>
        if (item.social && item.social.like == true) {
            likeIcon = <Button transparent style={styles.promotion_iconView} onPress={() => unlike(item.id)}>


                <Icon  style={styles.promotion_like} size={25} name="heart"/>
                <Text>{likes}</Text>

            </Button>


        }
        let commentICon = <Button transparent style={styles.promotion_iconView} onPress={comment}>

            <Icon2 style={styles.promotion_comment}  size={30} name="comment"/>
            <Text>0</Text>


        </Button>

        let shareICon = <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

            <Icon2 style={styles.promotion_comment}  size={30} name="share-google"/>
            <Text>0</Text>


        </Button>



        let result =
            <View style={styles.bussiness_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.bussiness_upperContainer}>
                        <View style={styles.logo_view}>

                            <View style = {{  flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.name } </Text>
                             </View>
                        </View>

                        <View style={styles.promotion_description}>
                         <Text style={styles.promotion_text_description}>{item.description}</Text>

                        </View>
                    </View>
                    <View style={styles.promotion_image_view}>

                    <Image resizeMode= "cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                    </Image>
                    </View>

                    <View style={styles.business_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>

                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                            <View style={styles.promotion_buttom_location}>
                                <Icon3 style={styles.promotion_location}  size={25} name="location-on"/>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress } </Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>
                        {likeIcon}
                        {commentICon}
                        {shareICon}

                    </View>
                </View>
            </View>

        return result;
    }
}