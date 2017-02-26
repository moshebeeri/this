
import React, { Component } from 'react';
import { View, Text, Icon, ListItem } from 'native-base';

import styles from './styles';


class Nav extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ListItem button onPress={() => this.props.navigateTo(this.props.to)} iconLeft style={styles.links} >
                <View style={styles.sidebarList}>
                    <View style={styles.sidebarIconView}>
                        <Icon name={this.props.icon} style={styles.sidebarIcon} />
                    </View>
                    <Text style={styles.linkText}>{this.props.name}</Text>
                </View>
            </ListItem>
        );
    }
}

export {Nav};

/**

 <ListItem button onPress={() => this.props.navigateTo(this.props.to)} iconLeft style={styles.links} >
 <View style={styles.sidebarList}>
 <View style={[styles.sidebarIconView, { backgroundColor: '#00afc1', paddingLeft: 11 }]}>
 <Icon name={this.props.icon} style={styles.sidebarIcon} />
 </View>
 <Text style={styles.linkText}>{this.props.name}</Text>
 </View>
 </ListItem>

 **/
