
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,Keyboard,TouchableNativeFeedback,TouchableOpacity,} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input ,Thumbnail} from 'native-base';
import GroupFeedHeader from './groupFeedHeader'

import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import CommentApi from '../../../api/commet'

let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentAction from "../../../actions/comments";

import EmojiPicker from 'react-native-emoji-picker-panel'
class Comments extends Component {
    static navigationOptions = ({ navigation }) => ({
        header:   <GroupFeedHeader navigation = {navigation} item={navigation.state.params.group}/>

    });
    constructor(props) {
        super(props);
        this.state = {

            messsage: '',
            showEmoji:false,
            iconEmoji:'emoji-neutral'

        };
        this.handlePick = this.handlePick.bind(this);


    }



    fetchFeeds(){
        this.props.fetchInstanceGroupComments(this.props.navigation.state.params.group._id,this.props.navigation.state.params.instance.id)

    }
    fetchTop(id){
        this.props.fetchInstanceGroupComments(this.props.navigation.state.params.group._id,this.props.navigation.state.params.instance.id)
    }


    componentWillMount(){
   //     this.props.fetchInstanceGroupComments(this.props.navigation.state.params.group._id,this.props.navigation.state.params.instance.id)
    }



    async getAll(direction,id){
        //
        // let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
        // return feed;
    }




    handlePick(emoji) {
        let message = this.state.messsage;

        this.setState({
            messsage: message + emoji ,
        });
    }


    showEmoji(){

        let show = !this.state.showEmoji;
        if(show) {
            this.setState({
                showEmoji: show,
                iconEmoji: "keyboard"

            })
        }else{
            Keyboard.dismiss();
            this.setState({
                showEmoji: show,
                iconEmoji: "emoji-neutral"

            })
        }
    }
    hideEmoji(){
        this.setState({
            showEmoji:false,
            iconEmoji:'emoji-neutral'
        })
    }

    _onPressButton(){
        commentApi.createComment(this.props.navigation.state.params.group._id, this.props.navigation.state.params.instance.id,this.state.messsage)

        this.setState({
            messsage:'',
        })
    }
    showComments(){

    }
    render() {
        let item = this.props.navigation.state.params.instance;
        let promotion = undefined;
        if(item.banner){
            promotion =  <Thumbnail  square={true} size={50} source={{uri: item.banner.uri}} />

        }
        let promotionType = undefined;
        let colorStyle = {

            color: item.promotionColor,

            fontFamily:'Roboto-Regular' ,marginLeft:10,marginTop:4,fontSize:16
        }


        promotionType = <Text style={colorStyle}>{item.promotion}</Text>

        let feeds = this.props.comments['comment'+this.props.navigation.state.params.group._id+ this.props.navigation.state.params.instance.id];
        if(!feeds){
            feeds = [];
        }
        return (
            <Container style={{ backgroundColor:'#ebebeb'}}>
                <View style={styles.comments_promotions}>
                    <View style={styles.comments_promotions}>
                    {promotion}
                    </View>
                    <View style={styles.comment_description_container}>
                        <Text style={styles.promotion_text_description}>{item.name}</Text>
                        {promotionType}
                        <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                    </View>
                    <View style={styles.comment_colapse}>
                        <Button   onPress={() => this.showComments()} style={styles.icon} transparent>

                            <Icon2 style={{fontSize:35,color:"#dadada"}} name="chevron-small-down"/>
                        </Button>
                    </View>
                </View>
                <GenericFeedManager navigation={this.props.navigation} loadingDone = {this.props.comments['LoadingDone' + this.props.navigation.state.params.group._id]+ this.props.navigation.state.params.instance.id} showTopTimer={false} feeds={feeds} api={this} title='comments' ItemDetail={GenericFeedItem}></GenericFeedManager>

                <View style={styles.itemborder}>
                    <View style={ {backgroundColor:'white',  flexDirection: 'row'}}>
                        <Button   onPress={() => this._onPressButton()} style={styles.icon} transparent>

                            <Icon style={{fontSize:35,color:"#2db6c8"}} name='send' />
                        </Button>
                        <Input value={this.state.messsage}  onFocus={this.hideEmoji.bind(this)} blurOnSubmit={true} returnKeyType='done' ref="3"  onSubmitEditing={this._onPressButton.bind(this)} onChangeText={(messsage) => this.setState({messsage})} placeholder='write text' />


                        <Button   onPress={() => this.showEmoji()} style={styles.icon} transparent>

                            <Icon2 style={{fontSize:35,color:"#2db6c8"}} name={this.state.iconEmoji} />
                        </Button>

                    </View>

                </View>
                <EmojiPicker stylw={{height:100}}visible={this.state.showEmoji}  onEmojiSelected={this.handlePick} />

            </Container>



        );
    }

}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(Comments);



