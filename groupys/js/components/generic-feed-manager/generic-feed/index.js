import React, {Component} from 'react';
import {Image ,Platform,PanResponder } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Icon,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import UserApi from '../../../api/user'
let userApi = new UserApi();
const {
    replaceAt,
} = actions;
;


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
            this.props.selectApi.reRender();
            userApi.like(item);
        }

        unlike(item){
            this.props.item.social.like = false;
            this.props.item.social.numberLikes = this.props.item.social.numberLikes - 1;
            this.props.selectApi.reRender();
            userApi.unlike(item);
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


            let banner = undefined;
            if(item.banner) {

                if (item.banner.uri) {
                    banner = <Image
                        style={{width: 400, height: 300,padding: 0, flex: -1}}
                        source={{uri: item.banner.uri}}/>
                }

                if (item.banner.require) {
                    banner = <Image
                        style={{padding: 5, flex: -1}}
                        source={item.banner.require}/>
                }
            }
            let likes = item.social.numberLikes + ' Likes'
            let likeIcon = <Button transparent small onPress={this.like.bind(this,item.actor)}>
                            <Icon  active style={{color: 'gray'}} name="thumbs-up" />
                            <Text>{likes}</Text>
                </Button>

            if(item.social && item.social.like == true){
                likeIcon = <Button transparent small onPress={this.unlike.bind(this,item.actor)} >
                                 <Icon active name="thumbs-up"  />
                                 <Text>{likes}</Text>
                            </Button>


            }

            let followIcon =  <Icon  active style={{color: 'gray'}} name="person" />;
            if( item.social && item.social.follow == true){
                followIcon = <Icon active name="person" />

            }




            return (  <Card   {...this._panResponder.panHandlers} >
                    <CardItem>

                        <Left>
                            {logo}
                            <Body>
                            <Text>{item.itemTitle}</Text>
                            <Text note>{item.description} </Text>
                            </Body>
                        </Left>

                    </CardItem>


                    <CardItem content>
                        {secondFeed}
                        {banner}
                    </CardItem>
                    <CardItem>

                       <Button transparent>
                            {likeIcon}

                        </Button>
                        <Button transparent>
                            {followIcon}
                            <Text> follow</Text>
                        </Button>

                    </CardItem>
                </Card>

            );

        }
}


