
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail,CheckBox} from 'native-base';


import {actions} from 'react-native-navigation-redux-helpers';

import {getUserFollowesr} from '../../../selectors/userSelector'

class SelectUsersComponent extends Component {

    constructor(props) {
        super(props);

        let selectCheckBox = this.props.userFollower.map(function (user) {
            return false
        });
        this.state = {


            selectCheckBox: selectCheckBox


        };


    }
    selectCheckBox(index){
        const{userFollower}  = this.props;
        let selectCheckBoxes = this.state.selectCheckBox;
        selectCheckBoxes[index] = !this.state.selectCheckBox[index];

        this.setState({
            selectCheckBox: selectCheckBoxes
        })
    }

    saveFormData(){
        const{userFollower}  = this.props;
        let selectedUsers = new Array();

        let selectedBool = this.state.selectCheckBox;
        userFollower.forEach(function (user,i) {
            if(selectedBool[i + 1]) {
                selectedUsers.push(user);
            }

        })

        this.props.navigation.state.params.selectUsers(selectedUsers);
        this.props.navigation.goBack();

    }


    render() {
        const{userFollower}  = this.props;

        let index = 0;
        let productsRows = userFollower.map((r, i) => {
            index++;
            if(r.pictures && r.pictures.length > 0){

            let path = r.pictures[r.pictures.length -1].pictures[0];
            return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)} thumbnail>
                  <Left>

                      <Thumbnail  size={80} source={{uri: path}} />
                  </Left>
                  <Body>
                  <Text>{r.name}</Text>
                  <Text note>{r.phone}</Text>
                  </Body>
                  <Right>

                      <CheckBox  onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
                  </Right>
                </ListItem>
            }
            return <ListItem key={index} onPress={this.selectCheckBox.bind(this,index)}  thumbnail style={{  backgroundColor: '#fff'}}>
              <Left>
                  <Thumbnail square size={80} source={require('../../../../images/client_1.png')} />
              </Left>
              <Body>

              <Text>{r.name}</Text>
              <Text note>{r.phone}</Text>
              </Body>
              <Right>
                  <CheckBox onPress={this.selectCheckBox.bind(this,index)} checked={this.state.selectCheckBox[index]} />
              </Right>
            </ListItem>
        });
        return ( <Container>
              <Content  style={{  backgroundColor: '#fff'}}>


                  { productsRows }




              </Content>
                <Footer   style={{  backgroundColor: '#fff'}}>
                    <Button style={{backgroundColor:'#2db6c8'}}
                            onPress={this.saveFormData.bind(this)}
                    >
                        <Text>Select Users</Text>
                    </Button>
                </Footer>
            </Container>


        );
  }


}
const mapStateToProps = state => {
    return {

        userFollower:getUserFollowesr(state),

    }
}

export default connect(
    mapStateToProps,
)(SelectUsersComponent);



