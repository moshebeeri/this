/**
 * Created by roilandshut on 04/09/2017.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as businessAction from "../../../actions/business";
import FollowView from './index'

class BusinessFollow extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {navigation, state, actions} = this.props;
        return (
            <FollowView
                cameraOn={state.cameraOn}
                searching={state.searching}
                businesses={state.businesses}
                navigation={navigation}
                {...actions} />
        );
    }
}

export default connect(state => ({
        state: state.follow_businesses
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch)
    })
)(BusinessFollow);