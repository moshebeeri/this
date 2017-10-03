import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Button,
    Picker,
    Item,
    Icon,
    Header,
    Footer,
    View
} from 'native-base';
import AddFormHeader from '../header/addFormHeader';

const {
    replaceAt,
} = actions;
import login from './general-theme';
import GeneralApi from '../../api/general'
import GeneralComponentHeader from '../header/index';

let generalApi = new GeneralApi()
const types = [
    {
        value: 'Business',
        label: 'Global Discount'
    },
    {
        label: 'Feed',
        value: 'feeds'
    },
    {
        label: 'Contact',
        value: 'contacts'
    },
    {
        label: 'Groups',
        value: 'groups'
    },
    {
        label: 'Phone Books',
        value: 'phonebooks'
    },
];

class General extends Component {
    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {
            json: '',
            api: 'feeds',
            error: '',
            response: ''
        };
    }

    selectApi(api) {
        this.setState({
            api: api
        })
    }

    async sendRequest() {
        await this.setState({
            error: '',
            response: ''
        })
        try {
            let response = await generalApi.submitREqeust(this.state.api, this.state.json)
            await this.setState({
                response: JSON.stringify(response)
            })
        } catch (error) {
            this.setState({
                error: error.error
            })
        }
    }

    componentWillMount() {
    }

    replaceRoute(route) {
        this.props.replaceAt('login', {key: route}, this.props.navigation.key);
    }

    render() {
        let apiPikker = <Picker
            iosHeader="Select API"
            mode="dropdown"
            selectedValue={this.state.api}
            onValueChange={this.selectApi.bind(this)}>

            {
                types.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                })}
        </Picker>
        return (
            <Container>
                <Header
                    style={{
                        flexDirection: 'column',
                        height: 60,
                        elevation: 0,
                        paddingTop: (Platform.OS === 'ios') ? 20 : 3,
                        justifyContent: 'space-between',
                    }}
                >
                    <GeneralComponentHeader title="General API" current="general" to="home"/>
                </Header>

                <Content style={{backgroundColor: '#fff'}}>
                    <Item underline>
                        {apiPikker}
                    </Item>
                    <Item underline>
                        <Input multiline style={{height: 300}} onChangeText={(json) => this.setState({json})}
                               placeholder='Request'/>
                    </Item>

                    <Text>{this.state.error}</Text>
                    <Text>{this.state.response}</Text>


                </Content>
                <Footer>

                    <Button transparent
                            onPress={this.sendRequest.bind(this)}
                    >
                        <Text>Post Request</Text>
                    </Button>
                </Footer>
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
export default connect(mapStateToProps, bindActions)(General);
