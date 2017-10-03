import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Button,
    Icon,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';
import GenericListManager from '../generic-list-manager/index';
import BusinessListView from './business-list-view/index'
import * as businessAction from "../../actions/business";
import {getMyBusinessesItems} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";

class Business extends Component {
    constructor(props) {
        super(props);
        this.props.actions.fetchBusinessCategories('root');
        this.state = {
            refresh: '',
        }
    }

    renderItem(item) {
        const {navigation} = this.props;
        return <BusinessListView
            item={item.item}
            index={item.index}
            navigation={navigation}
        />
    }

    componentWillMount() {
        this.props.actions.onEndReached();
    }

    render() {
        const {update, businesses, navigation, actions} = this.props;
        return (
            <GenericListManager rows={businesses} navigation={navigation} actions={actions} update={update}
                                ItemDetail={this.renderItem.bind(this)}/>
        );
    }
}

export default connect(
    state => ({
        update: state.businesses.update,
        businesses: getMyBusinessesItems(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Business);
