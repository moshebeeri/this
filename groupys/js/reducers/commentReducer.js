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
    switch (action.type) {



        case 'GET_INSTANCE_GROUP_COMMENTS' :

            let currentState = {...state};
            currentState['comment'+ action.gid + action.instanceId] = action.comments;

            return currentState;
        default:
            return state;
    }
};