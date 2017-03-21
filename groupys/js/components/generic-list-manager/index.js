import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GeneralComponentHeader from '../header/index';





const {
    replaceAt,
} = actions;

class GenericListManager extends Component {

    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };


    constructor(props) {
        super(props);
        this.state = {

            error: '',
            validationMessage: '',
            token: '',
            userId: '',
            ready: true,
            rowsView: []
        }
        ;




    }

    async fetchList(){
        try {
            let response = await this.props.api.getAll();
            this.setState({
                rowsView: response
            })

        }catch (error){
            console.log(error);
        }



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



    replaceRoute(route) {
        this.props.replaceAt(this.props.component, {key: route}, this.props.navigation.key);
    }


    componentWillMount(){
        this.fetchList();
    }

    render() {
        const { ItemDetail } = this.props.ItemDetail

        let index = 0
        let rows = undefined;
        if(this.state.rowsView.length > 0) {
             rows = this.state.rowsView.map((r, i) => {
                index++;
                return <this.props.ItemDetail key= {index} index={index} item={r} deleteProduct={this.deleteProduct.bind(this)}/>
            });
        }

        return (
            <Container>
                <Header
                    style={{ flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <GeneralComponentHeader title={this.props.title} current={this.props.component} to={this.props.addComponent} />
                </Header>
                <Content  style={{  backgroundColor: '#fff'}}>
                    { rows }
                </Content>
            </Container>
        );
    }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(GenericListManager);
