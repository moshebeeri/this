import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, Switch, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles'
import {FormHeader, ImagePicker, SimplePicker, Spinner, TextInput, ThisText, Video} from '../../ui/index';
import * as postAction from "../../actions/posts";
import {bindActionCreators} from "redux";
import strings from "../../i18n/i18n"
import FormUtils from "../../utils/fromUtils";
import StyleUtils from "../../utils/styleUtils";
import navigationUtils from '../../utils/navigationUtils';
import {getMyBusinesses} from '../../selectors/businessesSelector'

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
            saving: false,
            toggle: false,
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
        if (this.validateForm() && !this.state.saving) {
            this.setState({saving: true});
            this.setPost();
        }
    }

    selectBusiness(id) {
        this.setState({business: id})
    }

    createBusinessPicker() {
        const {businesses} = this.props;
        if (businesses && businesses.length > 0) {
            const rows = businesses.map((s, i) => {
                return {
                    value: s._id,
                    label: s.name
                }
            });
            return <SimplePicker ref="BusineesList" list={rows} itemTitle="Businees"
                                 defaultHeader={strings.ChooseBusiness} isMandatory
                                 onValueSelected={this.selectBusiness.bind(this)}/>
        }
        return undefined;
    }

    setPost() {
        const {actions, navigation} = this.props;
        const post = this.createPostFromState();
        if (navigation.state.params && navigation.state.params.group) {
            actions.createGroupPost(post, this.props.navigation, navigation.state.params.group);
        } else {
            actions.createPost(post, this.props.navigation,);
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
        let video = this.state.video;
        let picture = this.state.image;
        if (this.state.youTubeUrl && FormUtils.youtube_parser(this.state.youTubeUrl)) {
            video = undefined;
            picture = undefined;
        }
        let clientParametes = {uploading: false}
        if (picture || video) {
            clientParametes = {uploading: true}
        }
        if(this.state.business){
            return {
                text: this.state.post,
                image: picture,
                uploadVideo: video,
                url: this.state.youTubeUrl,
                client: clientParametes,
                behalf: {
                    business: this.state.business
                }
            }
        }
        if (navigation.state.params && navigation.state.params.group) {

            return {
                text: this.state.post,
                image: picture,
                uploadVideo: video,
                url: this.state.youTubeUrl,
                client: clientParametes,
                behalf: {
                    group: navigation.state.params.group
                }
            }
        }
        return {
            text: this.state.post,
            image: this.state.image,
            uploadVideo: this.state.video,
            url: this.state.youTubeUrl,
            client: clientParametes,
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
            navigationUtils.doNavigation(this.props.navigation, 'SelectUsersComponent', {
                users: userFollowers,
                selectUsers: this.selectUsers.bind(this)
            });
        }
    }

    setCoverImage(image) {
        this.setState({image: image});
    }

    setVideo(video) {
        this.setState({video: video});
    }

    toogleSwitch(value) {
        if(this.state.toggle){
            this.setState({business:undefined});
        }
        this.setState({toggle:!this.state.toggle});
    }

    openMenu() {
        this.refs["coverImage"].openMenu();
    }

    createCoverImageComponnent() {
        const {saving} = this.props;
        let item;
        if (this.state.image) {
            item = <Image
                style={{width: width - 10, height: 210, borderWidth: 1, borderColor: 'white'}}
                source={{uri: this.state.image.path}}
            >
            </Image>
        }
        if (this.state.video) {
            item = <Video url={this.state.video.path} muted={false} paused={false}></Video>
        }
        if (this.state.youTubeUrl && FormUtils.youtube_parser(this.state.youTubeUrl)) {
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>
                        <Video videoId={FormUtils.youtube_parser(this.state.youTubeUrl)} source={'YOUTUBE'}
                               url={this.state.youTubeUrl} muted={false} paused={false}></Video>
                    </View>
                    {saving && <Spinner/>}
                </View>
            </View>
        }
        if (item) {
            return <View style={styles.product_upper_container}>

                <View style={styles.cmeraLogoContainer}>

                    <View style={styles.addCoverContainer}>

                        <ImagePicker video name={"coverImage"} ref={"coverImage"} image={item} color='white'
                                     pickFromCamera
                                     setVideo={this.setVideo.bind(this)} setImage={this.setCoverImage.bind(this)}/>
                    </View>
                    {saving && <Spinner/>}
                </View>
            </View>
        }
        return <TouchableOpacity onPress={this.openMenu.bind(this)} style={styles.product_upper_container}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker video ref={"coverImage"} color='white' pickFromCamera
                                 setVideo={this.setVideo.bind(this)} setImage={this.setCoverImage.bind(this)}/>
                    <ThisText style={styles.addCoverText}>{strings.AddPictureOrVideo}</ThisText>
                </View>
            </View>

        </TouchableOpacity>
    }

    render() {
        const{businesses} = this.props;
        return (
            <View style={styles.product_container}>
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.AddPost} bgc="#2db6c8"/>
                <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} style={styles.contentContainer}>


                    {this.createCoverImageComponnent()}
                    {businesses && businesses.length > 0 &&
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row', width: StyleUtils.getWidth()
                    }}>

                        <ThisText style={{
                            color: '#666666',
                            marginLeft: 12,
                            marginRight: 8
                        }}>{strings.BusinessPost}</ThisText>


                        <Switch

                            onTintColor={'#2db6c8'}
                            style={{marginRight: 10,}}
                            onValueChange={this.toogleSwitch.bind(this)}
                            value={this.state.toggle}/>
                    </View>}

                    {this.state.toggle && this.createBusinessPicker()}
                    <View style={styles.inputTextLayour}>
                        <TextInput field={strings.Post} value={this.state.post}
                                   returnKeyType='next' ref="2" refNext="2"
                                   multiline={true}
                                   numberOfLines={4}
                                   textArea={true}
                                   onSubmitEditing={this.focusNextField.bind(this, "3")}
                                   onChangeText={(post) => this.setState({post})} isMandatory={true}/>
                    </View>
                    <View style={styles.inputTextLayour}>
                        <TextInput field={strings.YouTubeUrl} value={this.state.youTubeUrl}
                                   returnKeyType='done' ref="3" refNext="3"
                                   multiline={true}
                                   numberOfLines={10}
                                   validateContent={FormUtils.validateYouTube}
                                   onChangeText={(youTubeUrl) => this.setState({youTubeUrl})} isMandatory={false}/>
                    </View>
                    <View style={{height: StyleUtils.scale(30), width: StyleUtils.getWidth()}}></View>

                </ScrollView>


            </View>
        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'PostForm') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        user: state.user.user,
        saving: state.postForm.saving,
        currentScreen: state.render.currentScreen,
        businesses: getMyBusinesses(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(postAction, dispatch),
    })
)(AddPost);





