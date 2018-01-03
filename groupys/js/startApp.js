/**
 * Created by roilandshut on 08/06/2017.
 */
import React, {Component} from "react";
import {Provider} from "react-redux";
import {StackNavigator} from "react-navigation";
import ApplicationManager from "./components/app/index";
import ApplicationBusinessManager from "./components/app-businesses/index";
import Login from "./components/login/index";
import ForgetPassword from "./components/forgetPassword/index";
import AddBusiness from "./components/business/add-form/index";
import AddPromotions from "./components/promtions/add-form/index";
import EditPromotions from "./components/promtions/add-form/edit_form";
import AddGroups from "./components/groups/add-form/index";
import SelectUsersComponent from "./components/groups/selectUser/index";
import AddProduct from "./components/product/add-form/index";
import GroupFeed from "./components/groups/feeds/index";
import Signup from "./components/signup/index";
import Register from "./components/register/index";
import Products from "./components/product/index";
import Promotions from "./components/promtions/index";
import UserProfile from "./components/user-profile/index";
import RealizePromotion from "./components/realize-promotion/index";
import SelectProductsComponent from "./components/promtions/add-form/selectProducts/index";
import SelectGroupsComponent from "./components/promtions/add-form/selectGroups/index";
import QrCode from "./components/qrcode/index";
import InstanceGroupComments from "./components/groups/feeds/comments";
import AddPermittedUser from "./components/premitedUsers/addForm/index";
import UserPermittedRoles from "./components/premitedUsers/index";
import GenericComments from "./components/comment/comments";
import ChangePassword from "./components/changePassword/index";
import BusinessProfile from "./components/business/profile/index";
import PostForm from "./components/post/index";
import BusinessFollow from "./components/business/follow/follow_container";
import BusinessAccount from "./components/business/account/index";
import './conf/global';

import {MenuContext} from "react-native-popup-menu";
import getStore from "./store";
import setCustomStyles from './styles'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';


setCustomStyles();
const AppNavigator = StackNavigator({
        home: {screen: ApplicationManager},
        login: {screen: Login},
        forgetPassword: {screen: ForgetPassword},
        businesses: {screen: ApplicationBusinessManager},
        addBusiness: {screen: AddBusiness},
        addPromotions: {screen: AddPromotions},
        editPromotion: {screen: EditPromotions},
        AddGroups: {screen: AddGroups},
        SelectUsersComponent: {screen: SelectUsersComponent},
        AddProduct: {screen: AddProduct},
        GroupFeed: {screen: GroupFeed},
        Signup: {screen: Signup},
        realizePromotion: {screen: RealizePromotion},
        Register: {screen: Register},
        ReadQrCode: {screen: QrCode},
        Products: {screen: Products},
        Promotions: {screen: Promotions},
        UserProfile: {screen: UserProfile},
        SelectProductsComponent: {screen: SelectProductsComponent},
        SelectGroupsComponent: {screen: SelectGroupsComponent},
        InstanceGroupComments: {screen: InstanceGroupComments},
        addPremitedUsers: {screen: AddPermittedUser},
        userPermittedRoles: {screen: UserPermittedRoles},
        genericComments: {screen: GenericComments},
        changePassword: {screen: ChangePassword},
        businessProfile: {screen: BusinessProfile},
        businessFollow: {screen: BusinessFollow},
        PostForm: {screen: PostForm},
        businessAccount:{screen:BusinessAccount},
    }
);

class AppWithNavigationState extends Component {
    render() {
        return (
            <MenuContext>
                <AppNavigator/>
            </MenuContext>
        );
    }


}

const store = getStore();
export default function GROUPIES() {
    return (
        <Provider store={store}>
            <AppWithNavigationState/>
        </Provider>
    );
}
