import React, {Component} from 'react';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import StyleUtils from "../../utils/styleUtils";
import strings from "../../i18n/i18n"
import {ThisText} from '../../ui/index';

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
        const {acceptTerms} = this.props;
        acceptTerms();
    }

    declineTerms() {
        const {declineTerms} = this.props;
        declineTerms();
    }

    render() {
        return <View style={{
            backgroundColor: 'white',
            height: 150,
            borderWidth: 2,
            marginTop: 200,
            width: StyleUtils.getWidth(),
            borderColor: '#cccccc',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: "center"
        }}>
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                height: 150,
                width: StyleUtils.getWidth() - 10
            }}>
                <Image style={{position: 'absolute', height: 150, width: StyleUtils.getWidth() - 10}}
                       resizeMode='cover' source={bg}/>

            </View>

            <View style={{
                marginTop: 10,
                flexDirection: 'column',
                backgroundColor: 'transparent',
                width: StyleUtils.getWidth() - 30
            }}>
                <ThisText style={{
                    flexWrap: 'wrap',
                    color: 'white',
                    fontSize: StyleUtils.scale(14),
                    backgroundColor: 'transparent'
                }}> {strings.UseOfTermMessage}


                </ThisText>

                <TouchableOpacity style={{
                    marginTop: 10,
                    width: StyleUtils.getWidth() - 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 20
                }}
                                  onPress={() => Linking.openURL(`${server_host}/api/users/terms/1.0`)}>
                    <ThisText style={{fontSize: StyleUtils.scale(14),color: 'blue'}}>{strings.TermsOfUse}</ThisText>
                </TouchableOpacity>


            </View>
            <View style={{
                width: StyleUtils.getWidth() - 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
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
                    <ThisText style={{
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontSize: 18,
                        color: '#cccccc'
                    }}>{strings.Cancel.toUpperCase()}</ThisText>
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
                    <ThisText style={{
                        color: 'skyblue',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontSize: 18
                    }}>{strings.IAgree.toUpperCase()}</ThisText>
                </TouchableOpacity>
            </View>

        </View>
    }
}
