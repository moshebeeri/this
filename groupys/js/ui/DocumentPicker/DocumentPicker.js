import React, {Component} from 'react';
import {View} from 'react-native';
import {Icon} from 'native-base';
import styles from './styles';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {ImagePicker, ThisText} from '../index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StyleUtils from '../../utils/styleUtils';

export default class DocumentPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
            document: ''
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory, value} = this.props;
        if (isMandatory) {
            if (!this.state.document) {
                if (!value) {
                    this.setState({
                        invalid: true
                    })
                    return false;
                }
            }
        }
        return true;
    }

    onSubmit() {
        const {onSubmitEditing, validateContent, value} = this.props;
        if (validateContent) {
            if (!validateContent(value)) {
                this.setState({
                    invalid: true
                })
                return;
            }
        }
        if (onSubmitEditing) {
            onSubmitEditing();
        }
    }

    onChange(text) {
        const {onChangeText} = this.props;
        this.setState({
            invalid: false
        })
        onChangeText(text);
    }

    setDocument(document) {
        const {setDocument} = this.props;
        this.setState({
            document: document
        })
        setDocument(document)
    }

    render() {
        const {fieldColor, field, isMandatory, value} = this.props;
        let textStyle = styles.textInputTextStyle;
        let mandatoryIconColor = 'red';
        if (fieldColor === 'white') {
            textStyle = styles.textInputTextStyleWhite;
            mandatoryIconColor = 'black';
        }
        let containerStyle = styles.textInputNoFiledContainer;
        if (field) {
            containerStyle = styles.textInputContainer;
        }
        let iconColor = '#FA8559';
        if (this.state.invalid) {
            iconColor = 'red';
        }
        if (this.state.document || value) {
            iconColor = 'green';
        }
        let imageRef = "logoImage" + field;
        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>
                <View style={{flexDirection: 'row'}}>
                    <ThisText style={textStyle}>{field}</ThisText>
                    {field && isMandatory &&
                    <MaterialCommunityIcons
                        style={{marginLeft: 3, marginTop: 4, color: 'red', fontSize: StyleUtils.scale(8)}}
                        name='asterisk'/>}

                </View>
                <View style={{marginRight: 10}}>
                    <ImagePicker logo name={imageRef} mandatory
                                 image={<Icon2 size={StyleUtils.scale(35)} color={iconColor}
                                               name='ios-document-outline'/>}
                                 color='black' pickFromCamera
                                 setImage={this.setDocument.bind(this)}/>
                </View>
            </View>

        </View>
    }
}
