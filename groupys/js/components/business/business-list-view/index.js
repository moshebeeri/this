import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import styles from './styles'
export default class BusinessListView extends Component {


    constructor(props) {
        super(props);

    }



    showProduct(props,item){

        this.props.navigation.navigate(this.props.addform,{item:item});
    }

    showProducts(){
        this.props.navigation.navigate("Products",{business:this.props.item});
    }

    showPromotions(){
        this.props.navigation.navigate("Promotions",{business:this.props.item});
    }

    createView(){
        let banner = undefined;
        if(this.props.item.pictures && this.props.item.pictures.length > 0) {

            banner = <Image
                style={{padding: 0, flex: -1,height:300}}
                source={{uri: this.props.item.pictures[0].pictures[0]}}>
                <Text  style={styles.imageTopText}>{this.props.item.name}</Text>
                <Text style={styles.imageButtomText} >{this.props.item.info}</Text>
               </Image>
        }else{
            banner = <Image
                style={{padding: 0, flex: -1,height:300}}
                source={require('../../../../images/client_1.png')}>
                <Text  style={styles.imageTopText}>{this.props.item.name}</Text>
                <Text style={styles.imageButtomText} >{this.props.item.info}</Text>
            </Image>


        }

        return (  <Card   key={this.props.index}>



                <View style={{flex:-1,justifyContent:'center',height:300}}>

                    {banner}




                </View>


                <CardItem >
                    <Button transparent onPress={this.showProduct.bind(this,this.props,this.props.item)}>
                        <Icon2   size={15}  style={styles.productIcon} name="edit" />

                        <Text>Edit</Text>
                    </Button>
                    <Button transparent onPress={() =>  this.showProducts()}>
                                         <Icon2   size={15}  style={styles.productIcon} name="add-shopping-cart" />

                                         <Text>Products</Text>
                                    </Button>
                    <Button transparent onPress={() =>  this.showPromotions()}>
                        <Icon2   size={15}  style={styles.productIcon} name="collections" />

                        <Text>Promotions</Text>
                    </Button>


                </CardItem>
            </Card>

        );



    }
    render() {
        return this.createView();

    }



}
