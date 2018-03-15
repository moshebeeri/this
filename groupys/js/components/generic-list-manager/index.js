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
        const {navigation, user, business,businessId,actions, groupActions,ItemDetail,setVisibleItem,onPressItem,onPressMessageItem,visibleItem,location} = this.props;
        let id = item.item.id;
        if (!id) {
            id = item.item._id;
        }
        let index = item.item.index;
        if(!index){
            index = id;
        }
        return <ItemDetail
            key={id}
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
        const {rows,  actions, update, onEndReached, noRefresh,refreshing,onRefreshing} = this.props;
        if (noRefresh) {
            return (
                <View style={{backgroundColor: '#dddddd'}}>


                    <FlatList
                        ref='flatList'
                        data={rows}
                        renderItem={this.renderItem.bind(this)}
                        extraData={update}
                        refreshing={refreshing}
                        onRefresh={onRefreshing}
                    />

                </View>
            )
        }
        const onEndActions = this.getOnEndAction(actions, onEndReached);
        return (

            <View style={{backgroundColor: '#E6E6E6'}}>

                <FlatList
                    ref='flatList'
                    data={rows}
                    onEndReached={onEndActions}
                    refreshing={refreshing}
                    onRefresh={onRefreshing}
                    renderItem={this.renderItem.bind(this)}
                    extraData={update}
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


