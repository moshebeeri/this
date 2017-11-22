import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Thumbnail,Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles'

export default class BusinessHeader extends Component {
    constructor(props) {
        super(props);
    }

    showBussines() {
        const{navigation,business} = this.props;
        navigation.navigate("businessProfile", {bussiness: business});
    }

    createBusinessLog() {
        const {businessLogo,small} = this.props;
        if (businessLogo) {
            if(small){
                return <TouchableOpacity style={{margin:5}} onPress={this.showBussines.bind(this)}>
                    <View>
                        <Thumbnail small square={true} size={40} source={{uri: businessLogo}}/>
                    </View>
                </TouchableOpacity>
            }
            return <TouchableOpacity style={{margin:5}} onPress={this.showBussines.bind(this)}>
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
        const {categoryTitle, businessName,showBack} = this.props;
        let back = undefined;
        if (showBack) {
            back = <Button transparent style={{}} onPress={() => this.back()}>
                <Icon active size={25} name="ios-arrow-back"/>

            </Button>
        }
        return <View style={styles.logo_view}>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                {back}
            </View>
            {this.createBusinessLog()}
            <View style={{flex: 1, flexDirection: 'column',justifyContent:'center'}}>
                <Text style={styles.businessNameText} note>{businessName}</Text>
                {categoryTitle && <Text numberOfLines={1} style={styles.businessAddressText}
                      note>{categoryTitle}</Text>}
            </View>
        </View>
    }
}




