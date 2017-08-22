/**
 * Created by roilandshut on 23/07/2017.
 */
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

import styles from './styles'


export default class FeedGroupPromotion extends Component {



    render(){

        return this.createPromotion(this.props.item,this.props.save,this.props.like,this.props.unlike,this.props.showUsers);
    }


    createPromotion(item,save,like,unlike,showUsers){

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

        let feedAction =  <View   style={styles.promotion_buttonView}>

            <TouchableHighlight style={{}} onPress={save}>


                <Text style={styles.promotion_buttonText}>Save</Text>



            </TouchableHighlight>



        </View>

        let likes = new String(item.social.numberLikes);
        let likeIcon = <Button transparent style={styles.promotion_unlike} onPress={like}>

            <Icon style={styles.promotion_like}  size={25} name="heart"/>
            <Text>{likes}</Text>

        </Button>
        if (item.social && item.social.like == true) {
            likeIcon = <Button transparent style={styles.promotion_iconView} onPress={unlike}>


                <Icon  style={styles.promotion_like} size={25} name="heart"/>
                <Text>{likes}</Text>

            </Button>


        }
        let commentICon = <Button transparent style={styles.promotion_iconView} onPress={like}>

            <Icon2 style={styles.promotion_comment}  size={30} name="comment"/>
            <Text>0</Text>


        </Button>

        let shareICon = <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

            <Icon2 style={styles.promotion_comment}  size={30} name="share-google"/>
            <Text>0</Text>


        </Button>

        let saveIcon = undefined;

        if(item.showsave) {
            let saveStyle ={
                flex:-1,justifyContent:'center',marginLeft:20 ,flexDirection: 'row',height: 40,width:100, backgroundColor: item.promotionColor,
            };
            saveIcon = <Button  style={saveStyle} onPress={save}>


                <Text>save</Text>


            </Button>
        }else{
            let saveStyle ={
                flex:-1,justifyContent:'center',marginLeft:20 ,flexDirection: 'row',height: 40,width:100, backgroundColor: 'gray',
            };
            saveIcon = <Button  style={saveStyle} >


                <Text>saved</Text>


            </Button>
        }

        let result =
            <View style={styles.promotion_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style = {{  flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName } </Text>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress } </Text>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>

                            <Text style={styles.promotion_text_description}>{item.name}</Text>
                            <Text style={styles.promotion_text_description}>{item.description}</Text>

                        </View>
                    </View>

                    <Image resizeMode= "cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                    </Image>

                    <View style={styles.promotion_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                            <View style={styles.promotion_buttom_location}>
                                <Icon2 style={styles.promotion_location}  size={25} name="clock"/>

                            </View>
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
                        {saveIcon}
                    </View>
                </View>
            </View>

        return result;
    }


}