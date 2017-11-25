import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Container, Content, Footer, Header, Icon, Input, InputGroup, Text, View} from 'native-base';
import styles from './styles';
import * as promotionAction from "../../actions/promotions";
import Camera from 'react-native-camera';

import {getInstance} from "../../selectors/form/scanQrcodeSelector";
import {bindActionCreators} from "redux";
import PromotionView from './promotionView/index';

class Qrcode extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            isRealized: false,
            qrCode: '',
            realizedMessage: ''
        }
        ;
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.clearRealizationForm();
    }

    onBarCodeRead(data) {
        const {actions} = this.props;
        let qrcode = JSON.parse(data.data);
        if (!this.state.isRealized) {
            this.setState({
                isRealized: false,
                realizedMessage: '',
                qrcode: qrcode.code
            })
            actions.setPromotionDescription(qrcode.code);
        }
    }

    realize() {
        const {actions} = this.props;
        if (this.state.qrcode) {
            actions.realizePromotion(this.state.qrcode);
            this.setState({
                isRealized: false,
                qrcode: ''
            });
        }
    }

    render() {
        const {instance} = this.props;
        if (instance) {
            return (

                <Container>

                    <Content>

                        <PromotionView item={instance}/>

                    </Content>
                    <Footer style={{backgroundColor: '#fff'}}>
                        <Button transparent title='Ok'
                                onPress={() => this.realize()}>
                            <Text> Accept Promotion </Text>
                        </Button>
                    </Footer>
                </Container>
            );
        }
        return (

            <Container>

                <Content>


                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        onBarCodeRead={this.onBarCodeRead.bind(this)}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.imageButtomText}>{this.state.realizedMessage}</Text>

                    </Camera>

                </Content>
                <Footer style={{backgroundColor: '#fff'}}>
                    <Text>Scanning Code</Text>
                </Footer>
            </Container>
        );
    }
}

export default connect(
    state => ({
        scanQrcodeForm: state.scanQrcodeForm,
        instance: getInstance(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(Qrcode);




