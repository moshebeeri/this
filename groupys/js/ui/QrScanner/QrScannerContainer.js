/**
 * Created by roilandshut on 04/09/2017.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as scannerAction from "../../actions/scanner";
import QrScanner from './QrScanner'
import {getInstance} from "../../selectors/form/QrScannerSelector";

class BusinessFollow extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.resetForm();
    }

    render() {
        const {state, actions, group,business, instance,navigation} = this.props;
        return (
            <QrScanner
                cameraOn={state.cameraOn}
                searching={state.searching}
                business={state.business}
                showNotAuthorizedMessage={state.notAuthotized}
                ShowOutOffScope={state.conditionOutOfScope}
                showAssigmentMessage ={state.showAssigmentMessage}
                showAssigmentMessageFailed ={state.showAssigmentMessageFailed}
                businessAssign ={business}
                instance={instance}
                code={state.code}
                group={group}
                followGroup={state.followGroup}
                navigation={navigation}
                {...actions} />
        );
    }
}

export default connect(state => ({
        state: state.scannerForm,
        instance: getInstance(state)
    }),
    (dispatch) => ({
        actions: bindActionCreators(scannerAction, dispatch)
    })
)(BusinessFollow);