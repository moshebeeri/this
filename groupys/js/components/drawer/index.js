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
       this.replaceRoute('businesses');

    }

    showPromotions(){
        this.replaceRoute('home');

    }


    render() {
        return (
        <Container>
            <Content theme={login} style={{backgroundColor: '#fff'}}>


                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={noPic}/>
                </Image>

                <Item   onPress={() => this.showPromotions()} style={{ margin:3 } } regular>
                    <Button  onPress={() => this.showPromotions()} iconLeft transparent  >
                       <Icon name='home' />
                        <Text style={{ fontStyle: 'normal',fontSize:15 }}>My Promotions </Text>

                    </Button>
                </Item>
                <Item  onPress={() => this.showBusiness()}  style={{ margin:3 } } regular>
                    <Button onPress={() => this.showBusiness()}   iconLeft transparent  >
                        {/*<Icon name='user' />*/}
                        <Text style={{ fontStyle: 'normal',fontSize:15 }}>My Businesses</Text>

                    </Button>
                </Item>
                <Item    style={{ margin:3 } } regular>
                    <Button style={{width:100}} iconLeft transparent  >
                        {/*<Icon name='user' />*/}
                        <Text style={{ fontStyle: 'normal',fontSize:15 }}>Profile </Text>

                    </Button>
                </Item>
                {/*<Item  style={{ margin:3 } } regular>*/}

                {/*<Text style={styles.status}>Phone nuumber: {this.state.phoneNumber}</Text>*/}
                {/*</Item>*/}

            </Content>
        </Container>

        );
    }
}
