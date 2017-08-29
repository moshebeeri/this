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
import store from 'react-native-simple-store';


export default function comment(state = initialState, action) {
    console.log(action.type);
    let currentState = {...state};
    switch (action.type) {



        case 'GET_INSTANCE_GROUP_COMMENTS' :

            currentState['comment'+ action.gid + action.instanceId] = action.comments;
            store.save('comment'+ action.gid + action.instanceId,action.comments)
            currentState['LoadingDone'+ action.gid + action.instanceId] = true;
            return currentState;


        case 'GET_GROUP_COMMENTS' :


            currentState['comment'+ action.gid ] = action.groupcomments;
            store.save('comment'+ action.gid ,action.groupcomments)

            currentState['LoadingDone'+ action.gid ] = true;
            return currentState;
        case 'GET_COMMENTS' :


            currentState['comment'+ action.id ] = action.comments;
            store.save('comment'+ action.id ,action.groupcomments)

            currentState['LoadingDone'+ action.id ] = true;
            return currentState;

        case 'UPDATE_COMMENTS' :


            let comments = currentState['comment'+ action.id ];

            if(!comments || (comments && comments.length ==0)){
                comments = new Array();
            }

            comments.push(action.comment);
            currentState['comment'+ action.id ] = comments
            store.save('comment'+ action.id ,comments)

            currentState['LoadingDone'+ action.id ] = true;
            return currentState;

        default:
            return state;
    }
};