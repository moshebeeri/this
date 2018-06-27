import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import * as cardAction from "../../../actions/cardAction";
import * as businessAction from "../../../actions/business";
import {bindActionCreators} from "redux";
const noPic = require('../../../../images/client_1.png');
import styles from './styles'
import {
    FormHeader,
    ImageController,
    ImagePicker,
    SimplePicker,
    Spinner,
    SubmitButton,
    TextInput,
    ThisText
} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import {Button} from 'native-base';
import StyleUtils from "../../../utils/styleUtils";
import CardItem from '../list-item/index'
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const cardPolicy = [
    {
        value: 'OPEN',
        label: strings.CardOpen
    },
    {
        value: 'INVITE',
        label: strings.CardInvite
    }
];

class AddMemberCard extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        const businessId = this.getBusinessId(props.navigation);
        let businessCard = props.cards[businessId];
        if (businessCard) {
            let picture = undefined;
            if (businessCard.pictures.length > 0 && businessCard.pictures[businessCard.pictures.length - 1].pictures[1]) {
                picture = businessCard.pictures[businessCard.pictures.length - 1].pictures[1]
            }
            this.state = {
                min_points: businessCard.points.min_points,
                coverImage: picture ? {path: picture} : undefined,
                points_ratio: businessCard.points.points_ratio,
                accumulate_ratio: businessCard.points.accumulate_ratio,
                add_policy: businessCard.add_policy
            };
        } else {
            this.state = {
                min_points: '',
                coverImage: undefined,
                points_ratio: '',
                accumulate_ratio: '',
            };
        }
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.resetForm();
    }

    replaceRoute(route) {
        this.props.navigation.goBack();
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

    saveFormData() {
        const {navigation, actions, saving} = this.props;
        if (saving) {
            return
        }
        Keyboard.dismiss();
        const card = this.createCard();
        if (this.validateForm()) {
            const businessId = this.getBusinessId(navigation);
            actions.saveCard(card, businessId, navigation)
        }
    }

    updateFormData() {
        const {navigation, actions, saving} = this.props;
        if (saving) {
            return
        }
        Keyboard.dismiss();
        const card = this.createCard();
        if (this.validateForm()) {
            const businessId = this.getBusinessId(navigation);
            actions.updateCard(card, businessId, navigation)
        }
    }

    createCard() {
        const {navigation, cards} = this.props;
        const businessId = this.getBusinessId(navigation);
        let card = {
            coverImage: this.state.coverImage,
            entity: {business: businessId},
            points: {
                min_points: 0,
                points_ratio: 1,
                accumulate_ratio: 100,
            },
            add_policy: this.state.add_policy
        };
        let businessCard = cards[businessId];
        if (businessCard) {
            card._id = businessCard._id;
            card.pictures = businessCard.pictures;
        }
        return card;
    }

    getBusinessId(navigation) {
        if (navigation.state.params.item) {
            return navigation.state.params.item.business
        }
        return navigation.state.params.business._id;
    }

    searchUser() {
        const {actions} = this.props;
        actions.searchUser(this.state.searchString);
    }

    createSearchUser() {
        const {searchUser,showUserAlreadyInvitedMessage} = this.props;
        if (this.state.add_policy === 'INVITE') {
            return <View style={{alignItems:'center',justifyContent:'center'}} >
                <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.InviteUser} value={this.state.searchString}
                               returnKeyType='done' ref="1" refNext="1"
                               onSubmitEditing={this.searchUser.bind(this)}
                               onChangeText={(searchString) => this.setState({searchString})}/>


                    <Button style={{position: 'absolute', right: 5, top: StyleUtils.scale(25)}} large transparent
                            onPress={() => this.searchUser()}>
                        <Icon2 size={StyleUtils.scale(40)} style={styles.productIcon} name="search"/>

                    </Button>


                </View>
                {showUserAlreadyInvitedMessage && <ThisText style={{marginTop:StyleUtils.scale(8),marginBottom:StyleUtils.scale(8), color:'red'}}>{strings.UserAlreadyInvited}</ThisText>}

                {searchUser && <Spinner/>}
                {this.createUserView()}
            </View>
        }
        return <View></View>
    }

    createUserPic(user) {
        if (user.pictures && user.pictures.length > 0) {
            const path = user.pictures[user.pictures.length - 1].pictures[0];
            return <ImageController thumbnail size={StyleUtils.scale(50)} source={{uri: path}}/>
        }
        return <ImageController thumbnail size={StyleUtils.scale(50)} source={noPic}/>;
    }

    createSelectTag(item) {
        return <SubmitButton color={'#FA8559'} title={strings.Invite.toUpperCase()} onPress={this.inviteUser.bind(this,item)}/>
    }

    inviteUser(user) {
        const {cards, actions, navigation} = this.props;
        const businessId = this.getBusinessId(navigation);
        let businessCard = cards[businessId];
        if(!businessCard){
            businessCard = this.createCard();
        }
        actions.inviteUser(user, businessCard);
        this.setState({
            searchString:""
        })
    }

    createUserView() {
        const {users} = this.props;
        if (users && users.length > 0) {
            const usersView = users.map(user => {
                const pic = this.createUserPic(user);
                return <View style={[styles.user_view, {
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: StyleUtils.scale(60),
                    width: StyleUtils.getWidth() - 20
                }]}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        {pic}
                        <ThisText style={{fontSize: StyleUtils.scale(14), margin: 10}}>{user.name}</ThisText>
                    </View>
                    {this.createSelectTag(user)}
                </View>
            })
            return <View>{usersView}</View>
        }
        return <View></View>
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    setCoverImage(image) {
        this.setState({
            coverImage: image
        })
    }

    openMenu() {
        this.refs["coverImage"].openMenu();
    }

    createCoverImageComponnent() {
        const {saving} = this.props;
        const {navigation} = this.props;
        const business = navigation.state.params.business;
        let card = {
            business: business,
            members: 0,
        }
        let cardItem = <CardItem image={this.state.coverImage}  noAction item={card}/>
        return <TouchableOpacity onPress={this.openMenu.bind(this)}
                                 style={[styles.product_upper_container, {width: StyleUtils.getWidth()}]}>
            {saving && <Spinner/>}
            <View style={styles.cmeraLogoContainer}>

                <View style={styles.addCoverNoImageContainer}>
                    <ImagePicker ref={"coverImage"}
                                 image={cardItem}
                                 text={<ThisText style={styles.addCoverText}>{strings.AddACoverPhoto}</ThisText>}
                                 customStyles={{
                                     triggerWrapper: {
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         width: StyleUtils.relativeHeight(30, 50),
                                         height: StyleUtils.scale(220)
                                     }
                                 }} logo mandatory color='white' pickFromCamera
                                 setImage={this.setCoverImage.bind(this)}/>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior={'position'}
                                      style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
                    {this.createView()}
                </KeyboardAvoidingView>
            );
        }
        return (
            <View style={[styles.product_container, {width: StyleUtils.getWidth()}]}>
                {this.createView()}
            </View>
        );
    }

    async selectCardPolicy(value) {
        if(value === strings.CardInvite){
            this.setState({
                add_policy: 'INVITE'
            })
            return;
        }
        if(value === strings.CardOpen){
            this.setState({
                add_policy: 'OPEN'
            })
            return;
        }
        this.setState({
            add_policy: value
        })
    }

    getPolicy(code) {
        if (code === 'OPEN') {
            return strings.CardOpen;
        }
        if (code === 'INVITE') {
            return strings.CardInvite;
        }
        return undefined;
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    createView() {
        const {cards, navigation,showUserAlreadyInvitedMessage} = this.props;
        const businessId = this.getBusinessId(navigation);
        const businessCard = cards[businessId];
        let addPolicyValue = this.state.add_policy;
        if (Platform.OS === 'ios') {
            addPolicyValue = this.getPolicy(this.state.add_policy);
        }
        return <View>
            {businessCard ?
                <FormHeader showBack submitForm={this.updateFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/> :
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/>}
            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }} style={styles.contentContainer}>

                {this.createCoverImageComponnent()}

                <SimplePicker ref="cardPolicy" value={addPolicyValue} selectedValue={addPolicyValue}
                              list={cardPolicy} itemTitle={strings.CardPolicy}
                              defaultHeader={strings.ChooseType}
                              isMandatory
                              onValueSelected={this.selectCardPolicy.bind(this)}/>
                {this.createSearchUser()}

            </ScrollView>
        </View>;
    }

    shouldComponentUpdate() {
        return this.props.currentScreen === 'AddMemberCard';
    }
}

export default connect(
    state => ({
        cards: state.businesses.businessesCard,
        searchUser: state.memberCards.searchUser,
        showUserAlreadyInvitedMessage: state.memberCards.showUserAlreadyInvitedMessage,
        users: state.memberCards.users,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(cardAction, dispatch),
        businessAction: bindActionCreators(businessAction, dispatch),
    })
)(AddMemberCard);

