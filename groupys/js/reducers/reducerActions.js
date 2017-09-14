/**
 * Created by roilandshut on 04/09/2017.
 */

//global
//TODO change to action bt type
export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const SAVE = 'SAVE';
export const SHARE = 'SHARE';
// user change password

export const CHANGE_PASSWORD_FAILED ='CHANGE_PASSWORD_FAILED'
//user registration
export const REGISTER_CODE_INVALID = 'REGISTER_CODE_INVALID';
export const REGISTER_CODE_SUCSSES='REGISTER_CODE_SUCSSES';

//user signup
export const SIGNUP_FAILED = 'SIGNUP_FAILED';
export const SIGNUP_SUCSESS = 'SIGNUP_SUCSESS';
export const SIGNUP_FOCUS_LASTNAME = 'SIGNUP_FOCUS_LASTNAME';
export const SIGNUP_FOCUS_PASSWORD = 'LOGIN_FOCUS_PASSWORD';
export const SIGNUP_FOCUS_PHONE = 'SIGNUP_FOCUS_PHONE';

//user login
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCSESS = 'LOGIN_SUCSESS';
export const LOGIN_FOCUS_PASSWORD = 'LOGIN_FOCUS_PASSWORD';
export const LOGIN_FOCUSED_FIELD = 'LOGIN_FOCUSED_FIELD'

//user roles
export const USER_ROLE_CLEAR = 'USER_ROLE_CLEAR';

export const USER_ROLE_SHOW_SPINNER = 'USER_ROLE_SHOW_SPINNER';
export const USER_ROLE_SHOW_MESSAGE = 'USER_ROLE_SHOW_MESSAGE';
export const USER_SET_ROLE = 'USER_SET_ROLE';
export const USER_ROLE_SET_USER ='USER_ROLE_SET_USER';

//main tab
export const APP_CHANGE_TAB ='CHANGE_TAB'
export const APP_SHOW_ADD_FAB ='CHANGE_TAB'

//authentication

export const SAVE_USER_TOKEN = 'SAVE_USER_TOKEN'
export const SAVE_APP_USER = 'SAVE_APP_USER'

//business follow
export const SEARCH_BUSINESS = 'SEARCH_BUSINESS';
export const SHOW_CAMERA = 'SHOW_CAMERA';
export const SHOW_SEARCH_SPIN = 'SHOW_SEARCH_SPIN';


//feeds

export const GET_FEEDS = 'GET_FEEDS';
export const UPSERT_FEEDS = 'UPSERT_FEEDS';
export const FEED_LIKE = 'FEED_LIKE';
export const FEED_UNLIKE = 'FEED_LIKE';
export const FEED_LOADING_DONE = 'FEED_LOADING_DONE';
export const FEED_SHOW_TOP_LOADER = 'SHOW_TOP_LOADER';
export const LAST_FEED_DOWN = 'LAST_FEED_DOWN'
export const LAST_FEED_TOP_TIME = 'LAST_FEED_TOP_TIME'



//business
export const UPSERT_BUSINESS = 'UPSERTbusiness';
export const UPSERT_MY_BUSINESS = 'UPSERT_MY_BUSINESS';
export const SET_USER_BUSINESS ='SET_USER_BUSINESS'
export const SET_PRODUCT_BUSINESS ='SET_PRODUCT_BUSINESS'
export const SET_PROMOTION_BUSINESS ='SET_PROMOTION_BUSINESS'
//promotions
export const UPSERT_PROMOTION = 'UPSERTpromotion';
//products
export const UPSERT_PRODUCTS = 'UPSERTproduct';
export const SET_PRODUCT_CATEGORIES = 'GET_PRODUCT_CATEGORIES'

//instances
export const UPSERT_INSTANCE = 'UPSERTinstance';


//groups
export const UPSERT_GROUP = 'UPSERTgroup';
export const GROUP_ADD_MESSAGE = 'GROUP_ADD_MESSAGE';
export const GROUP_CLEAN_MESSAGES = 'GROUP_CLEAN_MESSAGES';
export const GROUP_LAST_FEED_DOWN ='GROUP_LAST_FEED_DOWN'
export const UPSERT_GROUP_FEEDS_TOP = 'UPSERT_GROUP_FEEDS_TOP';
export const UPSERT_GROUP_FEEDS_BOTTOM = 'UPSERT_GROUP_FEEDS_BOTTOM';

export const GROUP_FEED_LOADING_DONE = 'GROUP_FEED_LOADING_DONE';
export const GROUP_FEED_SHOWTOPLOADER = 'GROUP_FEED_SHOWTOPLOADER';

//user
export const UPSERT_USER = 'UPSERTuser';
export const SET_USER = 'SET_USER'
export const USER_FOLLOW = 'USER_FOLLOW'



//activity
export const UPSERT_ACTIVITY= 'UPSERTactivity';

//network
export const NETWORK_IS_OFFLINE = 'NETWORK_IS_OFFLINE';
export const NETWORK_IS_ONLINE = 'NETWORK_IS_ONLINE';

//Notifcation screen
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const EXECUTE_NOTIFICATION_ACTION = 'EXECUTE_NOTIFICATION_ACTION'