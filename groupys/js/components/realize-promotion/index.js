import React, {Component} from 'react';
import {connect} from 'react-redux';

import {View, Text, Icon, List, ListItem, Content} from 'native-base';


import store from 'react-native-simple-store';
import PromotionApi from '../../api/promotion'

let promotionApi = new PromotionApi()
export default class RealizePromotion extends Component {


    constructor(props) {
        super(props);

        this.state = {
            code: '',


        };
    }
    async componentWillMount(){



    }

    async realize(){
       let respone  = await promotionApi.realizePromotion(this.state.code);

        this.props.navigation.goBack();
    }




    render() {
        return (
            <Container>
            <Content style={{backgroundColor: '#fff'}}>
                <Input autoFocus = {true} blurOnSubmit={true} returnKeyType='done'   value={this.state.code} onChangeText={(code) => this.setState({code})}
                       placeholder='Code'/>


            </Content>
                <Footer>

                    <Button transparent
                            onPress={this.realize.bind(this)}
                    >
                        <Text>Realize code</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}
