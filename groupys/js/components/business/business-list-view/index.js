import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
const covefr = require('../../../../images/cover2.png');
import styles from './styles'
const promotions =  require('../../../../images/noun_681891_cc.png');
const products =  require('../../../../images/barcode.png');

const premissions =  require('../../../../images/permissions.png');
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
            banner =<View style={{padding:10}}><Image   style={{
                flex:-1,
                alignSelf: 'center',
                height: 70,
                width: 70,
                marginLeft:10,
                borderWidth: 1,
                borderRadius: 80
            }} resizeMode= "cover"  source={{uri: this.props.item.business.pictures[0].pictures[0]}}>


            </Image>

            </View>
            // banner =  <View style={styles.container}>
            //
                {/*<Image*/}
                {/*style={styles.image}*/}

                {/*source={{uri: this.props.item.business.pictures[0].pictures[0]}}>*/}
                    {/*<Image*/}
                        {/*style={styles.imageb}*/}

                        {/*source={covefr}>*/}
                    {/*</Image>*/}

                {/*</Image>*/}






            //     <Text  style={styles.imageTopText}>{this.props.item.business.name}</Text>
            //     <Text style={styles.imageButtomText} >{this.props.item.business.info}</Text>
            //
            //
            // </View>
        }else{
            banner = <Image
                style={{padding: 0, flex: -1,height:300}}
                source={require('../../../../images/client_1.png')}>
             </Image>


        }


        let editButton = undefined;
        if(this.props.item.role == 'OWNS'){
            editButton =  <Button small  style={{backgroundColor:'white',height:50,width:60,marginLeft:10}}onPress={this.showProduct.bind(this,this.props,this.props.item)}>
                <Icon2   size={20}  style={styles.productIcon} name="edit" />


            </Button>
        }

        let promotionButton = undefined;
        if(this.props.item.role == 'OWNS' ||this.props.item.role == 'Admin' || this.props.item.role == 'Manager'  ){
            promotionButton =   <TouchableOpacity    onPress={() => this.showPromotions()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                <Image style={{tintColor:'#ff6400',marginLeft:10,width:20,height:20}} source={promotions}/>

                <Text style={{ marginLeft:5,color:'black',fontStyle: 'normal',fontSize:13 }}>Promotions </Text>

            </TouchableOpacity>
        }
        let premissionsButton = undefined;
        if(this.props.item.role == 'OWNS' ||this.props.item.role == 'Admin' || this.props.item.role == 'Manager'  ) {
            premissionsButton=  <TouchableOpacity    onPress={() => this.showUsersRoles()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                <Image style={{tintColor:'#ff6400',marginLeft:10,width:20,height:20}} source={premissions}/>

                <Text style={{ marginLeft:5,color:'black',fontStyle: 'normal',fontSize:13 }}>Permissions </Text>

            </TouchableOpacity>
        }
        return ( <View style={{padding:5,backgroundColor:'#eaeaea'}}  >
            <View style={{flex:-1, padding:5,backgroundColor:'white',flexDirection: 'row' ,alignItems: 'center',}}>
                {banner}

                <Text style={{marginLeft:10}}>{this.props.item.business.name}</Text>
                <View style={{marginLeft:80,flex:-1, flexDirection: 'row' ,alignItems: 'center',}}>
                {editButton}
                </View>

            </View>


            <View style={{borderTopWidth:2, borderColor:'#eaeaea',backgroundColor:'white'}}  key={this.props.index}>












                <View style={{height:40,flexDirection: 'row', alignItems: 'center'}} >
                    {premissionsButton}


                    <TouchableOpacity    onPress={() => this.showProducts()}  style={{ margin:3, flexDirection: 'row', alignItems: 'center', } } regular>
                        <Image style={{tintColor:'#ff6400',marginLeft:10,width:20,height:20}} source={products}/>

                        <Text style={{ marginLeft:5,color:'black',fontStyle: 'normal',fontSize:13 }}>Products </Text>

                    </TouchableOpacity>

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

