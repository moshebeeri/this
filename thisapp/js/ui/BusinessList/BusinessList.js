import React, {Component} from "react";
import {ScrollView, View} from "react-native";
import {Button, Input, Item, Spinner} from "native-base";
import styles from "./styles";
import {BusinessHeader, SubmitButton, ThisText} from '../../ui/index';
import strings from '../../i18n/i18n';
import StyleUtils from '../../utils/styleUtils'
import {connect} from 'react-redux';

class BusinessList extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {businesses, followingBusinesses, followBusiness} = this.props;
        let navigation = this.props.navigation;
        let rows = undefined;
        if (businesses && businesses.length > 0) {
            rows = businesses.map(function (businees) {
                let businessFollowed = followingBusinesses.filter(businessFollow => businees._id === businessFollow);
                return <View key={businees._id}
                             style={{height: StyleUtils.scale(80), padding: 5, backgroundColor: 'white'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: StyleUtils.scale(80),
                        justifyContent: 'space-between'
                    }}>
                        <View style={{width: StyleUtils.scale(200)}}>
                            <BusinessHeader bgColor={'white'} heaedrSize={60} hideMenu navigation={navigation}
                                            headerWidth={StyleUtils.scale(240)} business={businees}
                                            businessLogo={businees.logo}
                                            businessName={businees.name}/>
                        </View>

                        {businessFollowed.length > 0 ?
                            <View
                                style={{
                                    marginTop: 10,
                                    marginLeft: 20,
                                    height: 50,
                                    flexDirection: 'row',
                                    width: 120,
                                    alignItems: 'center',
                                }}>
                                <SubmitButton disabled title={strings.Following}
                                              onPress={() => followBusiness(businees._id, navigation)}/>
                            </View> : <View
                                style={{
                                    marginTop: 10,
                                    marginLeft: 20,
                                    height: 50,
                                    flexDirection: 'row',
                                    width: 120,
                                    alignItems: 'center',
                                }}>
                                <SubmitButton color='#2db6c8' title={strings.Follow}
                                              onPress={() => followBusiness(businees._id, navigation)}/>
                            </View>}

                    </View>
                </View>
            })
        } else {
            rows = <View style={styles.noResults}><ThisText>{strings.NoResultsFound}</ThisText></View>
        }
        return ( <ScrollView style={styles.follow_container}>


                {rows}
            </ScrollView>
        );
    }

    render() {
        return this.createView();
    }
}

export default connect(state => ({
    followingBusinesses: state.following.followBusiness,
    })
)(BusinessList);

