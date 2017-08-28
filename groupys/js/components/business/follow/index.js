import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Spinner,Button, View,Header, Body, Item,Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import BusinessApi from '../../../api/business'
import Icon3 from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-camera';
const qrcode = require('../../../../images/qr-code.png');
const scan = require('../../../../images/scan.png');
let businessApi = new BusinessApi();


import styles from './styles'
import Search from 'react-native-search-box';

export default class BusinessFollow extends Component {

    static navigationOptions = {
        header:null
    };
    constructor(props) {
        super(props);

        this.state ={
            searchText:'',
            businesses:{},
            showSpin:false,
            showCamera:false,
        }

    }
    back(){
        this.props.navigation.goBack();
    }

    onSearch(){

        return new Promise((resolve, reject) => {
            console.log('onSearch');
            resolve();
        });
    }

    async search(){

        this.setState({
            showSpin:true,
            showCamera:false,
        })

        let response = await businessApi.searchBusiness(this.state.searchText)

        this.setState({
            businesses:response,
            showSpin:false
        })


    }

    follow(bussinesId){
        this.back();
        businessApi.followBusiness(bussinesId);
    }

    scanQrcCode(){
        this.setState({
            showCamera:true,
        })
    }

    async onBarCodeRead(barcode){
        await this.setState({
            showSpin:true,
            showCamera:false,
        })
        if(barcode.type && barcode.type == 'QR_CODE'){
            let data = JSON.parse(barcode.data);
            if(data.code) {
                let response = await businessApi.searchBusinessByCode(data.code);
                if(response && response.assignment  && response.assignment.business ) {
                    this.setState({
                        businesses:[response.assignment.business]
                    })


                }
            }
        }
        this.setState({
            showSpin:false,

        })



    }


    createView(){
        let back = <Button transparent style={{ }} onPress={()=> this.back()}>
                <Icon3 active color={"#2db6c8"} size={20} name="ios-arrow-back" />

            </Button>


        let spin = undefined;
        if(this.state.showSpin){
            spin = <View><Spinner color='red' /></View>;
        }
        let rows = undefined;
        if(this.state.businesses && this.state.businesses.length > 0){
            let followF = this.follow.bind(this);
            rows = this.state.businesses.map(function (businees) {
                let banner = undefined;

                if(businees.pictures && businees.pictures.length > 0) {
                    banner =<View style={{padding:10}}><Image   style={{
                        flex:-1,
                        alignSelf: 'center',
                        height: 70,
                        width: 70,
                        marginLeft:10,
                        borderWidth: 1,
                        borderRadius: 80
                    }} resizeMode= "cover"  source={{uri: businees.pictures[0].pictures[0]}}>


                    </Image>

                    </View>

                }else{
                    banner = <Image
                        style={{padding: 0, flex: -1,height:300}}
                        source={require('../../../../images/client_1.png')}>
                    </Image>
                }


                let followStyle ={
                    flex:-1,justifyContent:'center',marginLeft:20 ,flexDirection: 'row',alignItems: 'center',height: 40,width:200, backgroundColor: '#e65100',
                };
                return  <View key={businees._id} style={{padding:5,backgroundColor:'#eaeaea'}}  >
                    <View style={{flex:-1,padding:5,backgroundColor:'white',flexDirection: 'row' ,alignItems: 'center',}}>
                        {banner}

                        <Text style={{width:100,marginLeft:10}}>{businees.name}</Text>
                        <View style={{marginLeft:20,flex:-1, flexDirection: 'row', width:180,alignItems: 'center',}}>
                            <TouchableOpacity    onPress={() => followF(businees._id)}  style={followStyle } regular>

                                <Text style={{ color:'white',fontStyle: 'normal',fontSize:15 }}>Follow </Text>

                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            })
        }
        let camera = undefined
        if(this.state.showCamera){
            camera = <View style={styles.payment_camera_container}><Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                onBarCodeRead={this.onBarCodeRead.bind(this)}
                style={styles.payment_camera}
                aspect={Camera.constants.Aspect.fill}>
            </Camera>
                <Text>Please Scan Code</Text>
            </View>
        }

        return ( <View style={styles.follow_container}  >
                <Item style={styles.follow_search}  regular >
                    {back}
                    <Input  style={styles.follow_search_field}   value={this.state.searchText} onSubmitEditing={this.search.bind(this)}blurOnSubmit={true} returnKeyType='search' ref="1" onChangeText={(searchText) => this.setState({searchText})} placeholder='Search Business' />
                    <TouchableOpacity  onPress={this.search.bind(this)}   style={{marginRight:5, flexDirection: 'row', alignItems: 'center',}} regular>
                        <Image style={{marginLeft:10,width:20,height:20}} source={scan}/>



                    </TouchableOpacity>

                    <TouchableOpacity  onPress={() => this.scanQrcCode()}  style={{ marginRight:5, flexDirection: 'row', alignItems: 'center', } } regular>
                        <Image style={{marginLeft:10,width:20,height:20}} source={qrcode}/>



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

