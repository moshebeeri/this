import React, {Component} from 'react';
import {Dimensions, Keyboard, TextInput, View} from 'react-native';
import Icon2 from "react-native-vector-icons/Entypo";
import {Button, Icon, Input} from 'native-base';
import EmojiPicker from "../emojiPicker/emojiPicker"
import styles from './styles'
import strings from "../../i18n/i18n"

const {width, height} = Dimensions.get('window')
export default class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            showEmoji: false,
            iconEmoji: 'emoji-neutral'
        }
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    _keyboardDidShow(e) {
        let newSize = height - e.endCoordinates.height
        this.setState({
            keyboardOn: true,
            keyboardSize: newSize
        })
    }

    _keyboardDidHide() {
        this.setState({
            keyboardOn: false
        })
    }

    hideEmoji() {
        this.setState({
            showEmoji: false,
            iconEmoji: 'emoji-neutral'
        })
    }

    _onPressButton() {

        const {onPress} = this.props;
        if (this.state.message) {
            Keyboard.dismiss();

            onPress(this.state.message);
            this.setState({
                message: '',
                showEmoji:false,
            })
        }
    }
    focus() {
        this.refs['messageBox'].focus()
    }

    handlePick(emoji) {
        let message = this.state.message;
        this.setState({
            message: message + emoji,
        });
    }

    showEmoji() {
        let show = !this.state.showEmoji;
        if (show) {
            Keyboard.dismiss();
            this.setState({
                showEmoji: show,
                iconEmoji: "keyboard"
            })
        } else {
            this.focus();
            this.setState({
                showEmoji: show,
                iconEmoji: "emoji-neutral"
            })
        }
    }

    render() {
        let style = {
            width: width,
            height: 50,
        }
        if(this.state.showEmoji){
             style = {
                width: width,
                height: 250,
            }
        }
        return (
            <View style={style}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row'
                }}>
                    <Button onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize: 35, color: "#2db6c8"}} name={this.state.iconEmoji}/>
                    </Button>


                    <TextInput style={styles.textInputTextStyleWhite} value={this.state.message}
                               onFocus={this.hideEmoji.bind(this)}
                               blurOnSubmit={true} returnKeyType='done'
                               ref={'messageBox'}
                               onSubmitEditing={this._onPressButton.bind(this)}
                               underlineColorAndroid='transparent'
                               onChangeText={(message) => this.setState({message})} placeholder={strings.Message}/>


                    <Button onPress={() => this._onPressButton()} style={styles.icon} transparent>
                        <Icon style={{fontSize: 35, color: "#2db6c8"}} name='send'/>
                    </Button>
                </View>



                {this.state.showEmoji &&  <EmojiPicker onEmojiSelect={this.handlePick.bind(this)}/>}


            </View>
        );
    }
}




