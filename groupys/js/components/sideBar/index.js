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

class SideBar extends Component {

    static propTypes = {
        navigateTo: React.PropTypes.func,
    };

    navigateTo(route) {
        this.props.navigateTo(route, 'home');
    }

    render_minimal() {
        return (
            <Content>
                <Text>Shop by Category </Text>
            </Content>
        );
    }

    render() {
        return (
            <Content theme={theme} style={{ backgroundColor: '#fff', paddingTop:25 }}>
                <Text style={styles.name}>John Doe </Text>
                <Text style={styles.status}>$ 500, Strap Sale Credit </Text>
                <Image style={styles.image} source={cover}>
                    <Image style={styles.thumbnail} source={profile}/>
                </Image>

                <List foregroundColor={'#000'} style={styles.list}>
                    <Text style={{ color: '#000', fontSize: 16, margin: 20, fontWeight: '500', marginBottom: 10 }}>Shop by Category </Text>
                    <Nav to="home" name="Home" icon="ios-home-outline" navigateTo={this.navigateTo.bind(this)}/>
                    <Nav to="business" name="Business" icon="ios-cash-outline" navigateTo={this.navigateTo.bind(this)}/>
                    <Nav to="groups" name="Groups" icon="ios-people-outline" navigateTo={this.navigateTo.bind(this)}/>
                    <Nav to="promotions" name="Promotions" icon="ios-pricetags-outline"
                         navigateTo={this.navigateTo.bind(this)}/>
                    <Nav to="qrcode" name="Qrcode" icon="ios-people-outline" navigateTo={this.navigateTo.bind(this)}/>

                </List>
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
