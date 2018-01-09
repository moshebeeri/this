import React, {Component} from 'react';
import {Dimensions, TextInput, View,Image,Linking,Button} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';
import LinkPreview from 'react-native-link-preview';
import { I18nManager } from 'react-native';
const {width, height} = Dimensions.get('window');
export default class UrlPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlFound: false,
            data:{}
        }
    }

    async componentWillMount() {
        const {text} = this.props;
        try {
            let data = await LinkPreview.getPreview(text);
            this.setState({urlFound:true,data:data})
            console.log(data)
        }catch (error){
            this.setState({urlFound:false})
        }
    }

    render() {
        if(!this.state.urlFound){
            return <View/>;
        }
        let image = undefined;
        if(this.state.data.images && this.state.data.images[0] ){
            image =  <Image resizeMode="cover" style={{height:150}} source={{uri: this.state.data.images[0] }}/>



        }

        return <View style={{justifyContent:'flex-start',alignItems:'flex-start'}} >
                <View style={{ backgroundColor:'#e5e3e3',flexDirection:'row'}}>
                    <View style={{flex:1}}>
                 {image}
                    </View>
                    <View style={{flex:3,marginLeft:5,marginRight:5}}>
                   <Text >{this.state.data.title}</Text>
                    <Text >{this.state.data.description}</Text>
                 </View>
                </View>
            <Button title={this.state.data.url} onPress={ ()=>{ Linking.openURL(this.state.data.url)}} />


        </View>
    }
}
