import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header} from 'native-base';

import HeaderContent from './../homeHeader';

import theme from './qccode-theme';
import styles from './styles';
import store from 'react-native-simple-store';
import Camera from 'react-native-camera';
const {
    replaceAt,
} = actions;


class Qrcode extends Component {

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
            rowsView: []
        }
        ;

        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {

            stateFunc({
                    token: storeToken
                }
            );
        });
        store.get('user_id').then(storeUserId => {
            stateFunc({
                    userId: storeUserId
                }
            );
        });


    }





    replaceRoute(route) {
        this.props.replaceAt('qrcode', {key: route}, this.props.navigation.key);
    }





    onBarCodeRead(data){
        console.log(data);

    }

    takePicture() {
        this.camera.capture()
            .then((data) => console.log(data))
            .catch(err => console.error(err));
    }

    render() {


        return (

            <Container>
                <Header
                    style={{ flexDirection: 'column',
                        height: 110,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <HeaderContent />
                </Header>


                <Content theme={theme} style={{backgroundColor: theme.backgroundColor}}>


                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        onBarCodeRead  = {this.onBarCodeRead.bind(this)}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
                    </Camera>

                </Content>
            </Container>
        );
    }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Qrcode);
