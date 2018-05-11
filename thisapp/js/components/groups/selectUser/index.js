import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Body,
    Button,
    CheckBox,
    Container,
    Content,
    Footer,
    Header,
    Icon,
    Input,
    InputGroup,
    Item,
    Left,
    ListItem,
    Picker,
    Right,
    Thumbnail,
    View
} from 'native-base';
import {getUserFollowesr} from '../../../selectors/userSelector'
import {bindActionCreators} from "redux";
import * as selectUserAction from "../../../actions/selectUsers";
import {FormHeader, ImageController, ThisText} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import StyleUtils from '../../../utils/styleUtils';

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
        let users = userFollower;
        if(this.props.navigation.state.params.users){
            users = this.props.navigation.state.params.users;
        }
        let selectedUsers = new Array();
        let selectedBool = this.state.selectCheckBox;
        users.forEach(function (user, i) {
            if (selectedBool[i + 1]) {
                selectedUsers.push(user);
            }
        })
        this.props.navigation.state.params.selectUsers(selectedUsers);
        this.props.navigation.goBack();
    }

    render() {
        const {userFollower} = this.props;
        let users = userFollower;
        if(this.props.navigation.state.params.users){
            users = this.props.navigation.state.params.users;
        }
        let index = 0;
        let productsRows = users.map((r, i) => {
            index++;
            if (r.pictures && r.pictures.length > 0) {
                let path = r.pictures[r.pictures.length - 1].pictures[0];
                return <ListItem key={index} onPress={this.selectCheckBox.bind(this, index, r)} thumbnail>
                    <Left>

                        <ImageController thumbnail size={StyleUtils.scale(50)} source={{uri: path}}/>
                    </Left>
                    <Body>
                    <ThisText style={{fontSize: StyleUtils.scale(14)}}>{r.name}</ThisText>
                    <ThisText style={{fontSize: StyleUtils.scale(14)}} note>{r.phone_number}</ThisText>

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
                    <ImageController thumbnail size={StyleUtils.scale(50)} source={require('../../../../images/client_1.png')}/>
                </Left>
                <Body>

                <ThisText style={{fontSize: StyleUtils.scale(14)}}>{r.name}</ThisText>
                <ThisText style={{fontSize: StyleUtils.scale(14)}} note>{r.phone_number}</ThisText>

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
                                submitForm={this.saveFormData.bind(this)} title={strings.SelectUsers} bgc="#2db6c8"/>

                    {productsRows}


                </Content>

            </Container>


        );
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'SelectUsersComponent') {
            return true;
        }
        return false;
    }
}

const mapStateToProps = state => {
    return {
        userFollower: getUserFollowesr(state),
        currentScreen: state.render.currentScreen,
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(selectUserAction, dispatch),
    })
)(SelectUsersComponent);



