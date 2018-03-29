import React, {Component} from 'react';
import {Text, View,Image} from 'react-native';
import {CachedImage} from "react-native-img-cache";
import store from 'react-native-simple-store';
import StylesUtils from '../../utils/styleUtils';
export default class ImageControllerComponent  extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount(){
        const { source, unBusted} = this.props;
        if(source.uri && !unBusted){
            this.saveUriToStore(source.uri)
        }
    }
    async saveUriToStore(uri){
       let imageCache = await store.get('imageCache');
       if(!imageCache){
           imageCache = {};
       }
       if(!imageCache[uri]) {
           imageCache[uri] = new Date().getTime();
       }
    }

    render() {
        const { square,thumbnail,source, style,size,resizeMode} = this.props;
        let defaultSize = StylesUtils.scale(50);
        if(size){
            defaultSize = size;
        }
        if(source.path || (source.uri && !source.uri.includes('http'))){
            if(thumbnail){
                if(square){

                    return <View style={{width:defaultSize,height:defaultSize}}>
                        <Image source={source} style={{width:defaultSize,height:defaultSize}}/></View>
                }else{
                    return <Image source={source} style={{borderWidth:1,borderColor:'white',borderRadius:defaultSize/2,width:defaultSize,height:defaultSize}}/>
                }

            }

            return <Image resizeMode={resizeMode} source={source} style={style}/>
        }

        if(thumbnail){
            if(square){

                return <View style={{width:defaultSize,height:defaultSize}}>
                    <CachedImage source={source} style={{width:defaultSize,height:defaultSize}}/></View>
            }else{
                return <CachedImage source={source} style={{borderWidth:0.6,borderColor:'#ffffff99',borderRadius:defaultSize/2,width:defaultSize,height:defaultSize}}/>
            }

        }

        return <CachedImage resizeMode={resizeMode} source={source} style={style}/>
    }
}

