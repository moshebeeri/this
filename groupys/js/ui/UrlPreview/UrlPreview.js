import React, {Component} from 'react';
import {Image, Linking, View,TouchableOpacity} from 'react-native';
import LinkPreview from 'react-native-link-preview';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';
const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);

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
            image =
                <Image resizeMode="cover" style={{height: 80, width: 80}} source={{uri: this.state.data.images[0]}}/>
        }
        return <View
            style={{justifyContent: 'flex-start', alignItems: "center", paddingLeft: 5, paddingRight: 5, marginTop: 5}}>
            <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    {image}
                </View>
                <View style={{flex: 3, marginRight: 5, marginLeft: 5, marginRight: 5}}>
                    <ThisText numberOfLines={1} style={{fontWeight: 'bold'}}>{this.state.data.title}</ThisText>
                    <ThisText note={true} numberOfLines={2}>{this.state.data.description}</ThisText>
                    <ThisText numberOfLines={1} note={true}>{this.state.data.url}</ThisText>
                </View>

            </View>

            <View style={{width: StyleUtils.getWidth(), alignItems: "flex-start"}}>

                <TouchableOpacityFix style={{width:StyleUtils.getWidth(),alignItems:'center',justifyContent:'center'}}title={this.state.data.url} onPress={() => {
                    Linking.openURL(this.state.data.url)
                }}>
                    <ThisText style={{paddingLeft:10,color:'#0000EE'}}>{this.state.data.url}</ThisText>
                </TouchableOpacityFix>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ThisText>{this.state.postText}</ThisText>
            </View>

        </View>
    }
}
