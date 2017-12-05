import React, {Component} from "react";
import {Image, TouchableOpacity,Dimensions} from "react-native";
import {Button, Input, Item, Spinner, Text, View} from "native-base";
import Camera from "react-native-camera";
import styles from "./styles";
import {BusinessHeader,SubmitButton} from '../../ui/index';
const {width, height} = Dimensions.get('window')
import FeedPromotion from '../../components/generic-feed-manager/generic-feed/feed-components/feedPromotion'
import strings from "../../i18n/i18n"
export default class BusinessFollow extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {navigation, code, cameraOn, searching, business, instance, group, followBusiness, groupFollowBusiness, scanResult, realizePromotion} = this.props;
        let followComponent = undefined;
        if (business) {
            let followStyle = {
                flex: -1,
                justifyContent: 'center',
                marginLeft: 20,
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                width: 200,
                backgroundColor: '#e65100',
            };
            followComponent =   <View>
                    <SubmitButton color={'#2db6c8'} title={strings.Follow.toUpperCase()} onPress={() => followBusiness(business._id, navigation)}/>
                </View>

            if (group) {
                followComponent =
                    <View>
                        <SubmitButton color={'#2db6c8'} title={strings.Follow.toUpperCase()} onPress={() => groupFollowBusiness(group._id, business._id, navigation)}/>
                    </View>

            }
        }
        return ( <View style={styles.follow_container}>

                {cameraOn && <View style={styles.payment_camera_container}><Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    onBarCodeRead={scanResult}
                    style={styles.payment_camera}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
                    <Text>Please Scan Code</Text>
                </View>}
                {searching && <View><Spinner color='red'/></View>}
                {business && <View style={{

                    padding: 5,
                    backgroundColor: 'white',


                }}>
                    <View >
                        <BusinessHeader navigation={navigation} business={business}
                                        businessLogo={business.logo}
                                        businessName={business.name}/>
                    </View>

                    <View
                        style={{width:width, flexDirection: 'row',  justifyContent:'center',alignItems: 'center',}}>
                        {followComponent}
                    </View>


                </View>}
                {instance &&
                <View style={{flex:1,  }}>
                    <View style={{flex:3,  }}>
                    <FeedPromotion  refresh={this.refresh.bind(this)}

                                   navigation={navigation} item={instance}

                    />
                    </View>
                    <View style={{flex:1, alignItems:'center' }}>
                        <View>
                        <SubmitButton color={'#2db6c8'} title={strings.Confirm.toUpperCase()} onPress={() => realizePromotion(code)}/>
                        </View>
                    </View>
                </View>
                }

            </View>
        );
    }
    refresh(){}


    render() {
        return this.createView();
    }
}

