import React, {Component} from 'react';
import {
    Button,
    Dimensions,
    I18nManager,
    Image,
    Linking,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    WebView
} from 'react-native';
import StyleUtils from "../../utils/styleUtils";
import strings from "../../i18n/i18n"
const bg = require('../../../images/bg.png');
export default class TermsOfUse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlFound: false,
            data: {}
        }
    }

    componentWillMount() {
    }

    acceptTerms() {
        const{acceptTerms} = this.props;
        acceptTerms();
    }

    declineTerms() {
        const{declineTerms} = this.props;
        declineTerms();
    }

    render() {

        return <View style={{
            backgroundColor: 'white',
            height: 150,
            borderWidth: 2,
            width: StyleUtils.getWidth() - 10,
            borderColor: '#cccccc',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: "center"
        }}>
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                height: 150,
                width: StyleUtils.getWidth() -10
            }}>
                <Image style={{position: 'absolute', height: 150, width: StyleUtils.getWidth() -10}}
                       resizeMode='cover' source={bg}/>

            </View>

            <View style={{
                marginTop: 10,

                flexDirection: 'row',
                backgroundColor:'transparent',
                width: StyleUtils.getWidth() - 30
            }}>
                <Text style={{flexWrap: 'wrap',color: 'white',backgroundColor:'transparent'}}> {strings.UseOfTermMessage}
                    <TouchableOpacity style={{width: 120, alignItems: 'center', justifyContent: 'center', height: 10}}
                                      onPress={() => Linking.openURL('https://creativecommons.org/terms/')}>
                        <Text style={{color: 'blue'}}>{strings.TermsofUse}</Text>
                    </TouchableOpacity>
                    <Text style={{color: 'white'}}> {strings.and} </Text>
                    <TouchableOpacity
                        style={{marginLeft:10,width: 130, alignItems: 'flex-start', justifyContent: 'flex-start', height: 15}}
                        onPress={() => Linking.openURL('https://creativecommons.org/terms/')}>
                        <Text style={{color: 'blue'}}>{strings.PrivacyPolicy}</Text>
                    </TouchableOpacity>
                </Text>

            </View>
            <View style={{
                width: StyleUtils.getWidth() - 20,
                flexDirection: 'row',
                justifyContent: 'space-between',

                marginTop:20,
                alignItems: 'space-between'
            }}>
                <TouchableOpacity style={{
                    marginLeft: 7,
                    width: StyleUtils.getWidth() / 2 - 20,
                    borderColor: '#cccccc',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,

                    borderRadius: 30,
                    backgroundColor: 'white',
                    margin: 3,
                    flexDirection: 'row',
                }} onPress={() => this.declineTerms()}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontSize: 18,
                        color: '#cccccc'}}>{strings.Cancel.toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    marginRight: 7,
                    width: StyleUtils.getWidth() / 2 - 20,
                    borderColor: '#cccccc',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,

                    borderRadius: 30,
                    backgroundColor: 'white',
                    margin: 3,
                    flexDirection: 'row',

                }} onPress={() => this.acceptTerms()}>
                    <Text style={{color: 'skyblue',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontSize: 18}}>{strings.IAGREE.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>

        </View>
    }
}