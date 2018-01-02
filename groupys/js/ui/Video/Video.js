import React, {Component} from 'react';
import InViewPort from '../../utils/inviewport'
import {TouchableOpacity,View,StyleSheet,WebView} from 'react-native';
import Video from 'react-native-video';
//import YouTube from 'react-native-youtube'
const style = {
    padding: StyleSheet.hairlineWidth,
    width : 300,
    height:200,
    backgroundColor: 'orange',
}
//
// const App = () => (
//     <YouTube
//         apiKey="AIzaSyACe_Cci4drnZovD8xjJOdrsIOQwyWSyCg"
//         play
//         controls={2}
//         fs
//         hidden={false}
//         videoId="hrbI08iulzA"
//         style={style}
//     />
// )
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
            url: this.value({uri: props.url}),
            ref: props.ref,
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
            <View style={{width:this.state.width,height:this.state.height}}>
                {
                    this.state.source === 'THIS' &&
                <TouchableOpacity
                    width={this.state.width}
                    height={this.state.height}
                    onPress={this.onPress.bind(this)}
                    style={{}}>

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
                                source={this.state.url}
                            />


                    {/*<Text>{this.state.paused? 'paused' : 'playing'}</Text>*/}
                </TouchableOpacity> }
                {this.state.source === 'YOUTUBE'&& <WebView style={{width:this.state.width,height:this.state.height}}source={{ uri: `https://www.youtube.com/embed/${this.state.videoId}?version=3&autoplay=1&showinfo=0&controls=0&modestbranding=1&fs=1&rel=0` }} />}

            </View>
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
