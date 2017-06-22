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
            feed = this.createFeed(this.props.item);

            return feed;
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
                        source={{uri: item.banner.uri}}>
                        <Text style={{ fontWeight: 'bold',marginLeft:20,marginTop:170,fontSize:25,color:'white'}}>{item.itemTitle}</Text>
                        <Text style={{fontWeight: 'bold',marginLeft:20,marginTop:5,color:'white',fontSize:15}}note>{item.description} </Text>
                    </Image>
                        }

                if (item.banner.require) {
                    banner = <Image
                        style={{padding: 5, flex: -1}}
                        source={item.banner.require}>
                        <Text style={{ fontWeight: 'bold',marginLeft:20,marginTop:170,fontSize:25,color:'white'}}>{item.itemTitle}</Text>
                        <Text style={{fontWeight: 'bold',marginLeft:20,marginTop:5,color:'white',fontSize:15}}note>{item.description} </Text>
                    </Image>
                }
            }else{
                banner = <Item>
                    <Text style={{marginLeft:20,marginTop:170,fontSize:25}}>{item.itemTitle}</Text>
                    <Text style={{marginLeft:20,marginTop:200,fontSize:10}} note>{item.description} </Text>

                </Item>
            }






            return (  <Card   {...this._panResponder.panHandlers} >
                    <CardItem>

                        <Left>
                            {logo}
                            <Body>


                            </Body>
                        </Left>

                    </CardItem>


                    <View style={{flex:-1,justifyContent:'center',height:300}}>
                    {secondFeed}
                        {banner}
                    </View>
                    <View   style={styles.buttonView}>

                        <TouchableHighlight onPress={this.realize.bind(this)}>

                            <LinearGradient
                                start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}

                                locations={[0.0, 1.0]}
                                colors={['#3e595c', '#00d3a9']}
                                style={styles.button}>


                                <Text style={styles.buttonText}>Realize</Text>


                            </LinearGradient>
                        </TouchableHighlight>



                    </View>

                </Card>

            );

        }
}


