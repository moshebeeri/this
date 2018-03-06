import React, {Component} from 'react';
import {FlatList} from 'react-native';
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

    renderItem(item) {
        const {navigation,  actions, groupActions,ItemDetail,setVisibleItem,onPressItem,onPressMessageItem,visibleItem} = this.props;
        let id = item.item.id;
        if (!id) {
            id = item.item._id;
        }
        return <ItemDetail
            key={id}
            index={item.item.index}
            onPressMessageItem={onPressMessageItem}
            setVisibleItem={setVisibleItem}
            visibleItem={visibleItem}
            groupActions={groupActions}
            navigation={navigation}
            onPressItem={onPressItem}
            item={item.item}
            actions={actions}/>
    }

    render() {
        const {rows,  actions, update, onEndReached, noRefresh} = this.props;
        if (noRefresh) {
            return (
                <Content style={{backgroundColor: '#dddddd'}}>

                    <FlatList
                        data={rows}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                    />

                </Content>
            )
        }
        const onEndActions = this.getOnEndAction(actions, onEndReached);
        return (

            <Content style={{backgroundColor: '#E6E6E6'}}>

                <FlatList
                    data={rows}
                    onEndReached={onEndActions}
                    renderItem={this.renderItem.bind(this)}
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


