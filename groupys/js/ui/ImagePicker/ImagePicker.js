import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker'

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
        const {setImage} = this.props;
        try {
            let image = await ImagePicker.openCamera({
                cropping: true,
                width: 2000,
                height: 2000,
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
        const {setImage} = this.props;
        try {
            let image = await ImagePicker.openPicker({
                cropping: true,
                width: 2000,
                height: 2000,
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

        if(this.state.invalid){
            trigger = <Icon size={35} color={'red'} name='camera'/>;
        }
        return <Menu>
            <MenuTrigger>
                {trigger}
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

