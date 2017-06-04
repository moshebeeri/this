import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';




import login from './drwaer-theme';
import styles from './styles';


const logo = require('../../../images/logo.png');

export default class ProfileDrawer extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {


        };
    }



    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }



    render() {
        return (
            <Container>
                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>
                    <Image source={logo} style={styles.shadow}/>


                </Content>
            </Container>
        );
    }
}
