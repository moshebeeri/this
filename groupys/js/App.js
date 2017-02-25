import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
//import { Text } from 'react-native';

import theme from './themes/base-theme';
import AppNavigator from './AppNavigator';

import Modal from 'react-native-modalbox';


const height = Dimensions.get('window').height;
const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
    },
    box: {
        padding: 10,
        backgroundColor: 'transparent',
        flex: 1,
        height: height - 70,
    },
    space: {
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        height: 300,
    },
    modal2: {
        height: height - 78,
        position: 'relative',
        justifyContent: 'center',
    },
});

import { View, Text, Icon, List, ListItem, Content } from 'native-base';
import styles from './components/sideBar/style'
import { Image } from 'react-native';
const cover = require('../images/cover-default.png');
const profile = require('../images/profile-default.png');

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDownloadingModal: false,
            showInstalling: false,
            downloadProgress: 0,
        };
    }

//////
    render_del() {
        return (
            <Content theme={theme} style={{ backgroundColor: '#fff', paddingTop:25 }} >
                <Text style={styles.name}>John Doe </Text>
                <Text style={styles.status}>$ 500, Strap Sale Credit </Text>
                <Image style={styles.image} source={cover} >
                    <Image style={styles.thumbnail} source={profile} />
                </Image>

                <Text style={{ color: '#000', top:120, fontSize: 16, margin: 20, fontWeight: '500', marginBottom: 10 }}>Shop by Category </Text>
                <List foregroundColor={'#000'} style={styles.list}>

                    {/*<Nav to="home"  name="Home" style={styles} icon="ios-home-outline" navigateTo={this.navigateTo.bind(this)} />*/}
                    {/*<Nav to="business" name="Business" style={styles} icon="ios-cash-outline" navigateTo={this.navigateTo.bind(this)} />*/}
                    {/*<Nav to="groups" name="Groups" style={styles} icon="ios-people-outline" navigateTo={this.navigateTo.bind(this)} />*/}
                    {/*<Nav to="promotions" name="Promotions" style={styles} icon="ios-pricetags-outline" navigateTo={this.navigateTo.bind(this)} />*/}
                </List>
            </Content>
        );
    }

//////

    render() {
        if (this.state.showDownloadingModal) {
            return (
                <Container theme={theme} style={{ backgroundColor: theme.defaultBackgroundColor }}>
                    <Content style={styles.container}>
                        <Modal
                            style={[styles.modal, styles.modal1]}
                            backdrop={false}
                            ref={(c) => { this._modal = c; }}
                            swipeToClose={false}
                        >
                            <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                                {this.state.showInstalling ?
                                    <Text style={{ color: theme.brandPrimary, textAlign: 'center', marginBottom: 15, fontSize: 15 }}>
                                        Installing update...
                                    </Text> :
                                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                                        <Text style={{ color: theme.brandPrimary, textAlign: 'center', marginBottom: 15, fontSize: 15 }}>
                                            Downloading update... {`${parseInt(this.state.downloadProgress, 10)} %`}
                                        </Text>
                                        <ProgressBar color="theme.brandPrimary" progress={parseInt(this.state.downloadProgress, 10)} />
                                    </View>
                                }
                            </View>
                        </Modal>
                    </Content>
                </Container>
            );
        }

        return <AppNavigator />;
    }
}

export default App;
