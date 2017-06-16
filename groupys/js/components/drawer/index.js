import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Item} from 'native-base';





import theme from '../../themes/base-theme';
import styles from './styles';


const logo = require('../../../images/logo.png');
const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');
import UserApi from '../../api/user'
import login from './drwaer-theme';
let userApi = new UserApi()
export default class ProfileDrawer extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber:''

        };
    }

    async componentWillMount(){
        let user = await userApi.getUser();
        this.setState({
            phoneNumber:user.country_code + '-' + user.phone_number
        });


    }


    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    showBusiness(){
        console.log('press')

    }


    render() {
        return (
        <Container>
            <Content theme={login} style={{backgroundColor: '#fff'}}>


                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={noPic}/>
                </Image>

                <Item  style={{ margin:3 } } regular>
                    <Button  iconLeft transparent  onPress={() => this.showBusiness()}>
                       <Icon name='camera' />
                        <Text style={{ fontStyle: 'normal',fontSize:10 }}>Pick </Text>

                    </Button>
                </Item>
                <Item  style={{ margin:3 } } regular>
                    <Button style={{width:100}} iconLeft transparent  onPress={() => this.showBusiness()}>
                        <Icon name='camera' />
                        <Text style={{ fontStyle: 'normal',fontSize:10 }}>Profile </Text>

                    </Button>
                </Item>
                <Item  style={{ margin:3 } } regular>

                <Text style={styles.status}>Phone nuumber: {this.state.phoneNumber}</Text>
                </Item>

            </Content>
        </Container>

        );
    }
}
