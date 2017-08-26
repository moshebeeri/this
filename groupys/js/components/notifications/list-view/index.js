import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity,Dimensions} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
const covefr = require('../../../../images/cover2.png');
import styles from './styles'
const {width, height} = Dimensions.get('window')
export default class BusinessListView extends Component {


    constructor(props) {
        super(props);

    }





    accept(){



    }

    decline(){

    }
    createView(){

        if(this.props.item.note =="ask_invite") {
            let group = this.props.item.group;
            let user = this.props.item.actor_user;
            let image =  <Thumbnail large square   source={require('../../../../images/client_1.png')}/>

            if(group.pictures && group.pictures.length > 0) {
                image =  <Thumbnail large square  source={{uri: group.pictures[0].pictures[3]}} />

            }else{
                if(group.entity && group.entity.business ){
                    image =  <Thumbnail large square  source={{uri: group.entity.business.pictures[0].pictures[3]}} />


                }
            }

            let reddemStyle ={
                flex:-1,justifyContent:'center',marginLeft:0 ,flexDirection: 'row',height: 40,width:width/2, backgroundColor: '#e65100',
            };
            let postStyle ={
                flex:-1,justifyContent:'center',marginLeft:0 ,flexDirection: 'row',height: 40,width:width/2, backgroundColor: '#363636',
            };

            let nameWidth = this.props.item.group.name.length * 10;
            return ( <View style={{padding: 5, backgroundColor: '#eaeaea'}}>
                    <View style={{
                        flex: -1,
                        padding: 5,
                        backgroundColor: 'white',
                        flexDirection: 'row',

                        alignItems: 'center',
                    }}>

                        {image}

                        <View style={{flexDirection: 'column',width:width - 50,height: 80,justifyContent: 'space-between' }}>
                            <Text style={{width:nameWidth, alignItems: 'center'}}> {this.props.item.group.name}</Text>

                            <Text style={{marginLeft:10,height:50,width:200 }}>{user.name} invites you to join the group </Text>

                        </View>


                    </View>

                    <View style={styles.promotion_action_container}>
                        <Button  style={postStyle} onPress={this.decline.bind(this)}>


                            <Text>Decline</Text>


                        </Button>
                        <Button  style={reddemStyle} onPress={this.accept.bind(this)}>


                            <Text>Accept</Text>


                        </Button>
                    </View>
                </View>

            );
        }

        return <View></View>



    }
    render() {
        return this.createView();

    }



}

