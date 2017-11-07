import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {Icon, Thumbnail,} from 'native-base';
import {View,Text,TouchableOpacity} from 'react-native';
import styles from './styles'
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {EditButton} from '../../../ui/index';

const ILS = '₪';
export default class ProductListView extends Component {
    constructor(props) {
        super(props);
    }



    createImage(item) {
        if (item.pictures && item.pictures.length > 0) {
            return <Thumbnail square source={{uri: this.props.item.pictures[0].pictures[3]}}/>
        } else {
            return <Thumbnail size={150} source={require('../../../../images/client_1.png')}/>
        }
    }

    navigateToEdit(item) {
        const {navigation, business} = this.props;
        navigation.navigate("AddProduct", {item: item});
    }

    createEditTag(item) {
        return <EditButton onPress={this.navigateToEdit.bind(this, item)}/>
    }

    render() {
        const {item,index} = this.props;
        return <View key={index} style={styles.productContainer}>
            <View style={styles.productImageContainer}>
                {this.createImage(item)}
            </View>
            <View style={styles.productMainContainer}>
                <View style={styles.productDescContainer}>
                    <Text>{item.name} - <Text>{item.info}</Text></Text>
                </View>
                <View style={styles.productPriceContainer}>
                    <Text style={styles.retailTextStyle}note>{ILS}{item.retail_price}</Text>
                </View>

            </View>
            <View style={styles.productEditContainer}>
                {this.createEditTag(item)}
            </View>
        </View>
    }
}
