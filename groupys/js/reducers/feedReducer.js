/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:[],savedfeeds:[],savedShowTopLoader:false};

export const GET_FEED = 'GET_FEEDS'


export default function feeds(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_FEEDS' :
            return {
                ...state,
                feeds : action.feeds,
                showTopLoader : action.showTopLoader
            };
        case 'GET_SAVED_FEEDS' :
            return {
                ...state,
                savedfeeds : action.feeds,
                savedShowTopLoader : action.showTopLoader
            };
        case 'SHOW_TOP_LOADER' :
            return {
                ...state,
                showTopLoader : true
            };
        case 'SHOW_SAVED_TOP_LOADER' :
            return {
                ...state,
                savedShowTopLoader : true
            };
        default:
            return state;
    }
};