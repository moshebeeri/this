import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';
import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import  FeedUiConverter from '../../../api/feed-ui-converter'
import StyleUtils from '../../../utils/styleUtils'
let feedUiConverter = new FeedUiConverter();
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
export default class PromotionListView extends Component {


    constructor(props) {
        super(props);

    }



    showProduct(props,item){

        this.props.navigation.navigate(this.props.addform,{item:item});
    }

    render() {
        return this.createPromotion(this.props.item);

    }

    createPromotion(promotionItem){
        let item = feedUiConverter.createPromotionAttributes(promotionItem,promotionItem.type)
        let styles = stylesPortrate
        if(StyleUtils.isLandscape()){
            styles = stylesLandscape;
        }

        let promotion = undefined;
        let colorStyle = {

            color: item.promotionColor,

            fontFamily:'Roboto-Regular' ,marginLeft:10,marginTop:4,fontSize:16
        }


        promotion = <Text style={colorStyle}>{item.promotion}</Text>

        let image = undefined;
        if(item.banner){
             // image =  <Image resizeMode= "cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
        }


        let result =
            <View style={styles.promotion_container}>
                <View style={styles.promotion_card}>


                    {image}
                    <View style={styles.promotion_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                            <View style={styles.promotion_buttom_location}>
                                <Icon2 style={styles.promotion_location}  size={25} name="clock"/>
                                <Text style={styles.promotion_addressText} note>{item.endDate } </Text>

                            </View>
                            <View style={styles.promotion_buttom_location}>
                                <Icon3 style={styles.promotion_location}  size={25} name="location-on"/>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress } </Text>
                            </View>
                        </View>
                    </View>



                </View>
            </View>

        return result;
    }

}

