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
import AddPromotions from './js/components/promtions/add-form/index'
import AddGroups from './js/components/groups/add-form/index'
import SelectUsersComponent from './js/components/groups/selectUser/index'
const Groupys = StackNavigator({
    login: { screen: Login },
    home: { screen: ApplicationManager },
    addBusiness: { screen: AddBusiness },
    addPromotions:{screen:AddPromotions},
    AddGroups:{screen:AddGroups},
    SelectUsersComponent:{screen: SelectUsersComponent},

});


AppRegistry.registerComponent('groupys', () => Groupys);
