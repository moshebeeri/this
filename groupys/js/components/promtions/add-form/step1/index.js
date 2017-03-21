import React, {Component} from 'react';
import { Platform,
    AppRegistry,
    NavigatorIOS,
    TextInput,

    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header} from 'native-base';
var fetchBusiness = require("../../../../api/business");

import styles from './styles';
import HeaderContent from '../header/index';



const {
    replaceAt,
} = actions;


class AddPromotionStep1 extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);

        this.state = {
            businessId: undefined,
            path:'',
            image:'',
            services:'',
            business:'',


        };
        let stateFunc = this.setState.bind(this);
        store.get('token').then(storeToken => {
            stateFunc({
                    token: storeToken
                }
            );
        });
        store.get('user_id').then(storeUserId => {
            stateFunc({
                    userId: storeUserId
                }
            );
        });
    }





    replaceRoute(route) {
        this.props.replaceAt('signup', {key: route}, this.props.navigation.key);
    }


    componentWillMount(){
        let callback = this.initBusiness.bind(this);
        store.get('token').then(storeToken => {
            fetchBusiness(storeToken,callback);
        });
    }

    initBusiness(responseData){

        this.setState({
            services: responseData,
            business: responseData[0]._id
        });
    }
    selectBusiness(value){

        this.props.pickBusiness(value,this.state.business)


    }

    render() {
        let pikkerTag = undefined;

        if(this.state.services.length > 0 ){
            pikkerTag = <Picker
                iosHeader="Select Business"
                mode="dropdown"
                selectedValue={this.state.business}
                onValueChange={this.selectBusiness.bind(this)}>

                {


                    this.state.services.map((s, i) => {
                        return <Item
                            key={i}
                            value={s._id}
                            label={s.name} />
                    }) }
            </Picker>

        }

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

                <Content  style={{backgroundColor: '#fff'}}>



                    {pikkerTag}










                </Content>
                <Footer>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Add Promotion</Text>
                    </Button>
                </Footer>
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

export default connect(mapStateToProps, bindActions)(AddPromotionStep1);
