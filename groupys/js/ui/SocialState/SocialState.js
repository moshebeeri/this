import React, {Component} from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/Entypo';


import styles from './styles'


export default class SocialState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            valid:true,
        }
    }



    isValid(){
        return true;
    }


    render() {
        return <View style={styles.socialContainer}>
            {this.createLikeButton()}
            {this.createCommentButton()}
            {this.createShareButton()}
        </View>
    }

     createCommentButton() {
         const {comments, disabled,onPressComment,feed} = this.props;
         let componentStyle = styles.promotionBusiness;
         if(feed) {
             componentStyle = styles.promotionFeed;
         }
         if(disabled){
             return <View transparent style={styles.promotion_iconView} >
                 <Icon2 style={componentStyle} size={25} name="comment"/>
                 <Text style={styles.socialTextColor}>{comments}</Text>
             </View>;
         }

         return <Button transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <Icon2 style={componentStyle} size={25} name="comment"/>
            <Text style={styles.socialTextColor}>{comments}</Text>
        </Button>;
    }
    createLikeButton() {
        const {like,likes, disabled,onPressUnLike, onPressLike,feed} = this.props;
        let componentStyle = styles.promotionBusiness;
        if(feed) {
            componentStyle = styles.promotionFeed;
        }
        if(disabled){
            return <View transparent style={styles.promotion_iconView}>
                <Icon style={componentStyle} size={20} name="heart"/>
                <Text style={styles.socialTextColor}>{likes}</Text>
            </View>
        }
        if (like) {
            return <Button transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Icon style={styles.promotionLikeActive} size={20} name="heart"/>
                <Text style={styles.socialTextColor}>{likes}</Text>

            </Button>
        }
        return <Button transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Icon style={componentStyle} size={20} name="heart"/>
            <Text style={styles.socialTextColor}>{likes}</Text>

        </Button>
    }

    createShareButton() {
        const {share,shares, disabled,shareAction,feed} = this.props;
        let componentStyle = styles.promotionBusiness;
        if(feed) {
            componentStyle = styles.promotionFeed;
        }
        if(disabled){
            return <View transparent style={styles.promotion_iconView} >

                <Icon3 style={componentStyle} size={25} name="share"/>
                <Text style={styles.socialTextColor}>{shares}</Text>

            </View>
        }

        if (share) {
            return <Button transparent style={styles.promotion_iconView} onPress={shareAction}>

                <Icon3 style={styles.promotionShareActive} size={25} name="share"/>
                <Text style={styles.socialTextColor}>{shares}</Text>


            </Button>
        }
        return <Button transparent style={styles.promotion_iconView} onPress={shareAction}>

            <Icon3 style={componentStyle} size={25} name="share"/>
            <Text style={styles.socialTextColor}>{shares}</Text>
        </Button>;
    }
}

