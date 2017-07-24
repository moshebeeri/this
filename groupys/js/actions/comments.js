/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();

async function getInstanceGroupComments(dispatch,group,instance){
    try {
        let response = await commentsApi.getInstanceGroupComments(group,instance);
        if(response.length > 0) {

            dispatch({
                type: 'GET_INSTANCE_GROUP_COMMENTS',
                comments: response,
                gid:group,
                instanceId:instance


            });
        }


    }catch (error){
        console.log(error);
    }

}


export function InstanceGroupComments(){
    return function (dispatch, group,instance){
        dispatch|(getInstanceGroupComments(dispatch,group,instance));
    }

}
