import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker'
import strings from "../../i18n/i18n"
import {ThisText} from '../../ui/index';

export default class ImagePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: false,
            invalid: false,
            name: this.props.name,
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    openMenu() {
        if (this.state.name) {
            this.refs[this.state.name].open();
        } else {
            this.refs["picker"].open();
        }
    }

    isValid() {
        const {mandatory, image} = this.props;
        if (mandatory) {
            if (!this.state.value && !image) {
                this.setState({
                    invalid: true
                })
                return false;
            }
        }
        return true;
    }

    async pickFromCamera() {
        const {setImage, imageWidth, imageHeight, logo} = this.props;
        let width = 2000;
        if (imageWidth) {
            width = imageWidth;
        }
        let height = 1400;
        if (imageWidth) {
            height = imageHeight;
        }
        if (logo) {
            height = 2000;
        }
        try {
            let image = await ImagePicker.openCamera({
                cropping: true,
                width: width,
                height: height,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                value: true,
                invalid: false
            })
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    async pickVideo() {
        const {setVideo} = this.props;
        try {
            let video = await ImagePicker.openPicker({
                mediaType: "video",
            });
            setVideo(video);
        } catch (e) {
            console.log(e);
        }
    }

    async pickPicture() {
        const {setImage, imageWidth, imageHeight, logo} = this.props;
        let width = 2000;
        if (imageWidth) {
            width = imageWidth;
        }
        let height = 1400;
        if (imageWidth) {
            height = imageHeight;
        }
        if (logo) {
            height = 2000;
        }
        try {
            let image = await ImagePicker.openPicker({
                cropping: true,
                width: width,
                height: height
                ,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                value: true,
                invalid: false
            })
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {color, image, video, customStyles, text} = this.props;
        let cameraColor = '#003d99';
        if (color) {
            cameraColor = color;
        }
        let trigger = <Icon size={35} color={cameraColor} name='camera'/>;
        if (text) {
            trigger = <View style={{flexDirection: 'row'}}>
                <Icon size={35} color={cameraColor} name='camera'/>
                {text}
            </View>
        }
        if (image) {
            trigger = image;
        }
        if (this.state.invalid && !image) {
            trigger = <Icon size={35} color={'red'} name='camera'/>;
        }
        let videoPickerOption;
        if (video) {
            videoPickerOption = <MenuOption onSelect={this.pickVideo.bind(this)}>
                <ThisText>{strings.PickVideo}</ThisText>
            </MenuOption>
        }
        let name = "picker";
        if (this.state.name) {
            name = this.state.name;
        }
        return <Menu ref={name} name={name}>
            <MenuTrigger customStyles={customStyles}>
                {trigger}
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.pickFromCamera.bind(this)}>
                    <ThisText style={{padding:10,paddingBottom:5}}>{strings.TakePictures}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.pickPicture.bind(this)}>
                    <ThisText style={{padding:10,paddingTop:5}}>{strings.PickFromPhotos}</ThisText>
                </MenuOption>
                {videoPickerOption}

            </MenuOptions>
        </Menu>;
    }
}

