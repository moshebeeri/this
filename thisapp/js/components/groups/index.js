import React, {Component} from 'react';
import {Platform} from 'react-native';
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
import navigationUtils from '../../utils/navigationUtils'

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        }
    }

    onPressItem(item) {
        const {actions, navigation} = this.props;
        actions.touch(item._id);
        navigationUtils.doNavigation(navigation, 'GroupFeed', {group: item, role: 'admin'});
    }

    onPressMessageItem(item) {
        const {actions, navigation} = this.props;
        actions.touch(item._id);
        navigationUtils.doNavigation(navigation, 'GroupFeed', {chat: true, group: item, role: 'admin'});
    }

    shouldComponentUpdate() {
        return this.props.isMain;
    }

    navigateToAdd() {
        navigationUtils.doNavigation(this.props.navigation, 'AddGroups');
    }

    componentWillMount() {
        const {groups} = this.props;
        this.props.actions.fetchGroups();
    }

    refreshTop() {
        this.setState({refreshing: true});
        // this.props.actions.fetchGroups();
        this.setState({refreshing: false});
    }

    render() {
        const {update, groups, navigation, actions, visibleItem} = this.props;
        let icon = <Icon5 active color={"#FA8559"} size={25} name="plus"/>
        if (Platform.OS === 'ios') {
            icon = <Icon2 active size={40} name="ios-add"/>;
        }
        return (
            <View style={{flex: 1}}>
                <GenericListManager rows={groups} navigation={navigation} actions={actions} update={update}
                                    setVisibleItem={actions.setVisibleItem}
                                    visibleItem={visibleItem}
                                    refreshing={this.state.refreshing}
                                    onRefreshing={this.refreshTop.bind(this)}
                                    onPressItem={this.onPressItem.bind(this)}
                                    onPressMessageItem={this.onPressMessageItem.bind(this)}
                                    ItemDetail={GenericListGroupView}/>
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
        isMain: state.render.isMain,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
    })
)(Groups);



