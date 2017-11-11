import React, {Component} from 'react';
import {Image, Platform,View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    Fab,
    InputGroup,
    Input,
    Thumbnail,
    Button,
    Picker,
    Right,
    Item,
    Left,
    Header,
    Footer,
    Body,

    Card,
    CardItem
} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import styles from './styles'
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import * as userAction from "../../actions/user";
import {CategoryPicker, FormHeader, ImagePicker, TextInput,Spinner} from '../../ui/index';

const noPic = require('../../../images/client_1.png');



class UserProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone_number: '',
            email: '',
            image: '',
            path: '',
            token: ''
        }

    }

    async componentWillMount() {
        if (this.props.user.user && this.props.user.user.pictures && this.props.user.user.pictures.length > 0) {
            this.setState({
                path: this.props.user.user.pictures[this.props.user.user.pictures.length - 1].pictures[0],
            })
        }
        this.setState({
            name: this.props.user.user.name,
            phone_number: this.props.user.user.phone_number,
        })
    }
    validateForm() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    save() {
        if(this.validateForm()) {
            let user = {
                name: this.state.name,
                _id: this.props.user.user._id,
                image: this.state.image,
                phone_number: this.state.phone_number
            }
            this.props.updateUser(user, this.props.navigation)
        }
    }

    setImage(image){
        this.setState({image:image});
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    render() {
        let image = <Image style={{
                flex: 1,
                width: 50,
                height: 50,

                resizeMode: 'contain'
            }} source={noPic}/>

        if (this.state.path) {
            image = <Image style={{
                alignSelf: 'center',
                height: 100,
                width: 100,
                borderRadius:70,
            }} resizeMode="cover" source={{uri: this.state.path}}>
            </Image>
        }


        if(this.state.image){
            image = this.state.image ;
        }


        return (

            <View style={styles.settingsContainer}>
                <FormHeader showBack submitForm={this.save.bind(this)} navigation={this.props.navigation}
                            title={"User Settings"} bgc="#FA8559"/>

                <View style={styles.thumbnail}>

                    <ImagePicker imageWidth={3000} imageHeight={3000} image={image} setImage={this.setImage.bind(this)}/>

                </View>
                <View>

                    <View style={styles.inputTextLayour}>
                        <TextInput field='User Name' value={this.state.name}
                                   returnKeyType='done' ref="1" refNext="1"

                                   onChangeText={(name) => this.setState({name})} />
                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput field='User Phone' value={this.state.phone_number} disabled
                                   returnKeyType='done' ref="2" refNext="2"
                                   onChangeText={(phone_number) => this.setState({phone_number})} />
                    </View>
                    {this.props.saving && <Spinner/>}
                </View>
            </View>

        );
    }
}

export default connect(
    state => ({
        user: state.user,
        saving:state.user.saving
    }),
    dispatch => bindActionCreators(userAction, dispatch)
)(UserProfile);


