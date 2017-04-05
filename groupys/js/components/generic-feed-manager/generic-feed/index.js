import React, {Component} from 'react';
import {Image ,Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Icon,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';



const {
    replaceAt,
} = actions;
;


class GenericFeedItem extends Component {



    constructor(props) {
        super(props);


    }





        render() {
            let feed = this.createFeed(this.props.item);



            return feed;
        }


        createFeed(item){
            let secondFeed = undefined;
            if(item.feed){
                secondFeed = this.createFeed(item.feed);

            }

            let logo = undefined;
            if(item.logo) {
                if (item.logo.uri) {
                    logo = <Image
                        style={{width: 50, height: 50}}
                        source={{uri: item.logo.uri}}/>
                }

                if (item.logo.require) {
                    logo = <Image
                        style={{width: 50, height: 50}}
                        source={item.logo.require}/>
                }
            }


            let banner = undefined;
            if(item.banner) {

                if (item.banner.uri) {
                    banner = <Image
                        style={{padding: 5, flex: -1}}
                        source={{uri: item.banner.uri}}/>
                }

                if (item.banner.require) {
                    banner = <Image
                        style={{padding: 5, flex: -1}}
                        source={item.banner.require}/>
                }
            }

            let likeIcon =  <Icon  active style={{color: 'gray'}} name="thumbs-up" />;
            if(item.social.like == true){
                likeIcon = <Icon active name="thumbs-up" />

            }



            return (  <Card >
                    <CardItem>

                        <Left>
                            {logo}
                            <Body>
                            <Text>{item.itemTitle}</Text>
                            <Text note>{item.description} </Text>
                            </Body>
                        </Left>

                    </CardItem>


                    <CardItem content>
                        {secondFeed}
                        {banner}
                    </CardItem>
                    <CardItem>


                        <Button transparent>
                            {likeIcon}
                            <Text> {item.social.numberLikes} Like</Text>
                        </Button>

                    </CardItem>
                </Card>

            );

        }
}


function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(GenericFeedItem);
