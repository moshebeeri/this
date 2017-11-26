import React, {Component} from 'react';
import {connect} from 'react-redux';
import {

    Container,
    Button,
    Text,
    Input,
    Footer,
    Icon,
    List,
    ListItem,
    Content,
    Item,
    Card,
    CardItem
} from 'native-base';
import {Image,View,Dimensions} from 'react-native';
import styles from './style';
import PromotionApi from '../../api/promotion'
import {PromotionHeader, PromotionSeperator,BusinessHeader} from '../../ui/index';
const deviceHeight = Dimensions.get('window').width;
let promotionApi = new PromotionApi()
export default class RealizePromotion extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            image: {
                qrcode: ''
                ,
            }
        };
    }

    async componentWillMount() {
        let qrCode = await promotionApi.getPromotionQrcode(this.props.navigation.state.params.item.id);
        this.setState({
            image: qrCode
        })
    }

    async realize() {
        this.props.navigation.goBack();
    }

    render() {
        let item = this.props.navigation.state.params.item;
        return (

                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <BusinessHeader showBack navigation={this.props.navigation} business={item.business}
                                        categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                        businessName={item.businessName}/>

                        <View style={{marginTop:5,flex:2,justifyContent:'center',alignItems:'center',width:deviceHeight-30,backgroundColor:'blue'}}>

                            <PromotionHeader columnStyle type={item.promotion} feed titleText={item.promotionTitle}
                                             titleValue={item.promotionValue} term={item.promotionTerm}/>

                        </View>
                        <View style={{flex:0.2,width:deviceHeight-30,height:20,}}>

                            <PromotionSeperator narrowWidth={30}/>
                        </View>
                        <View  style={{marginBottom:5,flex:4,width:deviceHeight-30,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                            <Text>LET AN AUTHORIZED EMPLOYEE</Text>
                            <Text>SCAN THIS QR CODE</Text>
                            <Image style={{
                                width: 300,
                                height: 300,
                                resizeMode: Image.resizeMode.contain,

                            }} source={{uri: this.state.image.qrcode}}/>

                        </View>
                    </View>



        );
    }
}
