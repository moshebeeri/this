import React, {Component} from 'react';
import {BackAndroid, StatusBar, NavigationExperimental} from 'react-native';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer'
import {actions} from 'react-native-navigation-redux-helpers';

import {closeDrawer} from './actions/drawer';

import Login from './components/login/';
import SplashPage from './components/splashscreen/';
import Home from './components/home/';
import Signup from './components/signup/';
import SideBar from './components/sideBar';


import {statusBarColor} from './themes/base-theme';

const {
    popRoute,
} = actions;

const {
    CardStack: NavigationCardStack,
} = NavigationExperimental;

class AppNavigator extends Component {


    static propTypes = {
        drawerState: React.PropTypes.string,
        popRoute: React.PropTypes.func,
        closeDrawer: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
            routes: React.PropTypes.array,
        }),
    };

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            const routes = this.props.navigation.routes;

            if (routes[routes.length - 1].key === 'home' || routes[routes.length - 1].key === 'login') {
                return false;
            }

            this.props.popRoute(this.props.navigation.key);
            return true;
        });
    }

    componentDidUpdate() {
        if (this.props.drawerState === 'opened') {
            this.openDrawer();
        }

        if (this.props.drawerState === 'closed') {
            this._drawer.close();
        }
    }

    popRoute() {
        this.props.popRoute();
    }

    openDrawer() {
        this._drawer.open();
    }

    closeDrawer() {
        if (this.props.drawerState === 'opened') {
            this.props.closeDrawer();
        }
    }

    _renderScene(props) { // eslint-disable-line class-methods-use-this

        switch (props.scene.route.key) {
            case 'splashscreen':
                return <SplashPage />;
            case 'login':
                return <Login />;
            case 'home':
                return <Home />;
            case 'signup':
                return <Signup />;
            default :
                return <Login />;
        }
    }

    drawerStyles = {
        drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 0},
    };

    render() {
        // return (
        //     <Drawer
        //         type="static"
        //         ref={(ref) => { this._drawer = ref; }}
        //         content={<SideBar navigator={this._navigator} />}
        //         openDrawerOffset={100}
        //         styles={this.drawerStyles}
        //         onClose={() => this.closeDrawer()}
        //         tapToClose
        //         acceptPan={false}
        //          >
        //         <StatusBar
        //             backgroundColor={statusBarColor}
        //             barStyle="light-content"
        //         />
        //         <NavigationCardStack
        //             navigationState={this.props.navigation}
        //             renderOverlay={this._renderOverlay}
        //             renderScene={this._renderScene}
        //         />
        //     </Drawer>
        // );

        return (
            <Drawer
                type="static"
                ref={(ref) => { this._drawer = ref; }}
                tweenDuration={250}
                content={<SideBar navigator={this._navigator} />}
                tapToClose
                acceptPan={true}
                onClose={() => this.closeDrawer()}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={this.drawerStyles}
                negotiatePan
                tweenHandler={ratio => ({main: { opacity: (2 - ratio) / 2 },
        })}
            >
                <StatusBar
                    backgroundColor={statusBarColor}
                    barStyle="light-content"
                />
                <NavigationCardStack
                    navigationState={this.props.navigation}
                    renderOverlay={this._renderOverlay}
                    renderScene={this._renderScene}
                />
            </Drawer>
        );
    }
}

function bindAction(dispatch) {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        popRoute: (key) => dispatch(popRoute(key)),
    };
}

const mapStateToProps = state => ({
    drawerState: state.drawer.drawerState,
    navigation: state.cardNavigation,
});


export default connect(mapStateToProps, bindAction)(AppNavigator);
