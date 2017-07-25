import React, {Component} from 'react';
import {Image ,Platform,PanResponder,TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';

import PromotionApi from '../../../api/promotion'
let promotionApi = new PromotionApi();

import LinearGradient from 'react-native-linear-gradient';
import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Entypo';

import  UserApi from '../../../api/user'

let userApi = new UserApi();

import AcrivityApi from "../../../api/activity"
let activityApi = new AcrivityApi();

import FeedMessage from './feed-components/feedMessage'
import FeedPromotion from './feed-components/feedPromotion'
import FeedBusiness from './feed-components/feedBusiness'




export default class GenericFeedItem extends Component {





    constructor(props) {
        super(props);
        this.state = {
            zone:{}
        }


    }


    async componentWillMount() {

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
    showUsers(show){
        let users = this.props.userFollowers;
        if(users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.selectUsers.bind(this)
            })
        }

    }

    comment(){
        this.props.navigation.navigate('InstanceGroupComments', {
            group: this.props.group,
            instance: this.props.item
        })

    }
    async selectUsers(users){
        let activityId = this.props.item.activityId;

        if(activityId) {
            users.forEach(async function (user) {
                await activityApi.shareActivity(user,activityId)
            })

        }
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
            let like = this.like.bind(this);
            let unlike = this.unlike.bind(this);
            let showUsers = this.showUsers.bind(this);
            let save = this.save.bind(this);
            let comment = this.comment.bind(this);


            switch (item.itemType){
                case 'PROMOTION':
                    feed = <FeedPromotion comment= {comment} navigation={this.props.navigation} item={item} like={like}  unlike={unlike} showUsers={showUsers} save={save}    />
                    break;
                case 'MESSAGE':
                    feed = <FeedMessage navigation={this.props.navigation} item={item} />
                    break

                default:
                    feed = <FeedBusiness navigation={this.props.navigation} item={item} like={like}  unlike={unlike} showUsers={showUsers} save={save} _panResponder={this._panResponder} />
                    break;
            }


            return feed;
        }






        like(){
            this.props.item.social.like = true;
            this.props.item.social.numberLikes = this.props.item.social.numberLikes + 1;
            userApi.like( this.props.item.id);
            this.props.selectApi.updateFeed( this.props.item);
        }

        unlike(){
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

    save(){

       this.saveFeed(this.props.item)
    }

}


