  import React, {Component} from "react";
import {Image, TouchableOpacity,Dimensions,BackHandler,Keyboard} from "react-native";
import {Button, Input, Item, Spinner, Text, View} from "native-base";
import Camera from './BetterCamera';
import styles from "./styles";
import {BusinessHeader,SubmitButton,GroupHeader} from '../../ui/index';
import StyleUtils from '../../utils/styleUtils'
import {ThisText,TextInput} from '../../ui/index';
import CardItem from '../../components/memberCards/list-item/index'
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
       // this.props.closeCamera();
    }

    chargeCard(){
        const{chargePoints,card,code} = this.props;
        chargePoints(this.state.points,card,code);
        this.back();
    }

    dismissKyeboard(){
        Keyboard.dismiss();
    }

    createView() {
        const {followGroup,showNotAuthorizedMessage,showAssigmentMessageFailed,showAssigmentMessage,navigation, code, cameraOn, searching, business, instance, group, followGroupAction,followBusiness, groupFollowBusiness, scanResult, realizePromotion,ShowOutOffScope,card} = this.props;
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
            return (<View style={{backgroundColor:'white' , height: height -10,
                width:width,padding:10,alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <ThisText>{strings.AssignmentOfQRCodeSucceeded}</ThisText>
            </View>)

        }
        if(ShowOutOffScope){
            return (<View style={{backgroundColor:'white' , height: height -10,
                width:width,padding:10,alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <ThisText>{strings.ConditionOutOfScope}</ThisText>
            </View>)

        }


        if(showNotAuthorizedMessage){
            return (<View style={{backgroundColor:'white' , height: height -10,
                width:width,padding:10,alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <ThisText>{strings.notAuthorizedMessage}</ThisText>
            </View>)

        }

        if(showAssigmentMessageFailed){
            return (<View style={{backgroundColor:'׳white',alignItems:'center',justifyContent:'flex-start',flex:1}}>
                <ThisText>{strings.AssignmentOfQRCodeFailed}</ThisText>
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
                    <View style={{marginTop:StyleUtils.scale(5)}}>
                    <ThisText>{strings.PleaseScanCode}</ThisText>
                    </View>
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
                    <View style={{ height: StyleUtils.scale(300),backgroundColor:'white'  }}>
                    <FeedPromotion scanner={true} refresh={this.refresh.bind(this)}

                                   hideSocial={true} navigation={navigation} item={instance}

                    />
                    </View>
                    {!instance.deleted && <View style={{ alignItems:'center'}}>
                        <View style={{height:60,width:StyleUtils.getWidth(),backgroundColor:'white', alignItems:'center',justifyContent:'flex-start' }}>
                            {comnfirmLastPunc ? <SubmitButton width={200} color={'#2db6c8'} title={strings.ConfirmLast.toUpperCase()} onPress={() => realizePromotion(code)}/> :
                                <SubmitButton color={'#2db6c8'} title={strings.Confirm.toUpperCase()} onPress={() => realizePromotion(code)}/>}
                        </View>
                    </View>}
                </View>
                }
                {followGroup && <View style={{height:200,alignItems:'center',justifyContent:'center' }}>
                    <View style={{flex:3, backgroundColor:'white' ,alignItems:'center',justifyContent:'center' }}>
                        <GroupHeader group={followGroup} disabled={true}

                        />
                        <ThisText>{strings.FollowGroupMessage.formatUnicorn(followGroup.name)}</ThisText>
                    </View>
                    <View style={{flex:1, alignItems:'center'}}>
                        <View style={{height:60,width:StyleUtils.getWidth(),backgroundColor:'white', alignItems:'center',justifyContent:'flex-start' }}>
                            <SubmitButton color={'#2db6c8'} title={strings.Follow.toUpperCase()} onPress={() => followGroupAction(followGroup)}/>
                        </View>
                    </View>
                </View>
                }
                {card &&
                <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white' }}>
                    <View style={{ backgroundColor:'white' ,height:StyleUtils.scale(220),alignItems:'center',justifyContent:'center' }}>
                        <CardItem noAction item={card}/>

                    </View>
                    <View style={{ alignItems:'center',backgroundColor:'white'}}>
                        <ThisText>{strings.CardChargePointsMessage.formatUnicorn(card.user.name)}</ThisText>
                        <View style={{height:60,width:StyleUtils.getWidth(),backgroundColor:'white', alignItems:'center',justifyContent:'flex-start' }}>
                            <TextInput
                                keyboardType='numeric'
                                containerDefaultStyle={{   flexDirection: 'column',
                                    justifyContent: 'center',
                                    width: StyleUtils.scale(200),
                                    height: StyleUtils.scale(55),}}
                                style={{
                                backgroundColor: 'white',
                                borderColor:'#839192',
                                justifyContent: 'flex-start',
                                flex: 1,
                                borderWidth:1,
                                textAlignVertical: "top",
                                borderRadius: 2,
                                marginBottom: StyleUtils.scale(10),
                                fontSize: StyleUtils.scale(16),width:StyleUtils.getWidth()}} value={this.state.points} returnKeyType='next' ref="6"
                                       refNext="6"
                                       onSubmitEditing={this.dismissKyeboard.bind(this)}
                                       onChangeText={(points) => this.setState({points})}/>
                        </View>
                        <View style={{height:60,width:StyleUtils.getWidth(),backgroundColor:'white', alignItems:'center',justifyContent:'flex-start' }}>
                            <SubmitButton width = {200}color={'#2db6c8'} title={strings.Charge.toUpperCase()} onPress={() => this.chargeCard()}/>
                        </View>
                    </View>
                </View>}
            </View>
        );
    }
    refresh(){}


    render() {
        return this.createView();
    }
}

