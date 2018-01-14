import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Platform
} from 'react-native'
import {
    Container, Content, Text, InputGroup, Input, Button, Body, Icon, Left,
    View, Header, Item, Footer, Picker, ListItem, Right, Thumbnail, CheckBox
} from 'native-base';
import {getUserFollowesr} from '../../../selectors/userSelector'
import {bindActionCreators} from "redux";
import * as selectUserAction from "../../../actions/selectUsers";
import {FormHeader, TextInput} from '../../../ui/index';
import strings from "../../../i18n/i18n"
class SelectUsersComponent extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props) {
        super(props);
        let selectCheckBox = this.props.userFollower.map(function (user) {
            return false
        });
        this.state = {
            selectCheckBox: selectCheckBox
        };
    }

    selectCheckBox(index, user) {
        const {userFollower, actions} = this.props;
        let selectCheckBoxes = this.state.selectCheckBox;
        selectCheckBoxes[index] = !this.state.selectCheckBox[index];
        this.setState({
            selectCheckBox: selectCheckBoxes
        })
    }

    saveFormData() {
        const {userFollower} = this.props;
        let selectedUsers = new Array();
        let selectedBool = this.state.selectCheckBox;
        userFollower.forEach(function (user, i) {
            if (selectedBool[i + 1]) {
                selectedUsers.push(user);
            }
        })
        this.props.navigation.state.params.selectUsers(selectedUsers);
        this.props.navigation.goBack();
    }

    render() {
        const {userFollower} = this.props;
        let index = 0;
        let productsRows = userFollower.map((r, i) => {
            index++;
            if (r.pictures && r.pictures.length > 0) {
                let path = r.pictures[r.pictures.length - 1].pictures[0];
                return <ListItem key={index} onPress={this.selectCheckBox.bind(this, index, r)} thumbnail>
                    <Left>

                        <Thumbnail size={80} source={{uri: path}}/>
                    </Left>
                    <Body>
                    <Text>{r.name}</Text>
                    <Text note>{r.phone_number}</Text>

                    </Body>
                    <Right>

                        <CheckBox onPress={this.selectCheckBox.bind(this, index, r)}
                                  checked={this.state.selectCheckBox[index]}/>
                    </Right>
                </ListItem>
            }
            return <ListItem key={index} onPress={this.selectCheckBox.bind(this, index, r)} thumbnail
                             style={{backgroundColor: '#fff'}}>
                <Left>
                    <Thumbnail square size={80} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <Text>{r.name}</Text>
                <Text note>{r.phone_number}</Text>
                </Body>
                <Right>
                    <CheckBox onPress={this.selectCheckBox.bind(this, index, r)}
                              checked={this.state.selectCheckBox[index]}/>
                </Right>
            </ListItem>
        });
        return ( <Container>
                <Content style={{backgroundColor: '#fff'}}>


                    <FormHeader showBack navigation={this.props.navigation}
                                submitForm={this.saveFormData.bind(this)}title={strings.SelectUsers} bgc="#2db6c8"/>

                    {productsRows}


                </Content>

            </Container>


        );
    }

    shouldComponentUpdate(){
        if(this.props.currentScreen ==='SelectUsersComponent' ){
            return true;
        }
        return false;
    }
}

const mapStateToProps = state => {
    return {
        userFollower: getUserFollowesr(state),
        currentScreen:state.render.currentScreen,
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(selectUserAction, dispatch),
    })
)(SelectUsersComponent);



