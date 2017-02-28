import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header} from 'native-base';

import HeaderContent from './../homeHeader';
import login from './business-theme';
import styles from './styles';
//import AlertContainer from 'react-alert';

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
        this.props.replaceAt('business', {key: route}, this.props.navigation.key);
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


                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>


                    <View theme={login} style={styles.AddContainer}>
                        <Button  onPress={() =>  this.replaceRoute('add-business')} style={styles.logoButton} >
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
