import React, {Component} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Tab,
    TabHeading,
    Tabs,
    Thumbnail,
    Title,
    View
} from 'native-base';
import styles from './styles'
import Promotions from '../../promtions/index'
import Products from '../../product/index'
import {BusinessHeader, EditButton, ImageController, SocialState, ThisText} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import StyleUtils from '../../../utils/styleUtils'
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const {width, height} = Dimensions.get('window');
const vh = height / 100;
export default class BusinessListView extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {item, actions} = this.props;
        if (!item.categoryTitle) {
            actions.updateBusinesCategory(item)
        }
    }

    showBusiness(p) {
        const {item, navigation, actions} = this.props;
        actions.resetForm();
        navigation.navigate("addBusiness", {item: item.business, updating: true});
    }

    showUsersRoles() {
        const {item, navigation} = this.props;
        navigation.navigate("userPermittedRoles", {business: item.business});
    }

    showProducts() {
        const {item, navigation} = this.props;
        navigation.navigate("Products", {business: item.business});
    }

    showPromotions() {
        const {item, navigation} = this.props;
        navigation.navigate("Promotions", {business: item.business});
    }

    refreshBusiness() {
        const {actions} = this.props;
        actions.updateBusinesStatuss();
    }

    createView() {
        const {item, index} = this.props;
        const banner = this.createBannerTag(item);
        const editButton = this.createEditTag(item);
        const promotionButton = this.createPromotionsTag(item);
        const permissionsButton = this.createPermissionsTag(item);
        const productsButton = this.createPoductsTag(item);
        const inReview =  item.business.review && (item.business.review.state === 'validation' || item.business.review.state === 'review');
        return ( <View style={{marginBottom: 10}}>
                <BusinessHeader businesscolor navigation={this.props.navigation} business={item.business}
                                categoryTitle={item.categoryTitle} businessLogo={item.business.logo}
                                businessName={item.business.name} noMargin businessView
                                editButton={editButton}/>


                <View key={index} style={{marginTop: 1, backgroundColor: '#eaeaea'}}>
                    <View style={{
                        flex: -1,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {banner}
                        </View>
                    </View>

                    <View style={{borderTopWidth: 2, borderColor: '#eaeaea', backgroundColor: 'white'}}
                          key={this.props.index}>
                        {!inReview && (permissionsButton || productsButton || promotionButton) && <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            {permissionsButton}
                            {productsButton}
                            {promotionButton}

                        </View>}
                        {item.business && item.business.review && item.business.review.state === 'validation' &&
                        <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', marginRight: 10, marginLeft: 10,
                        }}>
                            <ThisText>{strings.confirmBusinessByMailMessage}</ThisText>
                            <EditButton iconName='refresh' onPress={this.refreshBusiness.bind(this)}/>
                        </View>}
                        {item.business && item.business.review && item.business.review.state === 'review' &&
                        <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', marginRight: 10, marginLeft: 10,
                        }}>
                            <ThisText>{strings.validatingBusinessMessage}</ThisText>
                            <EditButton iconName='refresh' onPress={this.refreshBusiness.bind(this)}/>
                        </View>}

                        {item.business.social_state &&
                        <View style={{borderTopWidth: 1, borderColor: '#cccccc'}}>
                            <SocialState disabled
                                         like={item.business.social_state.like} likes={item.business.social_state.likes}
                                         showFollowers
                                         followers={item.business.social_state.followers}
                                         share={item.business.social_state.share}
                                         shares={item.business.social_state.shares}

                            />
                        </View>}

                    </View>
                </View>
            </View>
        );
    }

    createEditTag(item) {
        if (item.role === 'OWNS' || (item.business && item.business.review && item.business.review.status === 'waiting')) {
            return <EditButton touchSize={40} onPress={this.showBusiness.bind(this, this.props, item)}/>
        }
        return undefined;
    }

    createBannerTag(item) {
        if (item.business.pictures && item.business.pictures.length > 0) {
            let picLength = item.business.pictures.length;
            return <View style={{}}><ImageController
                style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]} resizeMode="cover"
                source={{uri: item.business.pictures[picLength - 1].pictures[0]}}>

            </ImageController>

            </View>
        }
        return <ImageController
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </ImageController>
    }

    createPermissionsTag(item) {
        if (this.checkPermission(item)) {
            return <TouchableOpacity onPress={() => this.showUsersRoles()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}}
                                     regular>
                <Feather size={25} color={'#ff6400'}
                         name="user-check"/>
                <ThisText style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Permissions}</ThisText>

            </TouchableOpacity>
        }
        return undefined;
    }

    createPoductsTag(item) {
        if (this.checkPermission(item)) {
            return <TouchableOpacity onPress={() => this.showProducts()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}} regular>

                <FontAwesome size={25} color={'#ff6400'}
                             name="barcode"/>
                <ThisText style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Products}</ThisText>

            </TouchableOpacity>
        }
        return undefined;
    }

    checkPermission(item) {
        const {user} = this.props;
        if (item.role === 'OWNS' || item.role === 'Admin' || item.role === 'Manager') {
            return true
        }
        if (item.business) {
            if (item.business.creator && item.business.creator._id === user._id) {
                if (item.business.review.state !== 'validation' && item.business.review.state !== 'review') {
                    return true;
                }
            }
        }
        return false;
    }

    createPromotionsTag(item) {
        if (this.checkPermission(item)) {
            return <TouchableOpacity onPress={() => this.showPromotions()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}}
                                     regular>

                <SimpleLineIcons size={25} color={'#ff6400'}
                                 name="tag"/>
                <ThisText style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Promotions}</ThisText>

            </TouchableOpacity>
        }
        return undefined;
    }

    render() {
        return this.createView();
    }
}

