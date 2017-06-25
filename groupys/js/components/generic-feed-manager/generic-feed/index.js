import React, {Component} from 'react';
import {Image ,Platform,PanResponder,TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Icon,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import UserApi from '../../../api/user'
let userApi = new UserApi();
import PromotionApi from '../../../api/promotion'
let promotionApi = new PromotionApi();

import LinearGradient from 'react-native-linear-gradient';
import styles from './styles'

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
            feed = this.createFeed(this.props.item);

            return feed;
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
                        style={{width: 50, height: 50}}
                        source={{uri: item.logo.uri}}/>
                }

                if (item.logo.require) {
                    logo = <Image
                        style={{width: 50, height: 50}}
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
                buisnessLogo =  <Thumbnail style={styles.thumbnail} square source={{uri: item.businessLogo}} />

            }
            let banner = undefined;
            if(item.banner) {


                if (item.banner.uri) {
                    banner = <Image
                        style={styles.image}
                        source={{uri: item.banner.uri}}
                    >

                        {buisnessLogo}
                        <View style={styles.backdropView}>
                        <Text style={styles.imageTopText}>{item.itemTitle}</Text>
                        <Text style={styles.imageButtomText} note>{item.description} </Text>
                        </View>
                    </Image>
                }

                if (item.banner.require) {
                    banner = <Image
                        style={{padding: 0, flex: -1}}
                        source={item.banner.require}>
                        <Text style={{marginLeft:20,marginTop:170,fontSize:25}}>{item.itemTitle}</Text>
                    <Text style={{marginLeft:20,marginTop:200,fontSize:10}} note>{item.description} </Text>
                </Image>
                }

            }else{
                banner = <Item>
                    <Text style={{marginLeft:20,marginTop:170,fontSize:25}}>{item.itemTitle}</Text>
                    <Text style={{marginLeft:20,marginTop:200,fontSize:10}} note>{item.description} </Text>

                </Item>
            }
            let likes = new String(item.social.numberLikes);
            let likeIcon =<Button  transparent style={styles.buttonView}  onPress={this.like.bind(this)}>
                <Text>{likes}</Text>
                <Thumbnail style={styles.like}  source={require('../../../../images/like.jpg')}/>
            </Button>



            let saveIcon = undefined;


            let followIcon =undefined;


                followIcon = <Button transparent>
                    <Icon  active style={{color: 'gray'}} name="person" />
                        <Text> follow</Text>
                    </Button>

                if( item.social && item.social.follow == true){
                    followIcon =  <Button transparent>
                        <Icon active name="person" />
                        <Text> follow</Text>
                    </Button>

                }



            if(item.social && item.social.like == true){
                likeIcon = <Button transparent  style={styles.buttonView}  onPress={this.unlike.bind(this,item.id)} >

                                      <Text>{likes}</Text>
                                   <Thumbnail style={styles.like}  source={require('../../../../images/like_postive.jpg')}/>
                            </Button>


            }






            return (  <Card   {...this._panResponder.panHandlers} >
                    <CardItem>

                        <Left>
                            {logo}

                        </Left>

                    </CardItem>


                    <View style={{flex:-1,justifyContent:'center',height:300}}>
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


