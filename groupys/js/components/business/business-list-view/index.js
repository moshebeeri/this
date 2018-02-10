import React, {Component} from 'react';
import {Dimensions, Image, TouchableOpacity,Text} from 'react-native';
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
import {EditButton,BusinessHeader} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import {CachedImage} from "react-native-img-cache";

const promotions = require('../../../../images/promotion.png');
const products = require('../../../../images/barcode.png');
const {width, height} = Dimensions.get('window');
import StyleUtils from '../../../utils/styleUtils'
const vh = height / 100;

const permissions = require('../../../../images/permissions.png');
export default class BusinessListView extends Component {
    constructor(props) {
        super(props);
    }

    showBusiness(p) {
        const {item, navigation,resetForm} = this.props;
        resetForm();
        navigation.navigate("addBusiness", {item: item.business,updating:true});
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
    refreshBusiness(){
        const{refresh} = this.props;
        refresh();
    }


    createView() {
        const {item, index} = this.props;
        const banner = this.createBannerTag(item);
        const editButton = this.createEditTag(item);
        const promotionButton = this.createPromotionsTag(item);
        const permissionsButton = this.createPermissionsTag(item);
        const productsButton  = this.createPoductsTag(item);
        return ( <View>
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


                        {(permissionsButton || productsButton || promotionButton) &&  <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            {permissionsButton}

                            {productsButton}


                            {promotionButton}

                        </View>}
                        {item.business && item.business.review && item.business.review.state ==='validation' && <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between',marginRight:10,marginLeft:10,
                        }}>


                            <Text>{strings.confirmBusinessByMailMessage}</Text>
                            <EditButton iconName='refresh' onPress={this.refreshBusiness.bind(this)}/>
                        </View>}
                        {item.business && item.business.review && item.business.review.state ==='review' && <View style={{
                            height: vh * 6, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between',marginRight:10,marginLeft:10,
                        }}>


                            <Text>{strings.validatingBusinessMessage}</Text>
                            <EditButton iconName='refresh' onPress={this.refreshBusiness.bind(this)}/>
                        </View>}
                    </View>


                </View>
            </View>
        );
    }

    createEditTag(item) {
        if (item.role === 'OWNS' || (item.business && item.business.review && item.business.review.status ==='waiting')) {
            return <EditButton onPress={this.showBusiness.bind(this, this.props, item)}/>
        }
        return undefined;
    }

    createBannerTag(item) {
        if (item.business.pictures && item.business.pictures.length > 0) {
            let picLength = item.business.pictures.length;
            return <View style={{}}><CachedImage  style={[styles.bannerImageContainer, {width: StyleUtils.getWidth()}]}  resizeMode="cover"
                                           source={{uri: item.business.pictures[picLength -1].pictures[0]}}>

            </CachedImage>

            </View>
        }
        return <CachedImage
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </CachedImage>
    }

    createPermissionsTag(item) {
        if (this.checkPermission(item)) {
            return <TouchableOpacity onPress={() => this.showUsersRoles()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}}
                                     regular>
                <CachedImage style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 4, height: vh * 4}}
                       source={permissions}/>

                <Text style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Permissions}</Text>

            </TouchableOpacity>
        }
        return undefined;
    }


    createPoductsTag(item) {
        if (this.checkPermission(item)) {
            return  <TouchableOpacity onPress={() => this.showProducts()}
                                      style={{margin: 3, flexDirection: 'row', alignItems: 'center',}} regular>
                <CachedImage style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 3, height: vh * 4}}
                       source={products}/>

                <Text style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Products}</Text>

            </TouchableOpacity>
        }
        return undefined;
    }

    checkPermission(item){
        const{user} = this.props;
        if (item.role === 'OWNS' || item.role === 'Admin' || item.role === 'Manager' ) {
            return true
        }

        if(item.business){
            if(item.business.creator  && item.business.creator._id === user._id){
                if(item.business.review.state !=='validation'  && item.business.review.state !=='review' ) {
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
                <CachedImage style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 4, height: vh * 4}}
                       source={promotions}/>

                <Text style={{
                    marginLeft: 5,
                    color: '#ff6400',
                    fontStyle: 'normal',
                    fontSize: 13
                }}>{strings.Promotions}</Text>

            </TouchableOpacity>
        }
        return undefined;
    }

    render() {
        return this.createView();
    }
}

