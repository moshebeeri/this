import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header} from 'native-base';



import theme from './qccode-theme';
import styles from './styles';
import store from 'react-native-simple-store';
import Camera from 'react-native-camera';
import PromotionApi from '../../api/promotion'

let promotionApi = new PromotionApi()
export default  class Qrcode extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            isRealized: false,
            qrCode:''
        }
        ;



    }










    async onBarCodeRead(data){
        let qrcode = JSON.parse(data.data);
        if(!this.state.isRealized) {
            this.setState({
                qrcode: qrcode,
                isRealized: true
            })
        }


    }

    async componentWillUpdate(){
        console.log('will')

    }

    async componentDidUpdate(){
        console.log('did')
        if(this.state.qrcode){
            let response = await promotionApi.realizePromotion(this.state.qrcode.code)
        }
    }

    render() {


        return (

            <Container>

                <Content theme={theme} style={{backgroundColor: theme.backgroundColor}}>


                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        onBarCodeRead  = {this.onBarCodeRead.bind(this)}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.capture} >{this.state.qrCode}</Text>
                    </Camera>

                </Content>
            </Container>
        );
    }
}





