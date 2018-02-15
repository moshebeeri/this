import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Fab,
    Header,
    Icon,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Thumbnail,
    Title,
    View
} from 'native-base';
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import GenericListGroupView from '../generic-list-manager/generic-list-group-view/index'
import GenericListManager from '../generic-list-manager/index'
import {getGroups} from '../../selectors/groupSelector'
import * as groupsAction from "../../actions/groups";
import {bindActionCreators} from "redux";

class Groups extends Component {
    constructor(props) {
        super(props);
    }

    onPressItem(item) {
        const {actions, navigation} = this.props;
        actions.touch(item._id);
        actions.listenForChat(item);
        navigation.navigate('GroupFeed', {group: item, role: 'admin'});
    }
    onPressMessageItem(item) {
        const {actions, navigation} = this.props;
        actions.touch(item._id);
        actions.listenForChat(item);
        navigation.navigate('GroupFeed', {chat:true,group: item, role: 'admin'});
    }
    shouldComponentUpdate(){
        if(this.props.currentScreen ==='home' && this.props.activeTab ==='groups'){
            return true;
        }
        return false;
    }

    renderItem(item) {
        const {navigation} = this.props;
        return <GenericListGroupView
            onPressItem={this.onPressItem.bind(this, item.item)}
            onPressMessageItem = {this.onPressMessageItem.bind(this,item.item)}
            item={item.item}
            navigation={navigation}
            index={item.index}
            key={item.index}
        />
    }

    navigateToAdd() {
        this.props.navigation.navigate('AddGroups')
    }

    componentWillMount() {
        const { groups} = this.props;
        if(!groups || groups.length === 0) {
            this.props.actions.fetchGroups();
        }
    }

    render() {
        const {update, groups, navigation, actions} = this.props;
        let icon = <Icon5 active color={"#FA8559"} size={25} name="plus"/>
        if (Platform.OS === 'ios') {
            icon = <Icon2 active size={40} name="ios-add"/>;
        }
        return (
            <View style={{flex: 1}}>
                <GenericListManager rows={groups} navigation={navigation} actions={actions} update={update}
                                    ItemDetail={this.renderItem.bind(this)}/>
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#2db6c8"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    {icon}

                </Fab>
            </View>
        );
    }
}

export default connect(
    state => ({
        groups: getGroups(state),
        update: state.groups.update,
        user: state.user.user,
        selectedTab:state.mainTab.selectedTab,
        currentScreen:state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
    })
)(Groups);



