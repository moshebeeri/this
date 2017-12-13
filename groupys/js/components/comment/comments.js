import React, {Component} from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Icon, Input, Text, Thumbnail} from 'native-base';
import CommentsComponenet from './commentsComponent';
import styles from './styles'
import CommentApi from '../../api/commet'
import {bindActionCreators} from "redux";
import * as commentAction from "../../actions/comments";
import {BusinessHeader} from '../../ui/index';

const {width, height} = Dimensions.get('window');

let commentApi = new CommentApi();

class GenericComments extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    getInstance() {
        if (this.props.instance) {
            return this.props.instance;
        }
        if (this.props.navigation.state.params.instance) {
            return this.props.navigation.state.params.instance;
        }
        return this.props.item;
    }

    getBusiness(item) {
        if (item.business) {
            return item.business
        }
        return item;
    }
    back() {
        this.props.navigation.goBack();
    }

    render() {
        const item = this.getInstance();
        const business = this.getBusiness(item);
        return <View behavior={'position'} style={styles.inputContainer}>
            {item.businessName && <BusinessHeader showBack navigation={this.props.navigation} business={business}
                                                  categoryTitle={business.categoryTitle}
                                                  businessLogo={item.businessLogo}
                                                  businessName={item.businessName}/>}
            {item.feed && item.feed.activity && item.feed.activity.post &&
        <View style={{flexDirection: 'row', backgroundColor: 'white', height:60, width: width - 15}}>
            <Button transparent style={{justifyContent:'center',alignItems:'center',marginTop:5,marginLeft:5,marginRight:5}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

            </Button>
            <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Thumbnail small source={item.avetar}/>
            </View>
            <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                <Text>{item.name}</Text>
                <Text>{item.feed.activity.post.title}</Text>
            </View>

        </View>
        }

            <CommentsComponenet navigation={this.props.navigation}
                                instance={this.props.navigation.state.params.instance}
                                entities={this.props.navigation.state.params.entities}
                                generalId={this.props.navigation.state.params.generalId}
                                showComments={true}/>
        </View>
    }
}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(GenericComments);



