import React, {Component} from "react";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import Camera from "react-native-camera";
import styles from "./styles";
import {FormHeader} from "../index"
import strings from "../../i18n/i18n"
export default class BarcodeScannerComponent extends Component {
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

    scanBarcode(scanCode) {

        console.log(scanCode);
        this.props.navigation.state.params.handleCode(scanCode);
        this.props.navigation.goBack();
    }



    render() {
        return <View>
            <FormHeader showBack navigation={this.props.navigation}
                        bgc="#FA8559"title={strings.ScanBarcode}/>

            <View style={styles.payment_camera_container}><Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                onBarCodeRead={this.scanBarcode.bind(this)}
                style={styles.payment_camera}
                aspect={Camera.constants.Aspect.fill}>
            </Camera>


            </View>
        </View>
    }
}

