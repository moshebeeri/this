import React, {Component} from 'react';
import {Button, Dimensions, I18nManager, Image, Linking, TextInput, View,Text} from 'react-native';

import LinkPreview from 'react-native-link-preview';
import StyleUtils from "../../utils/styleUtils";

export default class UrlPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlFound: false,
            data: {}
        }
    }

    async componentWillMount() {
        const {text} = this.props;
        try {
            let data = await LinkPreview.getPreview(text);
            this.setState({urlFound: true, data: data})
            let textWithoutLink = text.replace(data.url, '');
            this.setState({postText: textWithoutLink})
        } catch (error) {
            this.setState({urlFound: false})
        }
    }

    render() {
        if (!this.state.urlFound) {
            return <View/>;
        }
        let image = undefined;
        if (this.state.data.images && this.state.data.images[0]) {
            image = <Image resizeMode="cover" style={{height: 150}} source={{uri: this.state.data.images[0]}}/>
        }
        return <View style={{justifyContent: 'flex-start', alignItems: "center"}}>
            <View style={{backgroundColor: '#e5e3e3', flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    {image}
                </View>
                <View style={{flex: 3, marginRight: 5, marginLeft: 5, marginRight: 5}}>
                    <Text>{this.state.data.title}</Text>
                    <Text>{this.state.data.description}</Text>
                </View>

            </View>

            <View style={ {width:StyleUtils.getWidth(), alignItems: "flex-start"}}>

            <Button title={this.state.data.url} onPress={() => {
                Linking.openURL(this.state.data.url)
            }}/>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text>{this.state.postText}</Text>
            </View>

        </View>
    }
}
