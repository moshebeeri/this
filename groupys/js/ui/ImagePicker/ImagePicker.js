import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker'

export default class ImagePickerComponent extends Component {
    constructor(props) {
        super(props);
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    async pickFromCamera() {
        const {setImage} = this.props;
        try {
            let image = await ImagePicker.openCamera({
                cropping: true,
                width: 2000,
                height: 2000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    async pickPicture() {
        const {setImage} = this.props;
        try {
            let image = await ImagePicker.openPicker({
                cropping: true,
                width: 2000,
                height: 2000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
            });
            setImage(image)
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {show, color} = this.props;
        let cameraColor = '#003d99';
        if (color) {
            cameraColor = color;
        }
        if (show) {
            return <View/>;
        }
        return <Menu>
            <MenuTrigger>
                <Icon size={35} color={cameraColor} name='camera'/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.pickFromCamera.bind(this)}>
                    <Text>Take Pictures</Text>
                </MenuOption>
                <MenuOption onSelect={this.pickPicture.bind(this)}>
                    <Text>Pick From Photos</Text>
                </MenuOption>

            </MenuOptions>
        </Menu>;
    }
}

