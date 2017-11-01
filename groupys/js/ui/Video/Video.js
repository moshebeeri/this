import React, {Component} from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

const RNVideo = require('react-native-video');
let styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default class Video extends Component {
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
{/*
                    <RNVideo
                        ref={(ref) => {
                            this.state.rnVideoRef = ref
                        }}
                        rate={this.state.rate}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={this.state.repeat}
                        key={this.props.key}
                        paused={this.state.paused}
                        style={styles.backgroundVideo}
                        source={this.props.source}
                    />
*/}
                </TouchableOpacity>
            </VisibilitySensor>
        )
    }
}

