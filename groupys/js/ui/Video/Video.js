import React, {Component} from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';

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
        console.log(JSON.stringify(this.state));
        //this.onPress = this.onPress.bind(this);
    }

    value(property, valueIfUndefined){
        return (property === null || typeof property === 'undefined') ? valueIfUndefined : property
    }

    onVisibilityChanged(isVisible) {
        console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
        console.log(JSON.stringify(this.state));
        this.setState({paused: !isVisible});

    }

    onPress(state) {
        //console.log(JSON.stringify(state));
        this.setState({paused: !this.state.paused});
    }

    render() {
        return (
            <View style={{width:320,height:180,backgroundColor:'blue'}}>
            <Video
                rate={1} volume={1} muted={true}
                resizeMode="cover" repeat={true} key="video1"
                paused={false}
                style={styles.backgroundVideo}
                source={{uri:'https://archive.org/download/VideoSample-Video3/ArchitectVideo_512kb.mp4'}}
            />
            </View>
        )
    }
}

/*
        <VisibilitySensor onChange={this.onVisibilityChanged}>
                <TouchableOpacity onPress={this.onPress}
                                  style={{width:320, height:180, backgroundColor:'red'}}>
                    <Text>{this.state.paused? 'paused' : 'playing'}</Text>
                </TouchableOpacity>
            </VisibilitySensor>
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
*/
