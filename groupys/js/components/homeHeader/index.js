import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Image} from 'react-native';
import {Icon, View, Button, InputGroup, Input} from 'native-base';
import {openDrawer} from '../../actions/drawer';
import navigateTo from '../../actions/sideBarNav';
import theme from '../../themes/base-theme';
import styles from './styles';

class Header extends Component {
    static propTypes = {
        openDrawer: React.PropTypes.func,
        navigateTo: React.PropTypes.func,
    };

    navigateTo(route) {
        this.props.navigateTo(route, 'home');
    }

    render() {
        return (
            <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button transparent style={{paddingRight: 15}} onPress={this.props.openDrawer}>
                        <Icon name="ios-menu"/>
                    </Button>

                </View>

            </View>
        );
    }
}

function bindAction(dispatch) {
    return {
        openDrawer: () => dispatch(openDrawer()),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});
export default connect(mapStateToProps, bindAction)(Header);
