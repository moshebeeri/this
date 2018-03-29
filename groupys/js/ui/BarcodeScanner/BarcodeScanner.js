import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import strings from "../../i18n/i18n"
import {ThisText} from '../index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
import StyleUtils from '../../utils/styleUtils';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class BarcodeScanner extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            showCamera: false
        }
    }

    showScanner() {
        this.props.navigation.navigate('BarcodeScannerComponent', {handleCode: this.handleCode.bind(this)})
    }

    handleCode(code) {
        const {handleCode} = this.props;
        if (handleCode) {
            handleCode(code);
        }
        this.setState({code: code})
    }

    render() {
        return <View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10
            }}>
                <ThisText style={{fontSize: StyleUtils.scale(14)}}>{strings.AssignBarcode}</ThisText>
                {this.state.code && <ThisText>{this.state.code.data}</ThisText>}
                <TouchableOpacityFix onPress={this.showScanner.bind(this)}>

                    <Icon size={StyleUtils.scale(35)} color={'#FA8559'} name='ios-barcode-outline'/>
                </TouchableOpacityFix>

            </View>

        </View>
    }
}

