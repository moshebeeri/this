import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Item, ListItem, Picker, Right, Thumbnail, View,Spinner} from 'native-base';
import BusinessListView from './business-list-view/index'
import * as businessAction from "../../actions/business";
import {getMyBusinessesItems} from '../../selectors/businessesSelector'
import {bindActionCreators} from "redux";
import Icon3 from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

class Business extends Component {
    constructor(props) {
        super(props);
        this.props.actions.fetchBusinessCategories('root');
    }

    renderItem(item) {
        const {navigation} = this.props;
        return <BusinessListView
            item={item.item}
            index={item.index}
            navigation={navigation}
        />
    }

    componentWillMount() {
        this.props.actions.onEndReached();

    }

    selectBusiness(businessId) {
        const {businesses} = this.props;
        if (businesses) {
            let selected = businesses.filter(business => business.business._id === businessId);
            if (selected && selected.length === 1) {
                this.props.actions.selectBusiness(selected[0])

                this.props.actions.setBusinessProducts(businessId);
                this.props.actions.setBusinessPromotions(businessId);
                this.props.actions.setBusinessUsers(businessId);

            }
        }
    }

    createBusinessLogo(selectedBusiness) {
       if (selectedBusiness && selectedBusiness.business.logo) {
            return <Thumbnail small square source={{uri: selectedBusiness.business.logo}}/>
        } else {
            return <Thumbnail source={require('../../../images/client_1.png')}/>
        }
    }

    render() {
        const {businesses, navigation,businessLoading,selectedBusiness} = this.props;
        if(businessLoading && businesses.length === 0){
            return <Spinner/>
        }
        if(!businessLoading && businesses.length === 0){
            return <View></View>
        }

        let businessWasSelected = selectedBusiness;
        if(!businessWasSelected && businesses.length > 0){
            businessWasSelected = businesses[0];

        }

        return (
            <View style={styles.listBusinessesContainer}>
                <View style={styles.businessPiker}>
                    <View style={styles.businessTopLogo}>
                        {this.createBusinessLogo(businessWasSelected)}
                    </View>
                    <View style={styles.businessPikkerComponent}>
                        <Picker

                            mode="dropdown"
                            placeholder="Select Business"
                            style={styles.pickerStyle}
                            selectedValue={businessWasSelected.business._id}
                            onValueChange={(busines) => this.selectBusiness(busines)}>

                            {
                                businesses.map((s, i) => {
                                    return <Item
                                        key={i}
                                        value={s.business._id}
                                        label={s.business.name}/>
                                })}
                        </Picker>
                        <Icon3 style={{
                            top: 10,
                            right: 15,
                            position: 'absolute',
                            fontWeight: 'bold',
                            fontSize: 25,
                            color: 'gray'
                        }} name="chevron-down"/>

                    </View>
                </View>
                <View style={styles.businessDetailsContainer}>
                    <BusinessListView
                        item={businessWasSelected}
                        index={0}
                        navigation={navigation}
                    />
                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
        businessLoading:state.businesses.loading,
        selectedBusiness:state.businesses.selectedBusiness,
        update: state.businesses.update,
        businesses: getMyBusinessesItems(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Business);
