/**
 * Created by roilandshut on 10/05/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';

import EntityUtils from "../utils/createEntity";

let entityUtils = new EntityUtils();
class GroupsApi
{
    createGroup(group) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                let userId = await store.get('user_id');
                const response = await fetch(`${server_host}/api/groups/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(group)

                })
                if (response.status == '401' || response.status == '500') {
                    reject(response);
                    return;
                }


                if(group.image){
                    entityUtils.doUpload(promotion.image.uri,promotion.image.mime,userId,token,callbackFunction,errorCallBack,responseData);
                }

                let responseData = await response.json();
                if(group.groupUsers){
                    this.addUsersToGroup(group);
                }



                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }

    addUsersToGroup(group){
        let addGroupsUsers = this.addUserToGroup.bind(this);
        group.groupUsers.forEach( function (user) {
            addGroupsUsers(user._id,responseData._id);
        });
    }

    addUserToGroup(user,group){

        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                let userId = await store.get('user_id');
                const response = await fetch(`${server_host}/api/groups/add/user/${user}/${group}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },

                })
                if (response.status == '401' || response.status == '500') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })

    }
    getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/groups/user/follow/0/100`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
}

export default GroupsApi;