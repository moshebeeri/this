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

import ModalDropdown from 'react-native-modal-dropdown';
import login from './add-business-theme';
import styles from './styles';
import HeaderContent from '.././../homeHeader';

var createEntity = require("../../../utils/createEntity");
import ImagePicker from 'react-native-image-crop-picker';
import store from 'react-native-simple-store';
const {
    replaceAt,
} = actions;


class AddBusiness extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            address:'',
            email:'',
            website:'',
            country:'',
            city:'',
            state:'',
            path:'',
            image:'',
            type:'',
            images:'',
            tax_id:'',
            formID:'12345',
            userId:'',
            token:'',
            formData:{}
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
        this.props.replaceAt('add-business', {key: route}, this.props.navigation.key);
    }



    readQc(code){

    }

    selectType(index, value){
        this.setState({
            type:value
        })


    }


    saveFormData(){


        createEntity('businesses',this.state,this.state.token,this.formSuccess.bind(this),this.formFailed.bind(this),this.state.userId);
    }

    formSuccess(response){
        store.save("b-id",response._id);
        this.replaceRoute('business');
    }

    formFailed(error){
        console.log('failed');
    }
    pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null,
                path: image.path
            });
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
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

                    <View style={styles.AddContainer}>

                    <View style={{

                        flexDirection: 'column',

                    }}>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Name
                            </Text>
                            <TextInput style={styles.input}
                                       onChangeText={(name) => this.setState({name})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Email
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(email) => this.setState({email})}

                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Address
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(address) => this.setState({address})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Website
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(website) => this.setState({website})}

                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Country
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(country) => this.setState({country})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                City
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(city) => this.setState({city})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                State
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(state) => this.setState({state})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Tax id
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(tax_id) => this.setState({tax_id})}

                            />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Type
                            </Text>
                            <ModalDropdown
                                options={['PERSONAL_SERVICES', 'SMALL_BUSINESS', 'COMPANY', 'ENTERPRISE']}
                                onSelect={this.selectType.bind(this)}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.titleText}>
                                Image
                            </Text>

                            <Button   style={styles.attachButton} onPress={() => this.pickSingle(true)}>
                                <Icon style={styles.attachButton} name="ios-attach" />

                            </Button>

                            <Image
                                style={{width: 50, height: 50}}
                                source={{uri: this.state.path}}
                            />
                        </View>
                        <View style={styles.row}>

                            <Button style={styles.login}
                                    onPress={this.saveFormData.bind(this)}
                            >
                                <Text>Save</Text>
                            </Button>
                        </View>
                    </View>
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

export default connect(mapStateToProps, bindActions)(AddBusiness);
