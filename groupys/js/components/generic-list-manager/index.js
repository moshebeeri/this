import React, {Component} from 'react';
import {FlatList, Image, Platform} from 'react-native';
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
    Spinner,
    Thumbnail,
    Title,
    View
} from 'native-base';

class GenericListManager extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {rows, ItemDetail, actions, update, onEndReached, noRefresh} = this.props;
        if (noRefresh) {
            return (
                <Content style={{backgroundColor: '#dddddd'}}>

                    <FlatList
                        data={rows}
                        renderItem={ItemDetail}
                        extraData={update}
                    />

                </Content>
            )
        }
        const onEndActions = this.getOnEndAction(actions, onEndReached);
        return (

            <Content style={{backgroundColor: '#CACACA'}}>

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


