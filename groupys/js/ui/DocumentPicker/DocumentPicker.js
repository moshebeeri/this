import React, {Component} from 'react';
import {Dimensions, I18nManager, Text, TextInput, View} from 'react-native';
import {Icon} from 'native-base';
import styles from './styles';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {ImagePicker} from '../index';

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
        const {isMandatory, validateContent, invalid} = this.props;
        if (invalid) {
            this.setState({
                invalid: true
            })
            return false
        }
        if (isMandatory) {
            if (!this.state.document) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        if (validateContent) {
            if (!validateContent(value)) {
                this.setState({
                    invalid: true
                })
                return false
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
        const {fieldColor, field, isMandatory,} = this.props;
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
        if(this.state.invalid){
            iconColor = 'red';
        }
        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>
                <View style={{flexDirection:'row'}}>
                    <Text style={textStyle}>{field}</Text>
                    {field && isMandatory &&
                    <Icon style={{margin: 5, color: mandatoryIconColor, fontSize: 12}} name='star'/>}

                </View>
                <View style={{marginRight:10}}>
                    <ImagePicker logo ref={"logoImage"} mandatory
                                 image={<Icon2 size={35} color={iconColor} name='ios-document-outline'/>}
                                 color='black' pickFromCamera
                                 setImage={this.setDocument.bind(this)}/>
                </View>
            </View>

        </View>
    }
}
