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
        const {state, actions, group, instance,navigation} = this.props;
        return (
            <QrScanner
                cameraOn={state.cameraOn}
                searching={state.searching}
                business={state.business}
                instance={instance}
                code={state.code}
                group={group}
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