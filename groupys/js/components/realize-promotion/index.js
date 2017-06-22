import React, {Component} from 'react';
import {connect} from 'react-redux';

import {View, Container,Button,Text,Input,Footer, Icon, List, ListItem, Content,Item,Card,CardItem} from 'native-base';
import {Image} from 'react-native';
import styles from './style';


import PromotionApi from '../../api/promotion'

let promotionApi = new PromotionApi()
export default class RealizePromotion extends Component {


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
    async componentWillMount(){
        let qrCode  = await promotionApi.getPromotionQrcode(this.props.navigation.state.params.item.id);
        this.setState({
            image:qrCode
        })


    }

    async realize(){

        this.props.navigation.goBack();
    }




    render() {
        let item = this.props.navigation.state.params.item;
        return (
            <Container>
            <Content style={{backgroundColor: '#fff'}}>



                <Card>
                    <CardItem >
                        <Text style={{ fontWeight: 'bold',marginLeft:20,marginTop:20,fontSize:25,color:'black'}}>{item.itemTitle}</Text>
                    </CardItem>
                    <CardItem style={styles.camera}>
                       <Image style={{width: 300, height: 300, resizeMode: Image.resizeMode.contain, borderWidth: 1, borderColor: 'red'}} source={{uri: this.state.image.qrcode}}/>

                    </CardItem>
                </Card>
            </Content>

            </Container>
        );
    }
}
