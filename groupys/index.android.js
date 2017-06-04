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
import AddProduct from './js/components/product/add-form/index'
import GroupFeed from  './js/components/groups/feeds/index'
import Signup from './js/components/signup/index';
import Register from './js/components/register/index';

import codePush from "react-native-code-push";

let Groupys = StackNavigator({
    home: { screen: ApplicationManager },

    login: { screen: Login },
        addBusiness: { screen: AddBusiness },
        addPromotions:{screen:AddPromotions},
        AddGroups:{screen:AddGroups},
        SelectUsersComponent:{screen: SelectUsersComponent},
        AddProduct:{screen: AddProduct},
        GroupFeed:{screen: GroupFeed},
        Signup:{screen: Signup},
        Register:{screen: Register},



    }
);

Groupys = codePush(Groupys);

AppRegistry.registerComponent('groupys', () => Groupys);
