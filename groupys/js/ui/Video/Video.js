import React, {Component} from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

import Video from 'react-native-video';
let styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default class RNVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
           paused     : this.value(props.paused, true),
           muted      : this.value(props.muted, true),
           repeat     : this.value(props.repeat, true),
           rate       : this.value(props.rate, 1),
           volume     : this.value(props.volume, 1),
           resizeMode : this.value(props.resizeMode, 'cover'),
           width      : this.value(props.width, 320),
           height     : this.value(props.height, 240),
           rnVideoRef : null
        };

    }

    value(property, valueIfUndefined){
        return (property === null || typeof property === 'undefined') ? valueIfUndefined : property
    }

    visible(isVisible) {
        console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
        this.state.paused = !isVisible;
    }

    onPress() {
        this.state.paused = !this.state.paused;
    }

    render() {
        return (
            <VisibilitySensor onChange={this.visible}>
                <TouchableOpacity width={this.state.width}
                                  height={this.state.height}
                                  onPress={this.onPress}
                                  style={{backgroundColor:'red'}}>
                    <Text>{this.state.paused? 'paused' : 'playing'}</Text>

                    <Video
                        style={{backgroundColor:'blue'}}
                        width={320}
                        height={180}
                        rate={1} volume={1} muted={true}
                        resizeMode="cover" repeat={true} key="video1"
                        paused={false}
                        source={{uri:'https://dhs9y2fxkp0xy.cloudfront.net/videos/small.mp4'}}
                    />
                </TouchableOpacity>
            </VisibilitySensor>
        )
    }
}

