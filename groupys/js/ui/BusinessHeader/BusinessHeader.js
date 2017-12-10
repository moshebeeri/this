import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Thumbnail,Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles'
import { I18nManager } from 'react-native';
export default class BusinessHeader extends Component {
    constructor(props) {
        super(props);
    }

    showBusiness() {
        const{navigation,business} = this.props;
        navigation.navigate("businessProfile", {businesses: business});
    }

    createBusinessLog() {
        const {businessLogo,small} = this.props;
        if (businessLogo) {
            if(small){
                return <TouchableOpacity style={{margin:5}} onPress={this.showBusiness.bind(this)}>
                    <View>
                        <Thumbnail small square={true} size={40} source={{uri: businessLogo}}/>
                    </View>
                </TouchableOpacity>
            }
            return <TouchableOpacity style={{margin:5}} onPress={this.showBusiness.bind(this)}>
                <View>
                    <Thumbnail square={true} size={40} source={{uri: businessLogo}}/>
                </View>
            </TouchableOpacity>
        }
        return undefined;
    }


    back() {
        this.props.navigation.goBack();
    }
    render() {
        const {categoryTitle, color, businessName,showBack,noMargin,editButton} = this.props;
        let nameTextStyle = styles.businessNameText;
        if(color){
            nameTextStyle = styles.businessColorNameText;
        }

        let headerContainerStyle = styles.logo_view;
        if(noMargin){
            headerContainerStyle = styles.logo_view_no_margin;
        }
        let showEdit = false;
        if(editButton){
            showEdit = true;
        }

        let back = undefined;
        if (showBack) {
            back = <Button transparent style={{marginLeft:10,marginRight:10}} onPress={() => this.back()}>
                <Icon active size={25} name="ios-arrow-back"/>

            </Button>
        }
        return <View style={headerContainerStyle}>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                {back}
            </View>


            {  this.createBusinessLog()}
            <View style={{flex: 1, flexDirection: 'column',justifyContent:'center'}}>
                <Text style={nameTextStyle} note>{businessName}</Text>
                {categoryTitle && <Text numberOfLines={1} style={styles.businessAddressText}
                      note>{categoryTitle}</Text>}
            </View>
            {   showEdit &&  <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'center',}}>
                {editButton}
            </View> }


        </View>
    }
}




