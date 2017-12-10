import React, {Component} from "react";
import {connect} from "react-redux";
import {Platform, Provider} from "react-native";
import {Container, Content, Text, Button, Body, Left, Footer, ListItem, Right, Thumbnail, CheckBox} from "native-base";
import * as groupsAction from "../../../../actions/groups";
import {bindActionCreators} from "redux";
import strings from "../../../../i18n/i18n"
import {I18nManager} from 'react-native';
class SelectGroupsComponent extends Component {
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
                let image = undefined;
                if (group.pictures && group.pictures.length > 0) {
                    image = <Thumbnail square size={50} source={{uri: group.pictures[0].pictures[3]}}/>
                } else {
                    if (group.entity && group.entity.business) {
                        image =
                            <Thumbnail square size={50} source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
                    }
                }
                if (image) {
                    return <ListItem key={index} onPress={this.selectCheckBox.bind(this, index)} thumbnail>
                        <Left>
                            {!I18nManager.isRTL &&<CheckBox onPress={this.selectCheckBox.bind(this, index)}
                                                            checked={this.state.selectCheckBox[index]}/>}

                            {I18nManager.isRTL && image}
                        </Left>
                        <Body  style={{ alignItems: 'flex-start' , justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',}}>
                        <Text>{group.name}</Text>

                        </Body>
                        <Right>
                            {!I18nManager.isRTL && image}
                            {I18nManager.isRTL &&<CheckBox onPress={this.selectCheckBox.bind(this, index)}
                                                           checked={this.state.selectCheckBox[index]}/>}
                        </Right>
                    </ListItem>
                }
                return <ListItem key={index} onPress={this.selectCheckBox.bind(this, index)} thumbnail
                                 style={{backgroundColor: '#fff'}}>
                    <Left>
                        {!I18nManager.isRTL &&<CheckBox onPress={this.selectCheckBox.bind(this, index)}
                                                       checked={this.state.selectCheckBox[index]}/>}

                        {I18nManager.isRTL &&<Thumbnail square size={80} source={require('../../../../../images/client_1.png')}/>}
                    </Left>
                    <Body  style={{ alignItems: 'flex-start', justifyContent: I18nManager.isRTL ? 'flex-start' : 'flex-end',}}>

                    <Text>{group.name}</Text>

                    </Body>
                    <Right>
                        {I18nManager.isRTL &&<CheckBox onPress={this.selectCheckBox.bind(this, index)}
                                  checked={this.state.selectCheckBox[index]}/>}
                        {I18nManager.isRTL &&<Thumbnail square size={80} source={require('../../../../../images/client_1.png')}/>}

                    </Right>
                </ListItem>
            });
        }
        return (

            <Container>
                <Content style={{backgroundColor: '#fff'}}>


                    {productsRows}

                </Content>
                <Footer style={{backgroundColor: '#fff'}}>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>{strings.SelectGroups}</Text>
                    </Button>
                </Footer>
            </Container>


        );
    }
}

export default connect(
    state => ({
        groups: state.groups,
    }),
    dispatch => bindActionCreators(groupsAction, dispatch)
)(SelectGroupsComponent);
