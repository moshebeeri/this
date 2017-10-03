import React, {Component} from 'react';
import {Image, Platform, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    Title,
    Fab,
    InputGroup,
    Input,
    Button,
    Icon,
    View,
    Header,
    Spinner,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';

class GenericListManager extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {rows, ItemDetail, actions, update, onEndReached} = this.props;
        const onEndActions = this.getOnEndAction(actions, onEndReached)
        return (

            <Content style={{backgroundColor: '#d7d7d7'}}>

                <FlatList
                    data={rows}
                    onEndReached={onEndActions}
                    renderItem={ItemDetail}
                    extraData={update}
                />

            </Content>

        );
    }

    getOnEndAction(actions, onEndReached) {
        if (onEndReached) {
            return onEndReached;
        }
        return actions.onEndReached
    }
}

export default connect(
)(GenericListManager);


