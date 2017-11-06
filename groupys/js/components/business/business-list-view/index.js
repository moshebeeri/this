import React, {Component} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
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
    Text,
    Thumbnail,
    Title,
    View
} from 'native-base';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './styles'
import Promotions from '../../promtions/index'
import Products from '../../product/index'
import PremitedUsers from '../../premitedUsers/index'


const covefr = require('../../../../images/cover2.png');
const promotions = require('../../../../images/promotion.png');
const products = require('../../../../images/barcode.png');
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
const premissions = require('../../../../images/permissions.png');
export default class BusinessListView extends Component {
    constructor(props) {
        super(props);
    }

    showBusiness(p) {
        const {item, navigation} = this.props;
        navigation.navigate("addBusiness", {item: item.business});
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

    onChangeTab(tab) {
    }

    createView() {
        const {item, index} = this.props;
        const banner = this.createBannerTag(item);
        const editButton = this.createEditTag(item);
        const promotionButton = this.createPromotionsTag(item);
        const premissionsButton = this.createPremissionsTag(item);
        return ( <View key={index} style={{marginTop: 1, width: width, height: height, backgroundColor: '#eaeaea'}}>
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
                    <View style={{flex: -1, flexDirection: 'row', alignItems: 'center',}}>
                        {editButton}
                    </View>

                </View>

                <View style={{borderTopWidth: 2, borderColor: '#eaeaea', backgroundColor: 'white'}}
                      key={this.props.index}>


                    <View style={{
                        height: vh * 6, flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        {premissionsButton}


                        <TouchableOpacity onPress={() => this.showProducts()}
                                          style={{margin: 3, flexDirection: 'row', alignItems: 'center',}} regular>
                            <Image style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 3, height: vh * 4}}
                                   source={products}/>

                            <Text style={{
                                marginLeft: 5,
                                color: 'black',
                                fontStyle: 'normal',
                                fontSize: 13
                            }}>Products </Text>

                        </TouchableOpacity>

                        {promotionButton}


                    </View>
                </View>


            </View>
        );
    }



    createEditTag(item) {
        if (item.role == 'OWNS') {
            return <Button small style={{backgroundColor: 'white', height: 50, width: 60, marginLeft: 10}}
                           onPress={this.showBusiness.bind(this, this.props, item)}>
                <Icon2 size={20} style={styles.productIcon} name="edit"/>


            </Button>
        }
        return undefined;
    }

    createBannerTag(item) {
        if (item.business.pictures && item.business.pictures.length > 0) {
            return <View style={{}}><Image style={styles.bannerImageContainer} resizeMode="cover"
                                           source={{uri: item.business.pictures[0].pictures[0]}}>
                <TouchableOpacity style={styles.editButtonConntainer}
                                  onPress={this.showBusiness.bind(this, this.props, item)}>
                    <Icon2 size={20} style={styles.productIcon} name="edit"/>
                </TouchableOpacity>
            </Image>

            </View>
        }
        return <Image
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </Image>
    }

    createPremissionsTag(item) {
        if (item.role == 'OWNS' || item.role == 'Admin' || item.role == 'Manager') {
            return <TouchableOpacity onPress={() => this.showUsersRoles()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}}
                                     regular>
                <Image style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 4, height: vh * 4}}
                       source={premissions}/>

                <Text style={{marginLeft: 5, color: 'black', fontStyle: 'normal', fontSize: 13}}>Permissions </Text>

            </TouchableOpacity>
        }
        return undefined;
    }

    createPromotionsTag(item) {
        if (item.role == 'OWNS' || item.role == 'Admin' || item.role == 'Manager') {
            return <TouchableOpacity onPress={() => this.showPromotions()}
                                     style={{margin: 3, flexDirection: 'row', alignItems: 'center',}}
                                     regular>
                <Image style={{tintColor: '#ff6400', marginLeft: 10, width: vh * 4, height: vh * 4}}
                       source={promotions}/>

                <Text style={{marginLeft: 5, color: 'black', fontStyle: 'normal', fontSize: 13}}>Promotions </Text>

            </TouchableOpacity>
        }
        return undefined;
    }
    render() {
        return this.createView();
    }
}

