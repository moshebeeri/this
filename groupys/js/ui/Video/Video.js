import React, {Component} from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

import Video from 'react-native-video';

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
           height     : this.value(props.height, 180),
           rnVideoRef : null
        };

    }

    value(property, valueIfUndefined){
        return (property === null || typeof property === 'undefined') ? valueIfUndefined : property
    }

    visible(isVisible) {
        console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
        this.setState( {paused: !isVisible});
    }

    onPress() {
        this.setState( {paused: !this.state.paused});
        console.log(`onPress this.state.paused=${this.state.paused}`);
    }

    render() {
        console.log(`render this.state.paused=${this.state.paused}`);
        return (
            <VisibilitySensor onChange={this.visible.bind(this)}>
                <TouchableOpacity width={this.state.width}
                                  height={this.state.height}
                                  onPress={this.onPress.bind(this)}
                                  style={{backgroundColor:'red'}}>
                    {/*<Text>{this.state.paused? 'paused' : 'playing'}</Text>*/}
                    <Video
                        ref={(ref) => {
                            this.state.rnVideoRef = ref
                        }}
                        width={this.state.width}
                        height={this.state.height}
                        rate={this.state.rate}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={this.state.repeat}
                        key={this.props.key}
                        paused={this.state.paused}
                        style={{backgroundColor:'transparent'}}
                        source={this.props.source}
                    />

                </TouchableOpacity>
            </VisibilitySensor>
        )
    }
}
/*
                    <Video
                        style={{backgroundColor:'blue'}}
                        width={320}
                        height={180}
                        rate={1} volume={1} muted={true}
                        resizeMode="cover" repeat={true} key="video1"
                        paused={this.state.paused}
                        source={{uri:'https://dhs9y2fxkp0xy.cloudfront.net/videos/small.mp4'}}
                    />

 */
