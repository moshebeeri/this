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

import styles from './styles'


export default class FeedBusiness extends Component {




    render(){
        return this.createPromotion(this.props.item,this.props.save,this.props.like,this.props.unlike,this.props.comment)
    }

    createFeed(item,save,like,unlike,comment){
        if(item.content){
            item = item.content;
        }
        let secondFeed = undefined;
        if(item.feed){
            secondFeed = this.createFeed(item.feed);

        }

        let logo = undefined;
        if(item.logo) {
            if (item.logo.uri) {
                logo = <Image
                    style={{
                        flex:-1,
                        alignSelf: 'center',
                        height: 50,
                        width: 50,
                        marginLeft:10,
                        borderWidth: 1,
                        borderRadius: 25
                    }}
                    source={{uri: item.logo.uri}}/>
            }

            if (item.logo.require) {
                logo = <Image
                    style={{
                        flex:-1,
                        alignSelf: 'center',
                        height: 50,
                        width: 50,
                        marginLeft:10,
                        borderWidth: 1,
                        borderRadius: 25
                    }}
                    source={item.logo.require}/>
            }
        }

        let feedAction = undefined;
        if (item.showsave){
            feedAction =  <View   style={styles.buttonView}>

                <TouchableHighlight onPress={save}>

                    <LinearGradient

                        locations={[0,0.6]}
                        colors={['white', 'gray']}
                        style={styles.button}>

                        <Text style={styles.buttonText}>Save</Text>


                    </LinearGradient>
                </TouchableHighlight>



            </View>
        }
        let buisnessLogo = undefined;
        if(item.businessLogo){
            buisnessLogo =  <Thumbnail size={50} source={{uri: item.businessLogo}} />

        }
        let banner = undefined;
        if(item.banner) {


            if (item.banner.uri) {
                banner = <View style={styles.container}>
                    <View style={styles.backgroundContainer}>
                        <Image resizeMode= "cover"
                               style={styles.image}
                               source={{uri: item.banner.uri}}
                        >



                        </Image>
                    </View>


                    <View style={styles.backdropView}>
                        <View style={{paddingTop:170,marginLeft:10,flexDirection: 'row'}}>
                            {buisnessLogo}
                            <Text style={(styles.imageLogoName, {color: "white"})}>{item.name}</Text>
                            <Text style={styles.imageButtomText} note>{item.description} </Text>
                        </View>
                        <Text style={styles.imageTopText}>{item.itemTitle}</Text>
                        <Text style={styles.addressText} note>{item.address} </Text>
                    </View>

                </View>

            }

            if (item.banner.require) {
                banner = <Image
                    style={{padding: 0, flex: -1}}
                    source={item.banner.require}>
                    <Text style={{marginLeft:20,marginTop:170,fontSize:25}}>{item.itemTitle}</Text>
                    <Text style={{marginLeft:20,marginTop:200,fontSize:10}} note>{item.description}</Text>
                </Image>
            }

        }else{
            banner = <View   style={{padding:5 }}>
                <Text style={{fontSize:20,marginLeft:10,marginRight:10}}>{item.itemTitle}</Text>
                <Text style={{fontSize:20}} note>{item.description}</Text>

            </View>
        }




        let saveIcon = undefined;

        let likeIcon = undefined;
        let followIcon =undefined;
        if(item.showSocial) {


            followIcon = <Button style={styles.iconView} transparent>

                {/*<Icon size={20} style={styles.like} name="user-follow"/>*/}
                <Text>Follow</Text>
            </Button>

            if (item.social && item.social.follow == true) {
                followIcon = <Button transparent style={styles.iconView}>
                    {/*<Icon active size={20} style={styles.like} name="user-follow"/>*/}
                    <Text>Follow</Text>

                </Button>

            }

            let likes = new String(item.social.numberLikes);
            likeIcon = <Button transparent style={styles.iconView} onPress={like}>
                <Text>{likes}</Text>
                <Icon style={styles.like} size={20} name="heart"/>
                <Text>like</Text>

            </Button>

            if (item.social && item.social.like == true) {
                likeIcon = <Button transparent style={styles.iconView} onPress={unlike}>
                    <Text>{likes}</Text>

                    <Icon color="#0000b3" style={styles.like} size={20} name="heart"/>
                    <Text>like</Text>
                </Button>


            }
        }








        return (  <Card   {..._panResponder.panHandlers} >


                <View style={{flex:-1, flexDirection: 'row',justifyContent:'space-between'}}>

                    {logo}



                    {secondFeed}
                    {banner}





                </View>
                {feedAction}

                <CardItem >

                    {likeIcon}


                    {followIcon}

                    {saveIcon}

                </CardItem>
            </Card>

        );

    }


    createPromotion(item,save,like,unlike,showUsers,comment){

        if(!item.name){
            return <View></View>;
        }

        let likes = 0;

        if(item.social) {

            likes = new String(item.social.numberLikes);
        }
        let likeIcon = <Button transparent style={styles.promotion_iconView} onPress={like}>

            <Icon style={styles.promotion_like}  size={25} name="heart"/>
            <Text>{likes}</Text>

        </Button>
        if (item.social && item.social.like == true) {
            likeIcon = <Button transparent style={styles.promotion_iconView} onPress={unlike}>


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

                    <Image resizeMode= "cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                    </Image>

                    <View style={styles.business_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>

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

                    </View>
                </View>
            </View>

        return result;
    }
}