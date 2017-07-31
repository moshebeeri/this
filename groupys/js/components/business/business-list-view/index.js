import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
const covefr = require('../../../../images/cover2.png');
import styles from './styles'
export default class BusinessListView extends Component {


    constructor(props) {
        super(props);

    }



    showProduct(props,item){

        this.props.navigation.navigate(this.props.addform,{item:item.business});
    }

    showProducts(){
        this.props.navigation.navigate("Products",{business:this.props.item.business});
    }

    showPromotions(){
        this.props.navigation.navigate("Promotions",{business:this.props.item.business});
    }

    showUsersRoles(){
        this.props.navigation.navigate("userPermittedRoles",{business:this.props.item.business});
    }

    createView(){
        let banner = undefined;

        if(this.props.item.business.pictures && this.props.item.business.pictures.length > 0) {

            banner =  <View style={styles.container}>

                <Image
                style={styles.image}

                source={{uri: this.props.item.business.pictures[0].pictures[0]}}>
                    <Image
                        style={styles.imageb}

                        source={covefr}>
                    </Image>

                </Image>






                <Text  style={styles.imageTopText}>{this.props.item.business.name}</Text>
                <Text style={styles.imageButtomText} >{this.props.item.business.info}</Text>


            </View>
        }else{
            banner = <Image
                style={{padding: 0, flex: -1,height:300}}
                source={require('../../../../images/client_1.png')}>
             </Image>


        }


        let editButton = undefined;
        if(this.props.item.role == 'OWNS'){
            editButton =  <Button  style={{width:65,marginLeft:0,marginRight:0}}small transparent onPress={this.showProduct.bind(this,this.props,this.props.item)}>
                <Icon2   size={15}  style={styles.productIcon} name="edit" />
                <Text>Edit</Text>

            </Button>
        }

        let promotionButton = undefined;
        if(this.props.item.role == 'OWNS' ||this.props.item.role == 'Admin' || this.props.item.role == 'Manager'  ){
            promotionButton = <Button  style={{width:100,marginLeft:0,marginRight:0}}small transparent onPress={() =>  this.showPromotions()}>
                <Icon2   size={15}  style={styles.productIcon} name="collections" />

                <Text>Promotions</Text>
            </Button>
        }
        let userButton = undefined;
        if(this.props.item.role == 'OWNS' ||this.props.item.role == 'Admin' || this.props.item.role == 'Manager'  ) {
            userButton=  <Button style={{width:77,marginLeft:0,marginRight:0}}small transparent onPress={() =>  this.showUsersRoles()}>
                <Icon2   size={15}  style={styles.productIcon} name="collections" />

                <Text>Users</Text>
            </Button>
        }
        return ( <View >
            <View style={{flex:-1, flexDirection: 'row',justifyContent:'space-between'}}>
                {banner}

            </View>


            <View   key={this.props.index}>












                <View style={{width:100,flexDirection: 'row'}} >
                    {userButton}
                    {editButton}

                    <Button  style={{width:105,marginLeft:0,marginRight:0}}small transparent onPress={() =>  this.showProducts()}>
                                         <Icon2   size={15}  style={styles.productIcon} name="add-shopping-cart" />

                                         <Text>Products</Text>
                                    </Button>

                    {promotionButton}




            </View>
            </View>

            </View>
        );



    }
    render() {
        return this.createView();

    }



}

