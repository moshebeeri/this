import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {Icon, Thumbnail,} from 'native-base';
import {View} from 'react-native';
import styles from './styles'
import StyleUtils from '../../../utils/styleUtils';
import {EditButton, ImageController, SubmitButton, ThisText} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import navigationUtils from '../../../utils/navigationUtils'

const ILS = '₪';
export default class ProductListView extends Component {
    constructor(props) {
        super(props);
    }

    createImage(item) {
        if (item.pictures && item.pictures.length > 0) {
            return <ImageController thumbnail size={StyleUtils.scale(50)} square
                                    source={{uri: this.props.item.pictures[item.pictures.length -1].pictures[3]}}/>
        } else {
            return <ImageController thumbnail size={StyleUtils.scale(50)}
                                    source={require('../../../../images/client_1.png')}/>
        }
    }

    navigateToEdit(item) {
        const {navigation} = this.props;
        navigationUtils.doNavigation(navigation, "AddProduct", {item: item});
    }

    createEditTag(item) {
        return <EditButton color={"#FA8559"} onPress={this.navigateToEdit.bind(this, item)}/>
    }

    deleteProduct(item){
        const {actions,businessId} = this.props;
        actions.deleteBusinessProduct(item,businessId);
    }

    createSelectTag(item) {
        const {select} = this.props;
        return <SubmitButton color={'#FA8559'} title={strings.Select.toUpperCase()} onPress={() => select(item)}/>
    }

    render() {
        const {item, index, select} = this.props;
        return <View key={index} style={styles.productContainer}>
            <View style={styles.productImageContainer}>
                {this.createImage(item)}
            </View>
            <View style={styles.productMainContainer}>
                <View style={styles.productDescContainer}>
                    <ThisText style={{fontSize: StyleUtils.scale(14)}}>{item.name}</ThisText>
                    {item.info ? <ThisText style={{fontSize: StyleUtils.scale(14)}}>{item.info}</ThisText> : <View/>}
                </View>
                <View style={styles.productPriceContainer}>
                    <ThisText style={styles.retailTextStyle} note>{ILS}{item.retail_price}</ThisText>
                </View>
            </View>
            {!select && <View style={styles.productEditContainer}>
                {this.createEditTag(item)}

            </View>}
            {!select &&  <View style={{flex: 0.5, justifyContent: 'center'}}>
                <EditButton iconName={'delete'} color={'#FA8559'} onPress={this.deleteProduct.bind(this, item)}/>
            </View>}

            {select && <View style={[styles.productEditContainer, {marginRight: 20}]}>
                {this.createSelectTag(item)}
            </View>}

        </View>
    }
}

