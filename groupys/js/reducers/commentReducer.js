/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {comments:[]};



export default function comment(state = initialState, action) {
    console.log(action.type);
    let currentState = {...state};
    switch (action.type) {



        case 'GET_INSTANCE_GROUP_COMMENTS' :

            currentState['comment'+ action.gid + action.instanceId] = action.comments;
            currentState['LoadingDone'+ action.gid + action.instanceId] = true;
            return currentState;
        case 'GET_GROUP_COMMENTS' :


            currentState['comment'+ action.gid ] = action.groupcomments;
            currentState['LoadingDone'+ action.gid ] = true;
            return currentState;
        default:
            return state;
    }
};