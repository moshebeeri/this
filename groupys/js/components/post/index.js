import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles'
import {FormHeader, ImagePicker, Spinner, TextInput} from '../../ui/index';
import * as postAction from "../../actions/posts";
import {bindActionCreators} from "redux";
import strings from "../../i18n/i18n"

const {width, height} = Dimensions.get('window')

class AddPost extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            info: null,
            showUsers: false,
            images: '',
            users: [],
            selectedUsers: null,
            groupPolocy: 'OPEN',
            groupType: 'USERS',
            path: '',
            image: '',
            business: '',
            post: '',
            services: []
        };
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.resetForm();
    }

    replaceRoute(route) {
        this.props.navigation.goBack();
    }

    async saveFormData() {
        const {actions,navigation} = this.props;
        if (this.validateForm()) {
            const post = this.createPostFromState();
            if (navigation.state.params && navigation.state.params.group) {
                actions.createGroupPost(post, this.props.navigation,navigation.state.params.group);
            }else {
                actions.createPost(post, this.props.navigation,);
            }
        }
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

    createPostFromState() {
        const {user, navigation} = this.props;
        if (navigation.state.params && navigation.state.params.group) {
            return {
                title: this.state.title,
                text: this.state.post,
                image: this.state.image,
                behalf: {
                    group: navigation.state.params.group
                }
            }
        }
        return {
            title: this.state.title,
            text: this.state.post,
            image: this.state.image,
            behalf: {
                user: user
            }
        };
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    showUsers() {
        const {userFollowers} = this.props;
        if (userFollowers.length > 0) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: userFollowers,
                selectUsers: this.selectUsers.bind(this)
            })
        }
    }

    setCoverImage(image) {
        this.setState({image: image});
    }

    createCoverImageComponnent() {
        const {saving} = this.props;
        if (this.state.image) {
            let coverImage = <Image
                style={{width: width - 10, height: 210, borderWidth: 1, borderColor: 'white'}}
                source={{uri: this.state.image.path}}
            >

            </Image>
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        <ImagePicker ref={"coverImage"} image={coverImage} color='white' pickFromCamera
                                     setImage={this.setCoverImage.bind(this)}/>
                    </View>
                    {saving && <Spinner/>}
                </View>
            </View>
        }
        return <View style={styles.product_upper_container}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"} color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                    <Text style={styles.addCoverText}>{strings.AddPictureOrVideo}</Text>
                </View>
            </View>

        </View>
    }

    render() {
        return (
            <View style={styles.product_container}>
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.AddPost} bgc="#2db6c8"/>
                <ScrollView contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>


                    {this.createCoverImageComponnent()}
                    <View style={styles.inputTextLayour}>
                        <TextInput field={strings.Title} value={this.state.title}
                                   returnKeyType='next' ref="1" refNext="1"
                                   onSubmitEditing={this.focusNextField.bind(this, "2")}
                                   onChangeText={(title) => this.setState({title})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput field={strings.Post} value={this.state.post}
                                   returnKeyType='done' ref="2" refNext="2"
                                   multiline={true}
                                   numberOfLines={4}

                                   onChangeText={(post) => this.setState({post})} isMandatory={false}/>
                    </View>
                </ScrollView>


            </View>
        );
    }
}

export default connect(
    state => ({
        user: state.authentication.user,
        saving: state.postForm.saving
    }),
    (dispatch) => ({
        actions: bindActionCreators(postAction, dispatch),
    })
)(AddPost);




