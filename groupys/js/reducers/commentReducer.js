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
import { REHYDRATE } from 'redux-persist/constants'

export default function comment(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.comments
        };
    }
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
        case 'UPDATE_INSTANCE_COMMENTS' :


            let instanceComments = currentState['comment'+ action.gid + action.instanceId]

            if(!instanceComments || (instanceComments && instanceComments.length ==0)){
                instanceComments = new Array();
            }

            instanceComments.push(action.comment);
            currentState['comment'+ action.gid + action.instanceId ] = instanceComments
            store.save('comment'+ action.gid + action.instanceId,instanceComments)

            return currentState;

        default:
            return state;
    }
};