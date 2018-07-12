import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker'
import strings from "../../i18n/i18n"
import {ImageController, ThisText} from '../../ui/index';
import StyleUtils from '../../utils/styleUtils';
const Images = ["basket_bakground.jpg",
    "blackfabrique_background.jpg",
    "blueglass_background.jpg",
    "bread_background.jpg",
    "metal_background.jpg",
    "Spruce_backgrouns.jpg",
    "stow_background.jpg",
    "sunflower_background.jpg",
    "sweets_background.jpg",
    "thisnetwork_background.png",
    "wofer_background.jpg",
    "wood_background.jpg"]
export default class ImagePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: false,
            invalid: false,
            name: this.props.name,
            time: new Date().getTime()
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    openMenu() {
        if (this.state.name) {
            this.refs[this.state.name + this.state.time].open();
        } else {
            this.refs["picker" + this.state.time].open();
        }
    }

    isValid() {
        const {mandatory, image} = this.props;
        if (mandatory) {
            if (!this.state.value && !image) {
                this.setState({
                    invalid: true
                });
                return false;
            }
        }
        return true;
    }

    async pickFromCamera() {
        const {setImage, imageWidth, imageHeight, logo, cropDisable} = this.props;
        let cropping = true;
        if (cropDisable) {
            cropping = false;
        }
        let width = 1920;
        let height = 1080;
        if (logo) {
            height = 1080;
            width = 1080;
        }
        try {
            let image = await ImagePicker.openCamera({
                mediaType: 'photo',
                cropping: cropping,
                width: width,
                height: height,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                value: true,
                invalid: false
            });
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    async pickVideo() {
        const {setVideo} = this.props;
        try {
            await ImagePicker.clean();
            let video = await ImagePicker.openPicker({
                mediaType: "video",
                cropping: false
            });
            setVideo(video);
        } catch (e) {
            console.log(e);
        }
    }

    pickDefault(url) {
        const {setImage} = this.props;
        setImage({path:url,inServer:true});
    }

    async pickPictureNoCropp() {
        const {setImage, imageWidth, imageHeight, logo, cropDisable} = this.props;
        let cropping = true;
        if (cropDisable) {
            cropping = false;
        }
        let width = 1920;
        let height = 1080;
        if (logo) {
            height = 1080;
            width = 1080;
        }
        try {
            let image = await ImagePicker.openPicker({
                cropping: false,
                mediaType: 'photo',
                width: width,
                height: height,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                value: true,
                invalid: false
            });
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

//w:1920 × h:1080
    async pickPicture() {
        const {setImage, imageWidth, imageHeight, logo, cropDisable} = this.props;
        let cropping = true;
        if (cropDisable) {
            cropping = false;
        }
        let width = 1920;
        let height = 1080;
        if (logo) {
            height = 1080;
            width = 1080;
        }
        try {
            let image = await ImagePicker.openPicker({
                cropping: cropping,
                mediaType: 'photo',
                width: width,
                height: height,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            this.setState({
                value: true,
                invalid: false
            });
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {color, image, video, customStyles, text, addDefault} = this.props;
        let cameraColor = '#003d99';
        if (color) {
            cameraColor = color;
        }
        let trigger = <Icon size={StyleUtils.scale(35)} color={cameraColor} name='camera'/>;
        if (text) {
            trigger = <View style={{flexDirection: 'row'}}>
                <Icon size={StyleUtils.scale(35)} color={cameraColor} name='camera'/>
                {text}
            </View>
        }
        if (image) {
            trigger = image;
        }
        if (this.state.invalid && !image) {
            trigger = <Icon size={StyleUtils.scale(35)} color={'red'} name='camera'/>;
        }
        let videoPickerOption;
        if (video) {
            videoPickerOption = <MenuOption onSelect={this.pickVideo.bind(this)}>
                <ThisText
                    style={{fontSize: StyleUtils.scale(14), padding: 10, paddingTop: 0}}>{strings.PickVideo}</ThisText>
            </MenuOption>
        }
        let name = "picker" + this.state.time;
        if (this.state.name) {
            name = this.state.name + this.state.time;
        }
        return <Menu ref={name} name={name}>
            <MenuTrigger customStyles={customStyles}>
                {trigger}
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={this.pickPictureNoCropp.bind(this)}>
                    <ThisText style={{
                        fontSize: StyleUtils.scale(14),
                        padding: 10,
                        paddingBottom: 0,
                        paddingTop: 10
                    }}>{strings.FastPick}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.pickFromCamera.bind(this)}>
                    <ThisText style={{
                        fontSize: StyleUtils.scale(14),
                        padding: 10,
                        paddingBottom: 5
                    }}>{strings.TakePictures}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.pickPicture.bind(this)}>
                    <ThisText style={{
                        fontSize: StyleUtils.scale(14),
                        padding: 10,
                        paddingTop: 5
                    }}>{strings.PickFromPhotos}</ThisText>
                </MenuOption>
                {addDefault && Images.map(image => { return <MenuOption onSelect={this.pickDefault.bind(this,'https://s3.amazonaws.com/thiscounts/backgrounds/' + image)}>
                    <View style={{flexDirection: 'row'}}>
                        <ImageController source={{uri: 'https://s3.amazonaws.com/thiscounts/backgrounds/'+ image}} thumbnail size={30} square/>
                    </View>
                </MenuOption>})}
                {videoPickerOption}

            </MenuOptions>
        </Menu>;
    }
}

