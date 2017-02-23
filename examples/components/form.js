import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button
} from 'react-native';

export default class myForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: null,
            address:'',


        };
    }

    render() {
        return (
            <View style={styles.container}>


                <View style={{

                    flexDirection: 'column',

                }}>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                          Name:
                        </Text>
                        <TextInput style={styles.input}
                            onChangeText={(name) => this.setState({name})}

                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.titleText}>
                            Address:
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(address) => this.setState({address})}

                        />
                    </View>

                    <Button
                        onPress={this.props.saveForm(this.state)}
                        title="Save"
                        color="#841584"

                    />
                </View>
            </View>
        )


    }


}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',

        marginRight: 10
    },
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        marginLeft:10,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign:  "left",
        width: 50
    },
    row: {
        marginTop:5,
        flexDirection: 'row'

    },

    input:{

        height: 20,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1
    }

});

module.exports=myForm;
