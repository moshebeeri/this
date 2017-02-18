import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import navigateTo from '../../../actions/sideBarNav';
import {actions} from 'react-native-navigation-redux-helpers';

//import ImagePicker from 'react-native-image-crop-picker';


const {
    popRoute,
} = actions;

import {
    Container,
    Header,
    Content,
    Text,
    Button,
    Icon,
    Image,
    Card,
    CardItem,
    Thumbnail,
    TouchableOpacity
} from 'native-base';


class FormTests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
        }
    }

    popRoute() {
        this.props.popRoute(this.props.navigation.key);
    }

    openImagePicker() {
        // ImagePicker.openPicker({
        //     multiple: true
        // }).then(images => {
        //     console.log(images);
        // });
    }


    render() {
        return (
            <Container>
                <Content>
                    <Header>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name="ios-arrow-round-back-outline"
                                  style={{ fontSize: 30, lineHeight: 32, paddingRight: 10 }}/>
                            Business
                        </Button>
                    </Header>
                    <ScrollView keyboardShouldPersistTaps={true} style={{paddingLeft:10,paddingRight:10}}>
                        <Text>Blah blah blah</Text>
                        <Button onPress={() => this.openImagePicker()}>
                            select images
                        </Button>

                    </ScrollView>
                </Content>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: key => dispatch(popRoute(key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(FormTests);
