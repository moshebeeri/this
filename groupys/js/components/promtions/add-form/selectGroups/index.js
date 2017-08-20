
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,Provider
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail,CheckBox} from 'native-base';

import * as groupsAction from "../../../../actions/groups";
import { bindActionCreators } from "redux";


class SelectGroupsComponent extends Component {


    constructor(props) {
        super(props);
        props.fetchBusinessGroups(props.navigation.state.params.bid)

        let selectCheckBox = new Array();
        for (i =0 ; i<100 ;i++){

            selectCheckBox.push(false);
        }

        this.state = {


            selectCheckBox: selectCheckBox


        };


    }


    selectGroup(group){
        this.props.navigation.state.params.selectGroup(product)
        this.props.navigation.goBack();
    }

    selectCheckBox(index){
        let selectCheckBoxes = this.state.selectCheckBox;
        selectCheckBoxes[index] = !this.state.selectCheckBox[index];

        this.setState({
            selectCheckBox: selectCheckBoxes
        })
    }

    saveFormData(){
        let selectedGroups = new Array();

        let selectedBool = this.state.selectCheckBox;
        this.props.groups[  'groups' + this.props.navigation.state.params.bid].forEach(function (group,i) {
            if(selectedBool[i + 1]) {
                selectedGroups.push(group);
            }

        })

        this.props.navigation.state.params.selectGroup(selectedGroups)
        this.props.navigation.goBack();

    }

    render() {
        let index = 0;
        let productsRows = undefined;
        if(this.props.groups && this.props.groups[  'groups' + this.props.navigation.state.params.bid]) {
            productsRows =  this.props.groups[  'groups' + this.props.navigation.state.params.bid].map((r, i) => {
                index++;
                let group = r.group;
                let image = undefined;
                if(group.pictures && group.pictures.length > 0) {
                    image =  <Thumbnail  square size={50} source={{uri: group.pictures[0].pictures[3]}} />

                }else{
                    if(group.entity && group.entity.business ){
                        image =  <Thumbnail  square size={50}   source={{uri: group.entity.business.pictures[0].pictures[3]}} />



                    }
                }
                if(image){
                    return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)} thumbnail>
                        <Left>

                            {image}
                        </Left>
                        <Body>
                        <Text>{r.name}</Text>

                        </Body>
                        <Right>

                            <CheckBox  onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
                        </Right>
                    </ListItem>
                }
                return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)}  thumbnail style={{  backgroundColor: '#fff'}}>
                    <Left>
                        <Thumbnail square size={80} source={require('../../../../../images/client_1.png')} />
                    </Left>
                    <Body>

                    <Text>{group.name}</Text>

                    </Body>
                    <Right>
                        <CheckBox onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
                    </Right>
                </ListItem>
            });

        }
        return (

            <Container>
              <Content  style={{  backgroundColor: '#fff'}}>




                  { productsRows }

              </Content>
                <Footer style={{backgroundColor: '#fff'}}>

                    <Button transparent
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Select Groups</Text>
                    </Button>
                </Footer>
            </Container>


        );
  }
}

export default connect(
    state => ({
        groups: state.groups,

    }),

    dispatch => bindActionCreators(groupsAction, dispatch)
)(SelectGroupsComponent);
