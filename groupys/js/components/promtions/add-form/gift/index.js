import React, {Component} from 'react';
import {Keyboard, Platform, Text, View} from 'react-native'
import styles from './styles'
import {SelectButton, SimplePicker} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils';
import {Thumbnail} from 'native-base';
import ProductPreview from "../../../product/productPreview/index";
import {ThisText} from '../../../../ui/index';
import UserPreview from "../../../user-profile/userPreview/index";
import BusinessPreview from "../../../business/businessPreview/index";

const types = [
    {
        value: 'MY_BUSINESS',
        label: strings.MyBusiness
    },
    {
        value: 'OTHER_BUSINESS',
        label: strings.OtherBusiness
    }
];
export default class GiftComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftingBusiness: 'MY_BUSINESS'
        }
    }

    componentWillMount() {
        this.props.setState({
            discount_on: 'PRODUCT'
        })
    }

    selectProduct(product) {
        this.props.setState(
            {
                giftProduct: product
            }
        )
    }

    selectOtherBusiness(otherBusinessPermittedUser, otherBusiness) {
        this.setState({otherBusinessPermittedUser: otherBusinessPermittedUser});
        this.setState({otherBusiness: otherBusiness});
        //this.props.setState({otherBusinessPermittedUser, otherBusiness});

    }

    selectBuyProduct(product) {
        this.setState({product: product});
        this.props.setState(
            {
                product: product
            }
        )
    }

    showProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId
        })
    }



    searchBusinessByPermittedUser() {
        let selectOtherBusiness = this.selectOtherBusiness.bind(this);
        this.props.navigation.navigate("SearchBusinessByPermittedUser", {
            selectOtherBusiness: selectOtherBusiness,
        })
    }

    isValid() {
        let result = true;
        Object.keys(this.refs).forEach(key => {
            let item = this.refs[key];
            if (this.refs[key].wrappedInstance) {
                item = this.refs[key].wrappedInstance;
            }
            if (!item.isValid()) {
                result = false;
            }
        });
        return result
    }

    showBuyProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId
        })
    }

    setBuy(value) {
        let eligible = undefined;
        if (this.props.state.gift && this.props.state.gift.values) {
            eligible = this.props.state.gift.values.eligible;
        }
        this.props.setState({
            choose_distribution: true,
            gift:
                {
                    values: {
                        buy: value,
                        eligible: eligible,
                    }
                }
        })
    }

    setEligible(value) {
        let buy = undefined;
        if (this.props.state.gift && this.props.state.gift.values) {
            buy = this.props.state.gift.values.buy;
        }
        this.props.setState({
            gift:
                {
                    values: {
                        buy: buy,
                        eligible: value,
                    }
                }
        })
    }

    done() {
        Keyboard.dismiss();
    }

    async selectGiftingBusiness(value) {
        this.setState({
            giftingBusiness: value,
        });
    }

    render() {
        return <View>

            <View style={[styles.textLayout, {width: StyleUtils.getWidth() - 15}]}>
                <ThisText style={{color: '#FA8559', marginLeft: 8, marginRight: 8}}>{strings.Gift}</ThisText>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1.7, marginTop: 25}}>
                    <SelectButton ref="giftSelectProduct"
                                  isMandatory={true}
                                  selectedValue={this.props.state.product}
                                  title={strings.SelectProduct}
                                  action={this.showBuyProducts.bind(this, true)}/>
                </View>
            </View>
            <ProductPreview product={this.props.state.product}/>

            <View style={[styles.inputTextLayout, {width: StyleUtils.getWidth() - 15}]}>
                <SimplePicker ref="promotionType" list={types} itemTitle={strings.GiftingBusiness}
                              isMandatory
                              value={strings.MyBusiness}
                              onValueSelected={this.selectGiftingBusiness.bind(this)}/>
            </View>
            {
                this.state.giftingBusiness === 'MY_BUSINESS' ?
                    <View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flex: 1.7, marginTop: 25}}>
                                <SelectButton ref="giftSelectGift"
                                              isMandatory={true}
                                              selectedValue={this.props.state.giftProduct}
                                              title={strings.SelectGift}
                                              action={this.showProducts.bind(this, true)}/>
                            </View>
                        </View>
                        < ProductPreview product={this.props.state.giftProduct} type='gift'/>
                    </View>
                    :
                    <View>
                        <View style={{flex: 1.7, marginTop: 25}}>
                            <SelectButton ref='SearchBusinessByPermittedUser'
                                          title={strings.SearchOtherBusiness}
                                          action={this.searchBusinessByPermittedUser.bind(this, true)}/>
                        </View>
                        <UserPreview user={this.state.otherBusinessPermittedUser}/>
                        <BusinessPreview isSelect={false} business={this.state.otherBusiness}/>
                    </View>

            }
        </View>
    }

    focusNextField(nextField) {
        if (this.refs[nextField] && this.refs[nextField].wrappedInstance) {
            this.refs[nextField].wrappedInstance.focus()
        }
        if (this.refs[nextField] && this.refs[nextField].focus) {
            this.refs[nextField].focus()
        }
    }
}

