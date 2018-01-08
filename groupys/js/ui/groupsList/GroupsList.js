import React, {Component} from "react";
import {Image, ScrollView, TouchableOpacity, View} from "react-native";
import {Button, Input, Item, Spinner, Text} from "native-base";
import styles from "./styles";
import {SubmitButton,GroupHeader} from '../../ui/index';
import strings from '../../i18n/i18n';


export default class GroupsList extends Component {
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
        const {group} = this.props;
        this.props.navigation.navigate('ReadQrCode', {group: group});
    }

    back() {
        this.props.navigation.goBack();
    }

    createView() {
        const {groups,joinGroup} = this.props;

        let navigation = this.props.navigation;
        let rows = undefined;
        if (groups && groups.length > 0) {
            rows = groups.map(function (group) {



                return <View key={group._id} style={{padding: 5, backgroundColor: '#eaeaea'}}>
                    <View style={{
                        flex: -1,
                        padding: 5,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent:'space-between'
                    }}>
                        <View style={{flex:2,backgroundColor:'red'}}>
                            <GroupHeader group={group}/>
                        </View>


                        <View
                            style={{flex:1,marginTop:10,marginLeft: 20, height:50,flexDirection: 'row', width: 120, alignItems: 'center',}}>
                           <SubmitButton  color='#2db6c8'title={strings.Join} onPress={() => joinGroup(group._id, navigation)} />
                        </View>

                    </View>
                </View>
            })


        }else{
            rows = <View style={styles.noResults}><Text>{strings.NoResultsFound}</Text></View>
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

