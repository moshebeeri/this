
import React, {Component} from 'react';
import {View,TouchableOpacity} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Thumbnail} from 'native-base';
import styles from './styles'
import DateUtils from '../../utils/dateUtils'
import {ThisText} from '../index'
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import strings from "../../i18n/i18n"
let dateUtils = new DateUtils();
export default class ChatPreviewPromotion extends Component {



    cancelReply(){
        const {cancelReply} = this.props;

        cancelReply();
    }
    render() {
        const {text,isPost,title} = this.props;
        const containerStyle = {
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            alignItems: 'flex-start',
            backgroundColor: '#E6E6E6',
        };
        let styleContainer = styles.messageUserName;

        let icon =  <Icon active color={"#2db6c8"} size={25} name={'tag'}/>;
        let titleText = strings.CreatedByBusiness.formatUnicorn(title);
        if(isPost){
            titleText = strings.postMessage.formatUnicorn(title);
            icon = <Ionicons size={30} style={{marginRight:12,}}color={'#2db6c8'}
                      name="ios-person-outline"/>

        }
        return <View style={containerStyle}>
            <View style={styles.messageUsercomponent}>


                <View>

                    <View style={{flexDirection: 'row'}}>

                        <View style={styleContainer}>


                            <View style={styles.message_container_user}>
                               <View style={{flexDirection:'row'}}>

                                   <ThisText style={{
                                       fontSize: 14,
                                       color: '#616F70',
                                       marginTop:5,
                                       width:300,
                                   }}>{titleText}</ThisText>
                                   <TouchableOpacity onPress={this.cancelReply.bind(this)} style={{alignItems:'flex-end',justifyContent:'flex-end',marginRight:5,marginTop:5}}>

                                       <Ionicons active color={"#2db6c8"} size={25} name={'ios-close-circle-outline'}/>
                                   </TouchableOpacity>
                               </View>
                                <View style={{
                                    borderTopColor: '#E6E6E6',

                                    flexDirection: 'row'
                                }}>
                                    {icon}
                                    <ThisText style={{
                                        fontSize: 14,
                                        color: '#616F70',
                                        width:300,
                                    }}>{text}</ThisText></View>

                            </View>


                        </View>

                    </View>


                </View>

            </View>


        </View>
    }

    shouldComponentUpdate() {
        return false;
    }

    createMessageTime(date, isUser) {
        if (date) {
            return <ThisText note
                             style={styles.timeText}>{dateUtils.messageFormater(date)}</ThisText>
        }
        return undefined;
    }
}

