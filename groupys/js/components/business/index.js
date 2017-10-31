import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Header, Item, ListItem, Picker, Right, Thumbnail, View} from 'native-base';
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
        if (this.props.businesses) {
            this.setState({
                refresh: '',
                selectedBusiness: this.props.businesses[0]
            });
        } else {
            this.setState({
                refresh: '',
                selectedBusiness: [{
                    business: {_id: ''}
                }]
            });
        }
    }

    selectBusiness(businessId) {
        const {businesses} = this.props;
        if (businesses) {
            let selected = businesses.filter(business => business.business._id === businessId);
            if (selected && selected.length === 1) {
                this.setState({
                    selectedBusiness: selected[0]
                })
                this.props.actions.setBusinessProducts(businessId);
                this.props.actions.setBusinessPromotions(businessId);
                this.props.actions.setBusinessUsers(businessId);

            }
        }
    }

    createBusinessLogo() {
        if (this.state.selectedBusiness.business.logo) {
            return <Thumbnail small square source={{uri: this.state.selectedBusiness.business.logo}}/>
        } else {
            return <Thumbnail source={require('../../../images/client_1.png')}/>
        }
    }

    render() {
        const {businesses, navigation} = this.props;
        return (
            <View style={styles.listBusinessesContainer}>
                <View style={styles.businessPiker}>
                    <View style={styles.businessTopLogo}>
                        {this.createBusinessLogo()}
                    </View>
                    <View style={styles.businessPikkerComponent}>
                        <Picker

                            mode="dropdown"
                            placeholder="Select Business"
                            style={styles.pickerStyle}
                            selectedValue={this.state.selectedBusiness.business._id}
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
                        item={this.state.selectedBusiness}
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
        update: state.businesses.update,
        businesses: getMyBusinessesItems(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),
    })
)(Business);
