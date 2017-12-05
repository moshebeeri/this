import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker'
import strings from "../../i18n/i18n"
export default class ImagePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state= {
            value:false,
            invalid: false
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid(){
        const { mandatory,image} = this.props;

        if(mandatory){

            if(!this.state.value && !image){
                this.setState({
                    invalid: true
                })
                return false;
            }
        }
        return true;
    }
    async pickFromCamera() {
        const {setImage,imageWidth,imageHeight,logo} = this.props;
        let width = 2000;
        if(imageWidth){
            width = imageWidth;
        }

        let height = 1400;
        if(imageWidth){
            height = imageHeight;
        }
        if(logo){
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
                value:true,
                invalid: false
            })
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    async pickPicture() {
        const {setImage,imageWidth,imageHeight,logo} = this.props;
        let width = 2000;
        if(imageWidth){
            width = imageWidth;
        }
        let height = 1400;
        if(imageWidth){
            height = imageHeight;
        }
        if(logo){
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
                value:true,
                invalid: false
            })
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { color,image} = this.props;
        let cameraColor = '#003d99';
        if (color) {
            cameraColor = color;
        }

        let trigger = <Icon size={35} color={cameraColor} name='camera'/>;
        if(image){
            trigger = image;
        }

        if(this.state.invalid && !image){
            trigger = <Icon size={35} color={'red'} name='camera'/>;
        }
        return <Menu>
            <MenuTrigger>
                {trigger}
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.pickFromCamera.bind(this)}>
                    <Text>{strings.TakePictures}</Text>
                </MenuOption>
                <MenuOption onSelect={this.pickPicture.bind(this)}>
                    <Text>{strings.PickFromPhotos}</Text>
                </MenuOption>

            </MenuOptions>
        </Menu>;
    }
}

