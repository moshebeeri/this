import React, {Component} from 'react';
import {
    Dimensions,
    I18nManager,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Input, Text, Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import CommentsComponenet from './commentsComponent';
import styles from './styles'
import {bindActionCreators} from "redux";
import * as commentAction from "../../actions/comments";
import {BusinessHeader} from '../../ui/index';
import StyleUtils from "../../utils/styleUtils";

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
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        const business = this.getBusiness(item);
        return <View behavior={'position'} style={[styles.inputContainer, {width: StyleUtils.getWidth() - 15}]}>

            {item.businessName && <BusinessHeader showBack navigation={this.props.navigation} business={business}
                                                  categoryTitle={business.categoryTitle}
                                                  businessLogo={item.businessLogo}
                                                  businessName={item.businessName}/>}
            {item.feed && item.feed.activity && item.feed.activity.post &&
            <View style={{flexDirection: 'row', backgroundColor: 'white', height: 60, width: StyleUtils.getWidth() - 15}}>
                <TouchableOpacity transparent style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginTop: 5,
                    marginLeft: 5,
                    marginRight: 5
                }} onPress={() => this.back()}>
                    <Icon color={"#2db6c8"} size={30} name={arrowName}/>

                </TouchableOpacity>
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

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'genericComments') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        comments: state.comments,
        currentScreen: state.render.currentScreen,
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(GenericComments);



