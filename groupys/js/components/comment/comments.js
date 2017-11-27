import React, {Component} from 'react';
import {
    Image,
    TextInput,
    Platform,
    View,
    Keyboard,
    TouchableNativeFeedback,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Footer, Icon, Button, Text, Input, Thumbnail} from 'native-base';
import CommentsComponenet from './commentsComponent';
import styles from './styles'
import CommentApi from '../../api/commet'

let commentApi = new CommentApi();
import {bindActionCreators} from "redux";
import * as commentAction from "../../actions/comments";

import {BusinessHeader, MessageBox, PromotionHeader} from '../../ui/index';

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

    render() {
        const item = this.getInstance();
        const business = this.getBusiness(item);

        return <View behavior={'position'} style={styles.inputContainer}>
            <BusinessHeader showBack navigation={this.props.navigation} business={business}
                            categoryTitle={business.categoryTitle} businessLogo={item.businessLogo}
                            businessName={item.businessName}/>


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



