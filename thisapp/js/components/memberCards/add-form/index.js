import React, {Component} from 'react';
import {Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Button, Container, Content, Footer, Header, Icon, Input, InputGroup, Item, Picker, View} from 'native-base';
import * as cardAction from "../../../actions/cardAction";
import * as businessAction from "../../../actions/business";
import {bindActionCreators} from "redux";
import styles from './styles'
import {FormHeader, ImagePicker, SimplePicker, Spinner, TextInput, ThisText} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";
import FormUtils from "../../../utils/fromUtils";
import CardItem from '../list-item/index'

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
        // const {navigation, actions, saving} = this.props;
        // if (saving) {
        //     return
        // }
        // Keyboard.dismiss();
        // const card = this.createCard();
        // if (this.validateForm()) {
        //     const businessId = this.getBusinessId(navigation);
        //     actions.updateProduct(card, businessId, navigation)
        // }
    }

    createCard() {
        const {navigation} = this.props;
        const businessId = this.getBusinessId(navigation);
        let card = {
            coverImage: this.state.coverImage,
            entity: {business: businessId},
            points: {
                min_points: this.state.min_points,
                points_ratio: this.state.points_ratio,
                accumulate_ratio: this.state.accumulate_ratio,
            },
            add_policy: this.state.add_policy
        };
        if (this.state.item) {
            card._id = this.state.item._id;
        }
        return card;
    }

    getBusinessId(navigation) {
        if (navigation.state.params.item) {
            return navigation.state.params.item.business
        }
        return navigation.state.params.business._id;
    }

    focusNextField(nextField) {
        if (this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }

    handleCode(code) {
        this.setState({barcode: code.data})
    }

    setCategory(categories) {
        this.setState({categories: categories});
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
            points: 0,
            members: 1,
        }
        let cardItem = <CardItem image={this.state.coverImage} showStats noAction item={card}/>
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
                                         width: StyleUtils.relativeHeight(30, 30),
                                         height: StyleUtils.relativeHeight(30, 30),
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
        this.setState({
            add_policy: value
        })
    }

    createView() {
        return <View>
            {this.state.item ?
                <FormHeader showBack submitForm={this.updateFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/> :
                <FormHeader showBack submitForm={this.saveFormData.bind(this)} navigation={this.props.navigation}
                            title={strings.MemberCard} bgc="#FA8559"/>}
            <ScrollView keyboardShouldPersistTaps={true} contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
            }} style={styles.contentContainer}>

                {this.createCoverImageComponnent()}

                <SimplePicker ref="cardPolicy"
                              list={cardPolicy} itemTitle={strings.CardPolicy}
                              defaultHeader={strings.ChooseType}
                              isMandatory
                              onValueSelected={this.selectCardPolicy.bind(this)}/>

                <View style={styles.inputTextLayout}>

                    <TextInput field={strings.MinPointsTerm} value={this.state.min_points}
                               returnKeyType='next' ref="min_points" refNext="points_ratio"
                               keyboardType='numeric'
                               validateContent={FormUtils.validateNumberic}
                               onChangeText={(min_points) => this.setState({min_points})}
                               isMandatory={true}/>
                </View>
                <View style={[styles.inputTextLayout, {flexDirection: 'column', width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.PointsRatio} value={this.state.points_ratio}
                               returnKeyType='next' ref="points_ratio" refNext="accumulate_ratio"
                               keyboardType='numeric'
                               validateContent={FormUtils.validateNumberic}
                               placeholder={strings.PointsRatioExample}
                               onChangeText={(points_ratio) => this.setState({points_ratio})}
                               isMandatory={true}/>

                </View>
                <View style={[styles.inputTextLayout, {flexDirection: 'column', width: StyleUtils.getWidth() - 15}]}>

                    <TextInput field={strings.PointsAccumulationRatio} value={this.state.accumulate_ratio}
                               returnKeyType='done' ref="accumulate_ratio" refNext="retail"
                               keyboardType='numeric'
                               validateContent={FormUtils.validatePercent}
                               placeholder={strings.PointsAccumulationExample}
                               onChangeText={(accumulate_ratio) => this.setState({accumulate_ratio})}
                               isMandatory={true}/>

                </View>


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
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(cardAction, dispatch),
        businessAction: bindActionCreators(businessAction, dispatch),
    })
)(AddMemberCard);

