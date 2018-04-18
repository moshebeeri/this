import React, {Component} from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
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
        const {text, post} = this.props;
        try {
            if (post.textLinkPreview && post.textLinkPreview.url) {
                this.setState({urlFound: true, data: post.textLinkPreview})
                let textWithoutLink = text.replace(post.textLinkPreview.url, '');
                this.setState({postText: textWithoutLink})
            } else {
                this.setState({urlFound: false})
            }
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
        let showText = true;
        if (!this.state.postText || (this.state.postText && !this.state.postText.trim())) {
            showText = false;
        }
        return <View
            style={{justifyContent: 'flex-start', alignItems: "center", paddingLeft: 5, paddingRight: 5, marginTop: 5}}>
            <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    {image}
                </View>
                <View style={{flex: 3, marginBottom: 5, marginLeft: 5, marginRight: 5}}>
                    <ThisText numberOfLines={1} style={{fontWeight: 'bold'}}>{this.state.data.title}</ThisText>
                    <ThisText note={true} numberOfLines={2}>{this.state.data.description}</ThisText>
                    <TouchableOpacityFix style={{alignItems: 'flex-start', justifyContent: 'center'}}
                                         title={this.state.data.url} onPress={() => {
                        Linking.openURL(this.state.data.url)
                    }}>
                        <ThisText style={{color: '#0000EE'}} numberOfLines={1}>{this.state.data.url}</ThisText>
                    </TouchableOpacityFix>
                </View>

            </View>

            {showText && <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ThisText>{this.state.postText}</ThisText>
            </View>}

        </View>
    }
}
