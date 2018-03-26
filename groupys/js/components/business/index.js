import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Header, Item, ListItem, Picker, Right, Spinner, Thumbnail, View} from 'native-base';
import BusinessListView from './business-list-view/index'
import * as businessAction from "../../actions/business";
import {getMyBusinessesItems} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import GenericListManager from '../generic-list-manager/index';

class Business extends Component {
    constructor(props) {
        super(props);
        this.props.actions.fetchBusinessCategories('root');
    }

    componentWillMount() {
        const {businesses} = this.props;
        if (!businesses || businesses.length === 0) {
            this.props.actions.onEndReached();
        }
    }

    render() {
        const {businesses, navigation, businessLoading, update, actions, user} = this.props;
        if (businessLoading && businesses.length === 0) {
            return <Spinner/>
        }
        if (!businessLoading && businesses.length === 0) {
            return <View></View>
        }
        return (
            <Container style={{backgroundColor: `${appBackgroundColor}`}}>


                <GenericListManager user={user} noRefresh rows={businesses} navigation={navigation} actions={actions}
                                    update={update}
                                    ItemDetail={BusinessListView}/>

            </Container>
        );
    }
}

export default connect(
    state => ({
        businessLoading: state.businesses.loading,
        user: state.user.user,
        selectedBusiness: state.businesses.selectedBusiness,
        update: state.businesses.update,
        businesses: getMyBusinessesItems(state),
        network: state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Business);
