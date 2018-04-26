import React, {Component} from "react";
import {TouchableOpacity} from "react-native";
import {Button, Input, Item, Spinner, View} from "native-base";
import Icon3 from "react-native-vector-icons/Ionicons";
import Camera from "react-native-camera";
import styles from "./styles";
import {BusinessHeade, ImageControllerr, ThisText} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import navigationUtils from '../../../utils/navigationUtils'

const qrcode = require('../../../../images/qr-code.png');
const scan = require('../../../../images/scan.png');
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

    showScanner() {
        const {group} = this.props;
        navigationUtils.doNavigation(this.props.navigation,'ReadQrCode', {group: group})

    }

    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {cameraOn, searching, businesses, searchBusiness, followByQrCode, followBusiness, groupFollowBusiness, group, showCamera} = this.props;
        let back = <Button transparent style={{}} onPress={() => this.back()}>
            <Icon3 active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

        </Button>
        let spin = undefined;
        if (searching) {
            spin = <View><Spinner color='red'/></View>;
        }
        let navigation = this.props.navigation;
        let rows = undefined;
        if (businesses && businesses.length > 0) {
            rows = businesses.map(function (businees) {
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
                let followComponent = <TouchableOpacity onPress={() => followBusiness(businees._id, navigation)}
                                                        style={followStyle} regular>

                    <ThisText style={{color: 'white', fontStyle: 'normal', fontSize: 15}}>{strings.Follow}</ThisText>

                </TouchableOpacity>;
                if (group) {
                    followComponent =
                        <TouchableOpacity onPress={() => groupFollowBusiness(group._id, businees._id, navigation)}
                                          style={followStyle} regular>

                            <ThisText style={{color: 'white', fontStyle: 'normal', fontSize: 15}}>{strings.Follow}</ThisText>

                        </TouchableOpacity>;
                }
                return <View key={businees._id} style={{padding: 5, backgroundColor: '#eaeaea'}}>
                    <View style={{
                        flex: -1,
                        padding: 5,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View>
                            <BusinessHeader navigation={navigation} business={businees}
                                            businessLogo={businees.logo}
                                            businessName={businees.name}/>
                        </View>

                        <ThisText style={{width: 100, marginLeft: 10}}>{businees.name}</ThisText>
                        <View
                            style={{marginLeft: 20, flex: -1, flexDirection: 'row', width: 180, alignItems: 'center',}}>
                            {followComponent}
                        </View>

                    </View>
                </View>
            })
        }
        let camera = undefined;
        if (cameraOn) {
            camera = <View style={styles.payment_camera_container}><Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                onBarCodeRead={followByQrCode}
                style={styles.payment_camera}
                aspect={Camera.constants.Aspect.fill}>
            </Camera>
                <ThisText>strings.PleaseScanCode</ThisText>
            </View>
        }
        return ( <View style={styles.follow_container}>
                <Item style={styles.follow_search} regular>
                    {back}
                    <Input style={styles.follow_search_field} value={this.state.searchText}
                           onSubmitEditing={() => searchBusiness(this.state.searchText)} blurOnSubmit={true}
                           returnKeyType='search' ref="1" onChangeText={(searchText) => this.setState({searchText})}
                           placeholder={strings.SearchBusiness}/>
                    <TouchableOpacity onPress={() => searchBusiness(this.state.searchText)}
                                      style={{marginRight: 5, flexDirection: 'row', alignItems: 'center',}} regular>
                        <ImageControllerr style={{marginLeft: 10, width: 20, height: 20}} source={scan}/>


                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.showScanner()}
                                      style={{marginRight: 5, flexDirection: 'row', alignItems: 'center',}} regular>
                        <ImageControllerr style={{marginLeft: 10, width: 20, height: 20}} source={qrcode}/>


                    </TouchableOpacity>
                </Item>
                {camera}
                {spin}
                {rows}
            </View>
        );
    }

    render() {
        return this.createView();
    }
}
