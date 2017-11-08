import React, {Component} from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
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
        const {} = this.props;

        return <View style={styles.socialContainer}>
            {this.createLikeButton()}
            {this.createCommentButton()}
            {this.createShareButton()}
        </View>
    }

     createCommentButton() {
         const {comments, disabled,onPressComment} = this.props;
         if(disabled){
             return <View transparent style={styles.promotion_iconView} >
                 <Icon2 style={styles.promotion_comment} size={30} name="comment"/>
                 <Text>{comments}</Text>
             </View>;
         }

         return <Button transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <Icon2 style={styles.promotion_comment} size={30} name="comment"/>
            <Text>{comments}</Text>
        </Button>;
    }
    createLikeButton() {
        const {like,likes, disabled,onPressUnLike, onPressLike} = this.props;
        if(disabled){
            return <View transparent style={styles.promotion_iconView}>
                <Icon style={styles.promotion_like} size={25} name="heart"/>
                <Text>{likes}</Text>
            </View>
        }
        if (like) {
            return <Button transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Icon style={styles.promotion_like} size={25} name="heart"/>
                <Text>{likes}</Text>

            </Button>
        }
        return <Button transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Icon style={styles.promotion_unlike} size={25} name="heart"/>
            <Text>{likes}</Text>

        </Button>
    }

    createShareButton() {
        const {share,shares, disabled,shareAction,} = this.props;

        if(disabled){
            return <View transparent style={styles.promotion_iconView} >

                <Icon2 style={styles.promotion_share} size={30} name="share-google"/>
                <Text>{shares}</Text>

            </View>
        }

        if (share) {
            return <Button transparent style={styles.promotion_iconView} onPress={shareAction}>

                <Icon2 style={styles.promotion_share} size={30} name="share-google"/>
                <Text>{shares}</Text>


            </Button>
        }
        return <Button transparent style={styles.promotion_iconView} onPress={shareAction}>

            <Icon2 style={styles.promotion_comment} size={30} name="share-google"/>
            <Text>{shares}</Text>
        </Button>;
    }
}

