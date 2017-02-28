import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';


import login from './business-theme';
import styles from './styles';
//import AlertContainer from 'react-alert';
const addIcon = require('../../../images/add-property-xxl.png');

const {
    replaceAt,
} = actions;


class Business extends Component {

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
            validationMessage: ''
        };
    }





    replaceRoute(route) {
        this.props.replaceAt('signup', {key: route}, this.props.navigation.key);
    }




    render() {
        return (
            <Container>

                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>


                    <View theme={login} style={styles.AddContainer}>
                        <Button style={styles.logoButton}>
                            <Icon name="ios-add-circle-outline" />
                        </Button>
                    </View>


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

export default connect(mapStateToProps, bindActions)(Business);
