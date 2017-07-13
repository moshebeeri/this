import React, {Component} from 'react';
import {Image ,Platform,PanResponder,TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import UserApi from '../../../api/user'
let userApi = new UserApi();
import PromotionApi from '../../../api/promotion'
let promotionApi = new PromotionApi();

import LinearGradient from 'react-native-linear-gradient';
import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';





export default class GenericFeedItem extends Component {





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

    onMove(evt, gestureState){


        if(gestureState.moveY < 300){
            this.props.selectApi.fetchTopList(this.props.item.id,true)
        }
        return false;
    }

        render() {
            let feed = undefined;
            let item = this.props.item;
            if(item.content){
                item = item.content;
            }
            switch (item.itemType){
                case 'PROMOTION':
                    feed = this.createPromotion(item);
                    break;
                default:
                    feed = this.createFeed(this.props.item);
                    break;
            }


            return feed;
        }


        createPromotion(item){

            let promotion = undefined;
            let colorStyle = {
                color: item.promotionColor,

                fontWeight: 'bold',marginLeft:10,marginTop:4,fontSize:16
            }

            promotion = <Text style={colorStyle}>{item.promotion}</Text>

            let buisnessLogo = undefined;
            if(item.businessLogo){
                buisnessLogo =  <Thumbnail  square={true} size={50} source={{uri: item.businessLogo}} />

            }

            let feedAction =  <View   style={styles.promotion_buttonView}>

                <TouchableHighlight style={{}} onPress={this.save.bind(this)}>


                    <Text style={styles.promotion_buttonText}>Save</Text>



                </TouchableHighlight>



            </View>

            let likes = new String(item.social.numberLikes);
            let likeIcon = <Button transparent style={styles.promotion_iconView} onPress={this.like.bind(this)}>

                <Icon style={styles.promotion_like}  size={25} name="heart"/>
                <Text>{likes}</Text>

            </Button>
            if (item.social && item.social.like == true) {
                likeIcon = <Button transparent style={styles.promotion_iconView} onPress={this.unlike.bind(this, item.id)}>


                    <Icon  style={styles.promotion_like} size={25} name="heart"/>
                    <Text>{likes}</Text>

                </Button>


            }
            let commentICon = <Button transparent style={styles.promotion_iconView} onPress={this.like.bind(this)}>

                <Icon2 style={styles.promotion_comment}  size={30} name="comment"/>
                <Text>0</Text>


            </Button>

            let shareICon = <Button transparent style={styles.promotion_iconView} onPress={this.like.bind(this)}>

                <Icon2 style={styles.promotion_comment}  size={30} name="share-google"/>
                <Text>0</Text>


            </Button>

            let saveIcon = undefined;

            if(item.showsave) {
                 saveIcon = <Button transparent style={styles.promotion_iconView} onPress={this.save.bind(this)}>

                    <Icon3 style={styles.promotion_comment} size={25} name="save"/>
                    <Text>save</Text>


                </Button>
            }

            let result =
                <View style={styles.promotion_container}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                           {buisnessLogo}
                            <View style = {{  flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName } </Text>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress } </Text>
                            </View>
                        </View>
                        <View style={styles.promotion_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                        </View>
                        <View style={styles.promotion_description}>

                            <Text style={styles.promotion_type}>{item.name}</Text>
                            <Text style={styles.promotion_type}>{item.description}</Text>

                        </View>
                    </View>

                    <View style={styles.promotion_backgroundContainer}>
                        <Image resizeMode= "cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                        </Image>
                    </View>



                    <View style={styles.promotion_bottomContainer}>
                        {likeIcon}
                        {commentICon}
                        {shareICon}
                        {saveIcon}
                    </View>

                </View>

            return result;
        }

        like(item){
            this.props.item.social.like = true;
            this.props.item.social.numberLikes = this.props.item.social.numberLikes + 1;
            userApi.like( this.props.item.id);
            this.props.selectApi.updateFeed( this.props.item);
        }

        unlike(item){
            this.props.item.social.like = false;
            this.props.item.social.numberLikes = this.props.item.social.numberLikes - 1;

            userApi.unlike(this.props.item.id);
            this.props.selectApi.updateFeed( this.props.item);
        }

        async saveFeed(item){
            try {
                await promotionApi.save(item.id);
                this.props.item.social.saved = true;
                this.props.item.showsave = false;
                this.props.selectApi.updateFeed( this.props.item);
            }catch (error){
                console.log('failed to save');

            }
        }
    doAction(){
        this.props.selectApi.props.api.props.navigation.navigate('realizePromotion')
        }

    save(){

       this.saveFeed(this.props.item)
    }
        createFeed(item){
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

                    <TouchableHighlight onPress={this.save.bind(this)}>

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
                 likeIcon = <Button transparent style={styles.iconView} onPress={this.like.bind(this)}>
                    <Text>{likes}</Text>
                    <Icon style={styles.like} size={20} name="heart"/>
                    <Text>like</Text>

                </Button>

                if (item.social && item.social.like == true) {
                    likeIcon = <Button transparent style={styles.iconView} onPress={this.unlike.bind(this, item.id)}>
                        <Text>{likes}</Text>

                        <Icon color="#0000b3" style={styles.like} size={20} name="heart"/>
                        <Text>like</Text>
                    </Button>


                }
            }








            return (  <Card   {...this._panResponder.panHandlers} >


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
}


