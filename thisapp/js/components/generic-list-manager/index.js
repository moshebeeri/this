import React, {Component} from 'react';
import {FlatList, Platform} from 'react-native';
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
import {ListEmptyDisplay} from "../../ui/index";

class GenericListManager extends Component {
    constructor(props) {
        super(props);
    }

    renderItem(item) {
        const {navigation, user, business, businessId, actions, groupActions, ItemDetail, setVisibleItem, onPressItem, onPressMessageItem, visibleItem, location,rows} = this.props;
        let id = item.item.id;
        if (!id) {
            id = item.item._id;
        }
        let index = item.item.index;
        if (!index) {
            index = id;
        }
        return <ItemDetail
            key={id}
            rows={rows}
            user={user}
            business={business}
            index={index}
            businessId={businessId}
            onPressMessageItem={onPressMessageItem}
            setVisibleItem={setVisibleItem}
            visibleItem={visibleItem}
            groupActions={groupActions}
            navigation={navigation}
            location={location}
            onPressItem={onPressItem}
            item={item.item}
            actions={actions}/>
    }

    render() {
        const {rows, actions, update, onEndReached, noRefresh, refreshing, onRefreshing} = this.props;
        if (!rows || (rows && rows.length === 0)) {
            return <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${appBackgroundColor}`
            }}>
                <ListEmptyDisplay/>
            </View>
        }
        if (noRefresh) {
            return (
                <View style={{ flex: 1,backgroundColor: `${appBackgroundColor}`}}>


                    <FlatList
                        ref='flatList'
                        data={rows}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                        refreshing={refreshing}
                        onRefresh={onRefreshing}
                        removeClippedSubviews={Platform.OS === 'android'}
                    />

                </View>
            )
        }
        const onEndActions = this.getOnEndAction(actions, onEndReached);
        return (

            <View style={{flex: 1,backgroundColor: `${appBackgroundColor}`}}>

                <FlatList
                    ref='flatList'
                    data={rows}
                    onEndReached={onEndActions}
                    refreshing={refreshing}
                    onRefresh={onRefreshing}
                    renderItem={this.renderItem.bind(this)}
                    extraData={update}
                    removeClippedSubviews={Platform.OS === 'android'}
                />

            </View>

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


