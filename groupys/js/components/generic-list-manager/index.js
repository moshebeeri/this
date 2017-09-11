import React, {Component} from 'react';
import {Image, Platform,FlatList} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title,Fab, InputGroup, Input, Button, Icon, View,Header,Spinner, Body, Right, ListItem, Thumbnail,Left} from 'native-base';





class GenericListManager extends Component {


    constructor(props) {
        super(props);


    }


    async deleteProduct(index){

        try {
            await this.props.api.delete(index);
            let response = await this.props.api.getAll();
            this.setState({
                rowsView: response
            })

        }catch (error){
            console.log(error);
        }
    }





    componentWillMount(){




    }

    render() {
        const { rows,ItemDetail,actions,update} = this.props;

        return (

            <Content  style={{  backgroundColor: '#d7d7d7'}}>

                <FlatList
                    data={rows}
                    onEndReached={actions.onEndReached}
                    renderItem={ItemDetail}
                    extraData={update}
                />

            </Content>

        );

    }
}

export default connect(


)(GenericListManager);


