import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import styles from './styles'
import strings from "../../i18n/i18n"
import {ThisText} from '../index';
export default class ActivityActions extends Component {
    constructor(props) {
        super(props);

    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
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

    showFeedBack(){
        const {showActions,id} = this.props;
        showActions(true,id);
    }




    render() {


        const menu = <Menu>
            <MenuTrigger>
                <Icon2 style={{fontSize: 15}} name="options"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.showFeedBack.bind(this)}>
                    <ThisText>{strings.reportActivity}</ThisText>
                </MenuOption>


            </MenuOptions>
        </Menu>;

        return( <View>{menu}</View>)
    }
}

