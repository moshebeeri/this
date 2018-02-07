import React, {Component} from "react";
import {Image, TouchableOpacity,Dimensions} from "react-native";
import {Button, Input, Item, Spinner, Text, View} from "native-base";
import Camera from "react-native-camera";
import styles from "./styles";
import {BusinessHeader,SubmitButton} from '../../ui/index';
import StyleUtils from '../../utils/styleUtils'

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

    scaneQrCode(scanCode) {
        const{scanResult,businessAssign} = this.props
        if(businessAssign){
            scanResult(scanCode,businessAssign);
        }else{
            scanResult(scanCode)
        }


    }
    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {showNotAuthorizedMessage,showAssigmentMessageFailed,showAssigmentMessage,navigation, code, cameraOn, searching, business, instance, group, followBusiness, groupFollowBusiness, scanResult, realizePromotion,ShowOutOffScope} = this.props;
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

        if(showAssigmentMessage){
            return (<View style={{backgroundColor:'transparent',alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <Text>{strings.AssignmenofQrcCodesucceeded}</Text>
            </View>)

        }
        if(ShowOutOffScope){
            return (<View style={{backgroundColor:'transparent',alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <Text>{strings.ConditionOutOfScope}</Text>
            </View>)

        }


        if(showNotAuthorizedMessage){
            return (<View style={{backgroundColor:'transparent',alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <Text>{strings.notAuthorizedMessage}</Text>
            </View>)

        }

        if(showAssigmentMessageFailed){
            return (<View style={{backgroundColor:'transparent',alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <Text>{strings.AssignmenofQrcCodefailed}</Text>
            </View>)

        }


        let comnfirmLastPunc = false;
        if(instance){
            if(instance.promotion ==='PUNCH_CARD'){
                let missingPunches = instance.punches - instance.realizedPunches;
                if(missingPunches === 1){
                    comnfirmLastPunc = true;
                }
            }
        }

        return ( <View style={styles.follow_container}>

                {cameraOn && <View style={styles.payment_camera_container}><Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    onBarCodeRead={this.scaneQrCode.bind(this)}
                    style={styles.payment_camera}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
                    <Text>{strings.PleaseScanCode}</Text>
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
                    <View style={{flex:3, backgroundColor:'white'  }}>
                    <FeedPromotion scanner={true} refresh={this.refresh.bind(this)}

                                   hideSocial={true} navigation={navigation} item={instance}

                    />
                    </View>
                    <View style={{flex:1, alignItems:'center'}}>
                        <View style={{height:60,width:StyleUtils.getWidth(),backgroundColor:'white', alignItems:'center',justifyContent:'flex-start' }}>
                            {comnfirmLastPunc ? <SubmitButton width={200} color={'#2db6c8'} title={strings.ConfirmLast.toUpperCase()} onPress={() => realizePromotion(code)}/> :
                                <SubmitButton color={'#2db6c8'} title={strings.Confirm.toUpperCase()} onPress={() => realizePromotion(code)}/>}
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

