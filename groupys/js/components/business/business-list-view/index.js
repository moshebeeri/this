import React, {Component} from 'react';
import {Dimensions, Image, TouchableOpacity,Animated} from 'react-native';
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
const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT- HEADER_MIN_HEIGHT;


export default class BusinessListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }

    showBusiness(p) {
        const {item, navigation} = this.props;
        navigation.navigate("addBusiness", {item: item.business});
    }


    showUsersRoles() {
        const {item, navigation} = this.props;
        navigation.navigate("userPermittedRoles", {business: item.business});
    }

    onChangeTab(tab) {
    }

    createView() {
        const {item, index} = this.props;
        const banner = this.createBannerTag(item);
        const editButton = this.createEditTag(item);
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        let selectedTab = 0;
        return ( <View key={index} style={{marginTop: 1, width: width, height: height, backgroundColor: '#eaeaea'}}>
                <Animated.View style={{
                    flex: -1,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    height: headerHeight

                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {banner}


                    </View>
                    <View style={{flex: -1, flexDirection: 'row', alignItems: 'center',}}>
                        {editButton}
                    </View>

                </Animated.View>


                <Tabs tabBarUnderlineStyle={{backgroundColor: '#ff6400'}}
                      onChangeTab={this.onChangeTab.bind(this)} style={{backgroundColor: '#fff',}}>
                    <Tab heading={<TabHeading style={{backgroundColor: "white"}}>
                        <View style={styles.tabHeadingStyle}>
                            <Image
                                style={{tintColor: '#ff6400', marginLeft: 0, width: 20, height: 20}}
                                source={promotions}/>
                            <Text style={styles.tabTextStyle}>Promotions</Text>
                        </View>
                    </TabHeading>}>

                        <Promotions  navigation={this.props.navigation} business={item.business}></Promotions>
                    </Tab>
                    <Tab heading={<TabHeading style={{backgroundColor: "white"}}>
                        <View style={styles.tabHeadingStyle}>
                            <Image
                                style={{tintColor: '#ff6400', marginLeft: 0, width: 20, height: 20}}
                                source={products}/>
                            <Text style={styles.tabTextStyle}>Products</Text>
                        </View>
                    </TabHeading>}>
                        <Products navigation={this.props.navigation} business={item.business}></Products>
                    </Tab>

                    <Tab
                        heading={<TabHeading style={{backgroundColor: "white"}}>
                            <View style={styles.tabHeadingStyle}>
                                <Image
                                    style={{tintColor: '#ff6400', marginLeft: 0, width: 20, height: 20}}
                                    source={premissions}/>
                                <Text style={styles.tabTextStyle}>Permissions</Text>
                            </View>
                        </TabHeading>}>
                        <View>
                            <PremitedUsers navigation={this.props.navigation} business={item.business}/>
                        </View>
                    </Tab>


                </Tabs>


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

    render() {
        return this.createView();
    }
}

