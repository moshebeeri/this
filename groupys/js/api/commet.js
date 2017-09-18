/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';
import Timer from './LogTimer'

let timer = new Timer();
const noPic = require('../../images/client_1.png');
import  FeedUiConverter from './feed-ui-converter'
let feedUiConverter = new FeedUiConverter();
class CommentApi {



    createComment(group,instance,comment,token){

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let request = {

                    entities: [
                            {group:group},
                            {instance:instance},
                            ]
                    ,
                        message:comment
                    };




                const response = await fetch(`${server_host}/api/comments/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(request)

                })


                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                timer.logTime(from,new Date(),'comments','/')

                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });



    }

    createGlobalComment(entities,comment){

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let request = {


                    message:comment
                };


                request.entities = entities
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/comments/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(request)

                })


                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                timer.logTime(from,new Date(),'comments','/')

                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });



    }

    getComment(entities,token){

            return new Promise(async(resolve, reject) => {

                try {
                    let from = new Date();
                    let request =  {};
                    request.entities = entities;


                    const response = await fetch(`${server_host}/api/comments/find/`+0+'/' +100, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + token

                        },
                        body: JSON.stringify(request)

                    })


                    if (response.status == '401') {
                        reject(response);
                        return;
                    }

                    let responseData = await response.json();
                    let feeds = responseData.map(message => this.createFeed(message)).filter(function(x){
                        return x != undefined;
                    });  timer.logTime(from,new Date(),'comments','/skip/limit')

                    resolve(feeds);
                }
                catch (error) {

                    // console.log('There has been a problem with your fetch operation: ' + error.message);
                    reject(error);
                }
            });

    }

    getGroupComments(group,token,skip,limit) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let request = {
                    entities: [
                        {group:group._id},

                    ]
                };



                const response = await fetch(`${server_host}/api/comments/conversed/instance/`+skip+'/' +limit, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(request)

                })


                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);

            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });


    }
    getInstanceGroupComments(group,instance,size,token) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let request = {
                    entities: [
                        {group:group},
                        {instance:instance},
                    ]
                };



                const response = await fetch(`${server_host}/api/comments/find/`+size +'/' +10, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(request)

                })


                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
               timer.logTime(from,new Date(),'comments','/skip/limit')

                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });


    }

}

export default CommentApi;