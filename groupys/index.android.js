/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import  ApplicationManager from './js/components/app/index'
import Login from './js/components/login/index';
import AddBusiness from './js/components/business/add-form/index'

const Groupys = StackNavigator({
    login: { screen: Login },
    home: { screen: ApplicationManager },
    addBusiness: { screen: AddBusiness },

});


AppRegistry.registerComponent('groupys', () => Groupys);
