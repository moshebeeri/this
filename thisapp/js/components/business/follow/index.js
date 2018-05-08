import React, {Component} from "react";
import {TouchableOpacity,TextInput,BackHandler,View} from "react-native";
import {Button, Input, Item, Spinner,} from "native-base";
import Icon3 from "react-native-vector-icons/Ionicons";
import Camera from "react-native-camera";
import styles from "./styles";
import { ImageControllerr, ThisText,BusinessList} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import navigationUtils from '../../../utils/navigationUtils'
import StyleUtils from '../../../utils/styleUtils'
import Icon from 'react-native-vector-icons/Ionicons';
const qrcode = require('../../../../images/qr-code.png');
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

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));
    }

    handleBack(){
        this.props.resetFollowForm();
    }
    showScanner() {
        const {group} = this.props;
        navigationUtils.doNavigation(this.props.navigation, 'ReadQrCode', {group: group})
    }


    followBusiness(businessId,navigation){
        const{group,groupFollowBusiness} = this.props;
        groupFollowBusiness(group._id,businessId,navigation);
    }
    back() {
        this.handleBack();
        this.props.navigation.goBack();

    }

    createView() {
        const {cameraOn, searching, businesses, searchBusiness, followByQrCode,showSearchResults} = this.props;
        let back = <Button transparent style={{marginTop:5,marginLeft: 5, marginRight: 5}} onPress={() => this.back()}>
            <Icon3 active color={"#2db6c8"} size={30} name="ios-arrow-back"/>

        </Button>
        let spin = undefined;
        if (searching) {
            spin = <View><Spinner color='red'/></View>;
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
        return <View style={styles.follow_container}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'white',width:StyleUtils.getWidth()}} >
                {back}

                <TextInput style={{
                    color: '#888888',
                    marginTop: 5,
                    backgroundColor:'white',
                    fontSize: StyleUtils.scale(18),
                    width: StyleUtils.getWidth() - StyleUtils.scale(80),
                    height: StyleUtils.scale(40)
                }}
                           underlineColorAndroid='transparent'
                           value={this.state.searchText}
                           autoFocus={true}
                           returnKeyType='search'
                           onSubmitEditing={() => searchBusiness(this.state.searchText)}
                           onChangeText={(searchText) => this.setState({searchText})}
                           placeholder={strings.SearchBusiness}
                />


                <TouchableOpacity onPress={() => searchBusiness(this.state.searchText)}
                                  style={{marginRight: 5, flexDirection: 'row', alignItems: 'center',}} regular>
                    <Icon style={{fontSize: StyleUtils.scale(28), color: "#2db6c8"}} name="ios-search"/>

                </TouchableOpacity>

                {/*<TouchableOpacity onPress={() => this.showScanner()}*/}
                                  {/*style={{marginRight: 5, flexDirection: 'row', alignItems: 'center',}} regular>*/}
                    {/*<ImageControllerr style={{marginLeft: 10, width: 20, height: 20}} source={qrcode}/>*/}


                {/*</TouchableOpacity>*/}
            </View>
            {camera}
            {spin}
            {  showSearchResults   &&  <BusinessList navigation={this.props.navigation} businesses={businesses}
                          followBusiness={this.followBusiness.bind(this)}/>}
        </View>
    }

    render() {
        return this.createView();
    }
}

