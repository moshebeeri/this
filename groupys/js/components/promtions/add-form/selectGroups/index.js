import React, {Component} from "react";
import {connect} from "react-redux";
import {Platform, Provider,View,ScrollView} from "react-native";
import {Container, Content, Text, Button, Body, Left, Footer, ListItem, Right, Thumbnail, CheckBox} from "native-base";
import * as groupsAction from "../../../../actions/groups";
import {bindActionCreators} from "redux";
import strings from "../../../../i18n/i18n"
import {I18nManager} from 'react-native';
import {FormHeader,GroupHeader} from '../../../../ui/index';
class SelectGroupsComponent extends Component {

    static navigationOptions = {
        header: null
    };


    constructor(props) {
        super(props);
        let selectCheckBox = new Array();
        for (i = 0; i < 100; i++) {
            selectCheckBox.push(false);
        }
        this.state = {
            selectCheckBox: selectCheckBox
        };
    }

    componentWillMount(){
        this.props.fetchBusinessGroups(this.props.navigation.state.params.bid)

    }
    selectGroup(group) {
        this.props.navigation.state.params.selectGroup(group)
        this.props.navigation.goBack();
    }

    selectCheckBox(index) {
        let selectCheckBoxes = this.state.selectCheckBox;
        selectCheckBoxes[index] = !this.state.selectCheckBox[index];
        this.setState({
            selectCheckBox: selectCheckBoxes
        })
    }

    saveFormData() {
        let selectedGroups = new Array();
        let selectedBool = this.state.selectCheckBox;
        this.props.groups['groups' + this.props.navigation.state.params.bid].forEach(function (group, i) {
            if (selectedBool[i + 1]) {
                selectedGroups.push(group);
            }
        })
        this.props.navigation.state.params.selectGroup(selectedGroups)
        this.props.navigation.goBack();
    }

    render() {
        let index = 0;
        let productsRows = undefined;
        if (this.props.groups && this.props.groups['groups' + this.props.navigation.state.params.bid]) {
            productsRows = this.props.groups['groups' + this.props.navigation.state.params.bid].map((r, i) => {
                index++;
                let group = r;


                return <View key={index} style={{borderBottomWidth:10,borderColor:'#cccccc', flexDirection:'row'}}>
                    <View style={{width:300}}>
                     <GroupHeader group = {group} />
                    </View>
                    <View style={{width:50,alignItems:'center',justifyContent:'center'}}>
                    <CheckBox onPress={this.selectCheckBox.bind(this, index)}
                              checked={this.state.selectCheckBox[index]}/>
                    </View>
                </View>});

        }
        return (
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <ScrollView style={{backgroundColor: '#fff'}}>
                    <FormHeader submitForm={this.saveFormData.bind(this)}  showBack navigation={this.props.navigation}
                                title={strings.SelectGroups} bgc="#FA8559"/>


                    {productsRows}

                </ScrollView>


            </View>



        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'SelectGroupsComponent') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        groups: state.groups,
        currentScreen: state.render.currentScreen,
    }),
    dispatch => bindActionCreators(groupsAction, dispatch)
)(SelectGroupsComponent);
