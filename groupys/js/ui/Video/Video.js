import React, {Component} from 'react';
import InViewPort from '../../utils/inviewport'
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube'

export default class RNVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: this.value(props.paused, true),
            muted: this.value(props.muted, true),
            repeat: this.value(props.repeat, true),
            rate: this.value(props.rate, 1),
            volume: this.value(props.volume, 1),
            resizeMode: this.value(props.resizeMode, 'cover'),
            width: this.value(props.width, 320),
            height: this.value(props.height, 180),
            rnVideoRef: null,
            // YouTube
            source: this.value(props.source, 'THIS'),
            videoId: this.value(props.videoId, null),

        };
    }

    value(property, valueIfUndefined) {
        return (property === null || typeof property === 'undefined') ? valueIfUndefined : property
    }

    visible(isVisible) {
        console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
        this.setState({paused: !isVisible});
    }

    onPress() {
        this.setState({paused: !this.state.paused});
        console.log(`onPress this.state.paused=${this.state.paused}`);
    }

    render() {
        console.log(`render this.state.paused=${this.state.paused}`);
        return (
            <InViewPort onChange={this.visible.bind(this)}
                              partialVisibility={true}>

                <TouchableOpacity width={this.state.width}
                                  height={this.state.height}
                                  onPress={this.onPress.bind(this)}
                                  style={{backgroundColor: 'red'}}>
                    {
                        this.state.source === 'THIS' ?
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
                                style={{backgroundColor: 'transparent'}}
                                source={this.props.source}
                            />
                            : this.state.source === 'YOUTUBE' ?
                            <YouTube
                                videoId={this.state.videoId}
                                play={!this.state.paused}
                                fullscreen={false}
                                showFullscreenButton={false}
                                loop={false}
                                controls={0}
                                showinfo={false}
                                /*
                                    onReady={e => this.setState({ isReady: true })}
                                    onChangeState={e => this.setState({ status: e.state })}
                                    onChangeQuality={e => this.setState({ quality: e.quality })}
                                    onError={e => this.setState({ error: e.error })}
                                */
                                style={{alignSelf: 'stretch', height: this.state.height}}
                            />
                            : null
                    }
                    {/*<Text>{this.state.paused? 'paused' : 'playing'}</Text>*/}
                </TouchableOpacity>
            </InViewPort>
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
