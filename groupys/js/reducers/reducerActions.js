/**
 * Created by roilandshut on 04/09/2017.
 */

//global success
//TODO change to action bt type
export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const SAVE = 'SAVE';
export const SHARE = 'SHARE';
//scan qr code from
export const SCAN_QRCODE_INSTANCE = 'SCAN_QRCODE_INSTANCE';
export const SCAN_QRCODE_CLEAR = 'SCAN_QRCODE_CLEAR';
// user change password
export const CHANGE_PASSWORD_FAILED = 'CHANGE_PASSWORD_FAILED';
export const CHANGE_PASSWORD_CLEAR = 'CHANGE_PASSWORD_CLEAR';
//user registration
export const REGISTER_CODE_INVALID = 'REGISTER_CODE_INVALID';
export const REGISTER_CODE_SUCSSES = 'REGISTER_CODE_SUCSSES';
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
export const LOGIN_FOCUSED_FIELD = 'LOGIN_FOCUSED_FIELD';
//user roles
export const USER_ROLE_CLEAR = 'USER_ROLE_CLEAR';
export const USER_ROLE_SAVING = 'USER_ROLE_SAVING';
export const USER_ROLE_SAVING_DONE = 'USER_ROLE_SAVING_DONE';


export const USER_ROLE_SHOW_SPINNER = 'USER_ROLE_SHOW_SPINNER';
export const USER_ROLE_SHOW_MESSAGE = 'USER_ROLE_SHOW_MESSAGE';
export const USER_SET_ROLE = 'USER_SET_ROLE';
export const USER_ROLE_SET_USER = 'USER_ROLE_SET_USER';
//main tab
export const APP_CHANGE_TAB = 'CHANGE_TAB';
export const APP_SHOW_ADD_FAB = 'CHANGE_TAB';
//authentication
export const SAVE_USER_TOKEN = 'SAVE_USER_TOKEN';
export const SAVE_APP_USER = 'SAVE_APP_USER';
//business follow
export const SEARCH_BUSINESS = 'SEARCH_BUSINESS';
export const SHOW_CAMERA = 'SHOW_CAMERA';
export const SHOW_SEARCH_SPIN = 'SHOW_SEARCH_SPIN';
//feeds
export const GET_FEEDS = 'GET_FEEDS';
export const FIRST_TIME_FEED = 'FIRST_TIME_FEED';
export const UPSERT_FEEDS = 'UPSERT_FEEDS';
export const UPSERT_FEEDS_ITEMS = 'UPSERT_FEEDS_ITEMS';
export const UPSERT_FEEDS_TOP = 'UPSERT_FEEDS_TOP';
export const FEED_LIKE = 'FEED_LIKE';
export const FEED_UNLIKE = 'FEED_LIKE';
export const FEED_LOADING_DONE = 'FEED_LOADING_DONE';
export const FEED_SHOW_TOP_LOADER = 'SHOW_TOP_LOADER';
export const LAST_FEED_DOWN = 'LAST_FEED_DOWN';
//saved feeds
export const UPSERT_SAVED_FEEDS = 'UPSERT_SAVED_FEEDS';
export const FETCH_TOP_SAVED_FEEDS = 'UPSERT_SAVED_FEEDS';
export const SAVED_FEED_LAST_CALL = 'SAVED_FEED_LAST_CALL';
export const SAVED_FEED_LOADING_DONE = 'SAVED_FEED_LOADING_DONE';
export const SAVED_FEED_SHOW_TOP_LOADER = 'SAVED_FEED_SHOW_TOP_LOADER';
export const SAVED_LAST_FEED_DOWN = 'SAVED_LAST_FEED_DOWN';
//business
export const UPSERT_BUSINESS = 'UPSERTbusiness';
export const BUSSINESS_LOADING = 'BUSSINESS_LOADING';
export const SELECT_BUSINESS = 'SELECT_BUSINESS';
export const SAVING_BUSINESS = 'SAVING_BUSINESS';
export const SAVING_BUSINESS_DONE = 'SAVING_BUSINESS_DONE';
export const BUSSINESS_LOADING_DONE = 'BUSSINESS_LOADING_DONE';
export const UPSERT_MY_BUSINESS = 'UPSERT_MY_BUSINESS';
export const SET_USER_BUSINESS = 'SET_USER_BUSINESS';
export const SET_BUSINESS_CATEGORIES = 'SET_BUSINESS_CATEGORIES';
export const SET_PRODUCT_BUSINESS = 'SET_PRODUCT_BUSINESS';
export const SET_PROMOTION_BUSINESS = 'SET_PROMOTION_BUSINESS;';
//promotions
export const UPSERT_PROMOTION = 'UPSERTpromotion';
export const PROMOTION_SAVING ='PROMOTION_SAVING';
export const SAVE_PROMOTIONS= 'SAVE_PROMOTIONS';
export const PROMOTION_SAVING_DONE='PROMOTION_SAVING_DONE';
export const PROMOTION_RESET='PROMOTION_RESET';
//products
export const UPSERT_PRODUCTS = 'UPSERTproduct';
export const SET_PRODUCT_CATEGORIES = 'GET_PRODUCT_CATEGORIES';
export const PRODUCT_SAVING = 'PRODUCT_SAVING';
export const PRODUCT_SAVING_DONE = 'PRODUCT_SAVING_DONE';
//instances
export const UPSERT_INSTANCE = 'UPSERTinstance';
//groups
export const UPSERT_GROUP = 'UPSERTgroup';
export const UPSERT_SINGLE_GROUP = 'UPSERT_SINGLE_GROUP';
export const GROUP_ADD_MESSAGE = 'GROUP_ADD_MESSAGE';
export const GROUP_CLEAN_MESSAGES = 'GROUP_CLEAN_MESSAGES';
export const GROUP_LAST_FEED_DOWN = 'GROUP_LAST_FEED_DOWN';
export const UPSERT_GROUP_FEEDS_TOP = 'UPSERT_GROUP_FEEDS_TOP';
export const UPSERT_GROUP_FEEDS_BOTTOM = 'UPSERT_GROUP_FEEDS_BOTTOM';
export const GROUP_FEED_LOADING_DONE = 'GROUP_FEED_LOADING_DONE';
export const GROUP_FEED_SHOWTOPLOADER = 'GROUP_FEED_SHOWTOPLOADER';
//user
export const UPSERT_USER = 'UPSERTuser';
export const UPSERT_SINGLE_USER = 'UPSERT_SINGLE_USER';
export const SET_USER = 'SET_USER';
export const USER_FOLLOW = 'USER_FOLLOW';
export const USER_SELECT = 'USER_SELECT';
export const USER_SELECT_RESET = 'USER_SELECT_RESET';
export const USER_UNSELECT = 'USER_UNSELECT';
//activity
export const UPSERT_ACTIVITY = 'UPSERTactivity';
//network
export const NETWORK_IS_OFFLINE = 'NETWORK_IS_OFFLINE';
export const NETWORK_IS_ONLINE = 'NETWORK_IS_ONLINE';
//Notifcation screen
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const SET_TOP_NOTIFICATION = 'SET_TOP_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const EXECUTE_NOTIFICATION_ACTION = 'EXECUTE_NOTIFICATION_ACTION';
//group promotions with comments
export const UPSERT_GROUP_COMMENT = 'UPSERT_GROUP_COMMENT';
export const GROUP_COMMENT_LOADING_DONE = 'GROUP_COMMENT_LOADING_DONE';
export const GROUP_COMMENT_LAST_CALL = 'GROUP_COMMENT_LAST_CALL';
export const GROUP_COMMENT_SHOW_TOP_LOADER = 'GROUP_COMMENT_SHOW_TOP_LOADER';
//commentInstances
export const UPSERT_GROUP_INSTANCE_COMMENT = 'UPSERT_GROUP_INSTANCE_COMMENT';
export const UPSERT_GROUP_INSTANCE_TOP_COMMENT = 'UPSERT_GROUP_INSTANCE_TOP_COMMENT';
export const GROUP_COMMENT_INSTANCE_LOADING_DONE = 'GROUP_COMMENT_INSTANCE_LOADING_DONE';
export const GROUP_COMMENT_INSTANCE_LAST_CALL = 'GROUP_COMMENT_INSTANCE_LAST_CALL';
export const GROUP_COMMENT_INSTANCE_SHOW_TOP_LOADER = 'GROUP_COMMENT_INSTANCE_SHOW_TOP_LOADER';
export const GROUP_COMMENT_INSTANCE_ADD_MESSAGE = 'GROUP_COMMENT_INSTANCE_ADD_MESSAGE';
export const GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE = 'GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE';
//entities comments
export const UPSERT_ENTITIES_COMMENT = 'UPSERT_ENTITIES_COMMENT';
export const UPSERT_ENTITIES_TOP_COMMENT = 'UPSERT_ENTITIES_TOP_COMMENT'
export const ENTITIES_COMMENT_LOADING_DONE = 'ENTITIES_COMMENT_LOADING_DONE'
export const ENTITIES_COMMENT_LAST_CALL = 'ENTITIES_COMMENT_LAST_CALL'
export const ENTITIES_COMMENT_SHOW_TOP_LOADER = 'ENTITIES_COMMENT_SHOW_TOP_LOADER'
export const ENTITIES_COMMENT_INSTANCE_ADD_MESSAGE = 'ENTITIES_COMMENT_INSTANCE_ADD_MESSAGE'
export const ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE = 'ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE'
//contacts
export const LAST_CONTACT_SYNC = 'LAST_CONTACT_SYNC';
export const SET_CONTACT = 'SET_CONTACT';
// address
export const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND';
export const ADDRESS_VALADATING = 'ADDRESS_VALADATING';
export const ADDRESS_VALADATING_DONE = 'ADDRESS_VALADATING_DONE';
export const ADDRESSES_MULTIPLE_FOUND = 'ADDRESSES_MULTIPLE_FOUND';
export const ADDRESS_FOUND = 'ADDRESS_FOUND';
export const ADDRESS_RESET = 'ADDRESS_RESET';
export const ADDRESS_WAS_CHOOSEN = 'ADDRESS_WAS_CHOOSEN';
//categories
export const CATEGORIES_FETCHING = 'CATEGORIES_FETCHING';
export const CATEGORIES_FETCHING_DONE = 'CATEGORIES_FETCHING_DONE';
export const CATEGORIES_SET = 'CATEGORIES_SET';
