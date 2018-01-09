import React, {Component} from "react";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import strings from "../../i18n/i18n"
const {width, height} = Dimensions.get('window')
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
                <Text>{strings.AssignBarcode}</Text>
                {this.state.code && <Text>{this.state.code.data}</Text>}
                <TouchableOpacity onPress={this.showScanner.bind(this)}>

                    <Icon size={35} color={'#FA8559'} name='ios-barcode-outline'/>
                </TouchableOpacity>

            </View>

        </View>
    }
}

