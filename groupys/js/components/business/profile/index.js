import React, {Component} from 'react';
import {Image, Platform, TouchableOpacity} from 'react-native';
import {
    Container,
    Content,
    Text,
    Title,
    InputGroup,
    Input,
    Button,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Card,
    CardItem,
    Thumbnail,
    Left
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import styles from './styles'

export default class BusinessProfile extends Component {
    constructor(props) {
        super(props);
    }

    createView() {
        let banner = undefined;
        let bussiness = this.props.navigation.state.params.bussiness;
        if (bussiness.pictures && bussiness.pictures.length > 0) {
            banner = <View style={{padding: 10}}><Image style={{
                flex: -1,
                alignSelf: 'center',
                height: 70,
                width: 70,
                marginLeft: 10,
                borderWidth: 1,
                borderRadius: 80
            }} resizeMode="cover" source={{uri: bussiness.pictures[0].pictures[0]}}>


            </Image>

            </View>
        } else {
            banner = <Image
                style={{padding: 0, flex: -1, height: 300}}
                source={require('../../../../images/client_1.png')}>
            </Image>
        }
        return ( <View style={{padding: 5, backgroundColor: '#eaeaea'}}>
                <View style={{
                    flex: -1,
                    padding: 5,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {banner}

                    <Text style={{marginLeft: 10}}>{bussiness.name}</Text>
                    <View style={{marginLeft: 80, flex: -1, flexDirection: 'row', alignItems: 'center',}}>

                    </View>

                </View>


                <View style={{borderTopWidth: 2, borderColor: '#eaeaea', backgroundColor: 'white'}}
                      key={this.props.index}>


                    <View style={{height: 40, flexDirection: 'row', alignItems: 'center'}}>


                    </View>
                </View>

            </View>
        );
    }

    render() {
        return this.createView();
    }
}

