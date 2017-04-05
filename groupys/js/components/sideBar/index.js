import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {View, Text, Icon, List, ListItem, Content} from 'native-base';
import {Nav} from '../../utils/nav'

import navigateTo from '../../actions/sideBarNav';
import theme from '../../themes/base-theme';
import styles from './style';

const cover = require('../../../images/cover-default.png');
const profile = require('../../../images/profile-default.png');
const noPic = require('../../../images/client_1.png');
import store from 'react-native-simple-store';
import UserApi from '../../api/user'

let userApi = new UserApi()
class SideBar extends Component {

    static propTypes = {
        navigateTo: React.PropTypes.func,
    };

    navigateTo(route) {
        this.props.navigateTo(route, 'home');
    }

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',


        };
    }
    async componentWillMount(){
        let user = await userApi.getUser();
        this.setState({
            phoneNumber:user.country_code + '-' + user.phone_number
        });


    }

    render() {
        return (
            <Content theme={theme} style={{ backgroundColor: '#fff', paddingTop:25 }}>
                <Text style={styles.status}>Phone nuumber: {this.state.phoneNumber}</Text>
                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={noPic}/>
                </Image>


            </Content>
        );
    }
}

function bindAction(dispatch) {
    return {
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SideBar);
