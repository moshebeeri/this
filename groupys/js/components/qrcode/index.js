import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header,Footer} from 'native-base';



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
            qrCode:'',
            realizedMessage:''
        }
        ;



    }










     onBarCodeRead(data){
        let qrcode = JSON.parse(data.data);
        if(!this.state.isRealized) {
             this.setState({
                qrcode: qrcode,
                isRealized: false,
                realizedMessage:''
            })
        }


    }



    async realize(){

        if(this.state.qrcode){
            try {
                let response = await promotionApi.realizePromotion(this.props.navigation.state.params.qrcode.code)
                let realizedMessage = 'Promotion ' + response.instance.promotion.name + ' realized';
                this.setState({
                    realizedMessage: realizedMessage,
                    isRealized: true,
                    qrcode: ''
                })
            }catch (error){
                let realizedMessage = 'Promotion was realized'
                this.setState({
                    realizedMessage: realizedMessage,
                    isRealized: true,
                    qrcode: ''
                })

            }

        }else{
            this.setState({
                realizedMessage: '',
                isRealized: false,
                qrcode: ''
            })
        }
    }

    render() {

        let showButton = undefined;
        if(this.state.qrcode){
            showButton=   <Button transparent title='Ok'
                    onPress={() => this.realize()}>
                <Text > Realize </Text>
            </Button>
        }
        return (

            <Container>

                <Content >


                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        onBarCodeRead  = {this.onBarCodeRead.bind(this)}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.imageButtomText} >{this.state.realizedMessage}</Text>

                    </Camera>

                </Content>
                <Footer style={{backgroundColor: '#fff'}}>
                    {showButton}
                </Footer>
            </Container>
        );
    }
}





