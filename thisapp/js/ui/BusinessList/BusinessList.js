import React, {Component} from "react";
import {ScrollView, View} from "react-native";
import {Button, Input, Item, Spinner} from "native-base";
import styles from "./styles";
import {BusinessHeader, SubmitButton, ThisText} from '../../ui/index';
import strings from '../../i18n/i18n';
import navigationUtils from '../../utils/navigationUtils'

export default class BusinessList extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }
    }

    showScanner() {
        const {group,navigation} = this.props;
        navigationUtils.doNavigation(navigation, 'ReadQrCode', {group: group});

    }

    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {businesses, followBusiness} = this.props;
        let navigation = this.props.navigation;
        let rows = undefined;
        if (businesses && businesses.length > 0) {
            rows = businesses.map(function (businees) {
                return <View key={businees._id} style={{padding: 5, backgroundColor: '#eaeaea'}}>
                    <View style={{
                        flex: -1,
                        padding: 5,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{width: 200}}>
                            <BusinessHeader hideMenu navigation={navigation} business={businees}
                                            businessLogo={businees.logo}
                                            businessName={businees.name}/>
                        </View>


                        <View
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
                        </View>

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

