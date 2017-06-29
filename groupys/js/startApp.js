/**
 * Created by roilandshut on 08/06/2017.
 */
import React, { Component } from "react";

import { Provider, connect } from "react-redux";
import { StackNavigator, addNavigationHelpers } from "react-navigation";
import  ApplicationManager from './components/app/index'
import ApplicationBusinessManager from './components/app-businesses/index'
import Login from './components/login/index';
import AddBusiness from './components/business/add-form/index'
import AddPromotions from './components/promtions/add-form/index'
import AddGroups from './components/groups/add-form/index'
import SelectUsersComponent from './components/groups/selectUser/index'
import AddProduct from './components/product/add-form/index'
import GroupFeed from  './components/groups/feeds/index'
import Signup from './components/signup/index';
import Register from './components/register/index';
import Products from './components/product/index';

import  Promotions from './components/promtions/index'

import  UserProfile from './components/user-profile/index'
import RealizePromotion from './components/realize-promotion/index';

import QrCode from './components/qrcode/index';



const AppNavigator = StackNavigator({
        home: { screen: ApplicationManager },
        businesses:{screen:ApplicationBusinessManager},
        login: { screen: Login },
        addBusiness: { screen: AddBusiness },
        addPromotions:{screen:AddPromotions},
        AddGroups:{screen:AddGroups},
        SelectUsersComponent:{screen: SelectUsersComponent},
        AddProduct:{screen: AddProduct},
        GroupFeed:{screen: GroupFeed},
        Signup:{screen: Signup},
        realizePromotion:{screen:RealizePromotion},
        Register:{screen: Register},
        ReadQrCode:{screen:QrCode},
        Products:{screen:Products},
        Promotions:{screen:Promotions},
        UserProfile:{screen:UserProfile}





    }
);

import getStore from "./store";




class AppWithNavigationState extends Component {
    render() {
        return (
            <AppNavigator

            />
        );
    }
}

const store = getStore();

export default function GROUPIES() {
    return (
        <Provider store={store}>
            <AppWithNavigationState />
        </Provider>
    );
}
