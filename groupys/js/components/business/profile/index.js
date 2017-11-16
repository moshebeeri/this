import React, {Component} from 'react';
import {Dimensions, Image, View} from 'react-native';
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
} from 'native-base';
import styles from './styles'
import {FormHeader, TextInput} from '../../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
const premissions = require('../../../../images/permissions.png');
export default class BusinessProfile extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
    }

    createBusinessLogo(selectedBusiness) {
        if (selectedBusiness && selectedBusiness.logo) {
            return <Thumbnail medium square source={{uri: selectedBusiness.logo}}/>
        }
        if (selectedBusiness && selectedBusiness.businessLogo) {
            return <Thumbnail medium square source={{uri: selectedBusiness.businessLogo}}/>
        }
        return <Thumbnail source={require('../../../../images/client_1.png')}/>
    }

    render() {
        let business = this.props.navigation.state.params.bussiness;
        let address = business.city + ' ' + business.address
        const banner = this.createBannerTag(business);
        return ( <View>

                <FormHeader showBack navigation={this.props.navigation}
                            title={"Business"} bgc="#2db6c8"/>

                <View style={styles.businessPiker}>
                    <View style={styles.businessTopLogo}>
                        {this.createBusinessLogo(business)}
                    </View>
                    <View style={styles.businessPikkerComponent}>
                        <Text style={styles.businessNameText}>{business.name}</Text>
                        <Text style={styles.businessCategoryText}>{business.categoryTitle}.</Text>
                    </View>

                </View>
                <View style={{marginTop: 1, backgroundColor: '#eaeaea'}}>
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


                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>

                       <View style={styles.inputFullTextLayour}>
                            <TextInput placeholder={'No Website'} field='Website' value={business.website} disabled


                            />
                        </View>
                        <View style={styles.inputFullTextLayour}>
                            <TextInput placeholder={'No Email'} field='Email' value={business.email} disabled

                            />
                        </View>


                    <View style={styles.inputFullTextLayour}>
                        <TextInput field='Address' value={address} disabled

                        />
                    </View>
                </View>
            </View>
        );
    }

    createBannerTag(business) {
        if (business.pictures) {
            return <View style={{}}><Image style={styles.bannerImageContainer} resizeMode="cover"
                                           source={{uri: business.pictures[0].pictures[0]}}>

            </Image>

            </View>
        }
        if (business.banner) {
            return <View style={{}}><Image style={styles.bannerImageContainer} resizeMode="cover"
                                           source={business.banner}>

            </Image>

            </View>
        }
        return <Image
            style={{padding: 0, flex: -1, height: 300}}
            source={require('../../../../images/client_1.png')}>
        </Image>
    }
}

