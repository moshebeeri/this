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
export const REGISTER_RESEND = 'REGISTER_RESEND';
export const REGISTER_PROCESS = 'REGISTER_PROCESS';
export const REGISTER_CODE_SUCSSES = 'REGISTER_CODE_SUCSSES';
//user signup
export const SIGNUP_PROCESS = 'SIGNUP_PROCESS';
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
export const APP_CHANGE_TAB = 'APP_CHANGE_TAB';
export const APP_SHOW_ADD_FAB = 'CHANGE_TAB';
export const APP_SHOW_PROMOTION_POPUP = 'APP_SHOW_PROMOTION_POPUP';
export const APP_SHOW_GENERAL_POPUP = 'APP_SHOW_GENERAL_POPUP';
//authentication
export const SAVE_USER_TOKEN = 'SAVE_USER_TOKEN';
export const SAVE_APP_USER = 'SAVE_APP_USER';
export const LOGIN_PROCESS = 'LOGIN_PROCESS';
//business follow
export const SEARCH_BUSINESS = 'SEARCH_BUSINESS';
export const SEARCH_GROUPS = 'SEARCH_GROUPS';
export const SHOW_CAMERA = 'SHOW_CAMERA';
export const SHOW_SEARCH_SPIN = 'SHOW_SEARCH_SPIN';
export const SEARCH_PARAMS = 'SEARCH_PARAMS';
export const RESET_FOLLOW_FORM = 'RESET_FOLLOW_FORM';
//feeds
export const GET_FEEDS = 'GET_FEEDS';
export const FIRST_TIME_FEED = 'FIRST_TIME_FEED';
export const FEEDS_START_RENDER = 'FEEDS_START_RENDER';
export const FEEDS_GET_NEXT_BULK = 'FEEDS_GET_NEXT_BULK'
export const FEEDS_GET_NEXT_BULK_DONE = 'FEEDS_GET_NEXT_BULK_DONE'
export const FEEDS_STOP_RENDER = 'FEEDS_STOP_RENDER'
export const UPSERT_FEEDS = 'UPSERT_FEEDS';
export const UPSERT_FEEDS_ITEMS = 'UPSERT_FEEDS_ITEMS';
export const UPSERT_FEEDS_TOP = 'UPSERT_FEEDS_TOP';
export const VISIBLE_FEED = 'VISIBLE_FEED';
export const VISIBLE_MAIN_FEED = 'VISIBLE_MAIN_FEED';
export const FEED_LIKE = 'FEED_LIKE';
export const FEED_UNLIKE = 'FEED_UNLIKE';
export const FEED_LOADING_DONE = 'FEED_LOADING_DONE';
export const FEED_SHOW_TOP_LOADER = 'SHOW_TOP_LOADER';
export const FEED_NO_RENDER = 'FEED_NO_RENDER';
export const LAST_FEED_DOWN = 'LAST_FEED_DOWN';
export const MAX_FEED_RETUNED = 'MAX_FEED_RETUNED';
export const MAX_FEED_NOT_RETUNED = 'MAX_FEED__NOT_RETUNED';
export const FEED_UPDATE_SOCIAL_STATE = 'FEED_UPDATE_SOCIAL_STATE';
export const FEEDS_UPDATED = 'FEEDS_UPDATED';
export const SINGLE_FEED_FINISH_UPDATED = 'SINGLE_FEED_FINISH_UPDATED';
//saved feeds
export const UPSERT_SAVED_FEEDS = 'UPSERT_SAVED_FEEDS';
export const SAVE_FEED_UPDATED = 'SAVE_FEED_UPDATED';
export const FETCH_TOP_SAVED_FEEDS = 'FETCH_TOP_SAVED_FEEDS';
export const UPDATE_SINGLE_SAVED_INSTANCE = 'UPDATE_SINGLE_SAVED_INSTANCE';
export const SAVED_FEED_LAST_CALL = 'SAVED_FEED_LAST_CALL';
export const SAVED_FEED_LOADING_DONE = 'SAVED_FEED_LOADING_DONE';
export const SAVE_PROMOTION_FIRST_TIME_FEED = 'SAVE_PROMOTION_FIRST_TIME_FEED';
export const SAVED_FEED_SHOW_TOP_LOADER = 'SAVED_FEED_SHOW_TOP_LOADER';
export const SAVED_LAST_FEED_DOWN = 'SAVED_LAST_FEED_DOWN';
export const SAVED_PROMOTION_STOP_RENDER = 'SAVED_PROMOTION_STOP_RENDER';
//business
export const UPSERT_BUSINESS = 'UPSERTbusiness';
export const BUSSINESS_LOADING = 'BUSSINESS_LOADING';
export const SELECT_BUSINESS = 'SELECT_BUSINESS';
export const SAVING_BUSINESS = 'SAVING_BUSINESS';
export const UPSERT_MY_BUSINESS_SINGLE = 'UPSERT_MY_BUSINESS_SINGLE';
export const SAVING_BUSINESS_DONE = 'SAVING_BUSINESS_DONE';
export const BUSSINESS_LOADING_DONE = 'BUSSINESS_LOADING_DONE';
export const UPSERT_MY_BUSINESS = 'UPSERT_MY_BUSINESS';
export const UPSERT_BUSINESS_QRCODE = 'UPSERT_BUSINESS_QRCODE';
export const REST_BUSINESS_QRCODE = 'REST_BUSINESS_QRCODE';
export const SET_USER_BUSINESS = 'SET_USER_BUSINESS';
export const SET_BUSINESS_CATEGORIES = 'SET_BUSINESS_CATEGORIES';
export const SET_PRODUCT_BUSINESS = 'SET_PRODUCT_BUSINESS';
export const SET_PROMOTION_BUSINESS = 'SET_PROMOTION_BUSINESS;';
export const PAYMENT_SUCCSESS = 'PAYMENT_SUCCSESS';
export const SAVE_BUSINESS_TAMPLATE = 'SAVE_BUSINESS_TAMPLATE';
export const BUSINESS_UPLOAD_PIC = 'BUSINESS_UPLOAD_PIC';
export const BUSINESS_CLEAR_PIC = 'BUSINESS_CLEAR_PIC';
export const UPSERT_PRODUCT_SINGLE = 'UPSERT_PRODUCT_SINGLE';
//promotions
export const UPSERT_PROMOTION = 'UPSERTpromotion';
export const PROMOTION_UPLOAD_PIC = 'PROMOTION_UPLOAD_PIC';
export const PROMOTION_SAVING = 'PROMOTION_SAVING';
export const SAVE_PROMOTIONS = 'SAVE_PROMOTIONS';
export const SAVE_ON_PROXIMITY_PROMOTIONS = 'SAVE_ON_PROXIMITY_PROMOTIONS';
export const SAVE_ON_BOARDING_PROMOTIONS = 'SAVE_ON_BOARDING_PROMOTIONS';
export const SAVE_ON_FOLLOER_PROXIMITY_PROMOTIONS = 'SAVE_ON_FOLLOER_PROXIMITY_PROMOTIONS';
export const PROMOTION_SAVING_DONE = 'PROMOTION_SAVING_DONE';
export const PROMOTION_SAVING_FAILED = 'PROMOTION_SAVING_FAILED';
export const PROMOTION_RESET = 'PROMOTION_RESET';
export const PROMOTION_LOADING_DONE = 'PROMOTION_LOADING_DONE';
export const PROMOTION_CLEAR_PIC = 'PROMOTION_CLEAR_PIC';
export const PRODUCTS_CLEAR_PIC = 'PRODUCTS_CLEAR_PIC';
export const UPSERT_PROMOTION_SINGLE = 'UPSERT_PROMOTION_SINGLE';
export const PRODUCTS_UPLOAD_PIC = 'PRODUCTS_UPLOAD_PIC';
export const OTHER_BUSINESS_USER = 'OTHER_BUSINESS_USER';
//products
export const UPSERT_PRODUCTS = 'UPSERTproduct';
export const SET_PRODUCT_CATEGORIES = 'GET_PRODUCT_CATEGORIES';
export const PRODUCT_SAVING = 'PRODUCT_SAVING';
export const PRODUCT_RESET_FORM = 'PRODUCT_RESET_FORM';
export const PRODUCT_SAVING_DONE = 'PRODUCT_SAVING_DONE';
export const PRODUCT_LOADING_DONE = 'PRODUCT_LOADING_DONE';
//instances
export const UPSERT_INSTANCE = 'UPSERTinstance';
//groups
export const UPSERT_GROUP = 'UPSERTgroup';
export const GROUP_COMMENT_UPDATED = 'GROUP_COMMENT_UPDATED';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const UPSERT_SINGLE_GROUP = 'UPSERT_SINGLE_GROUP';
export const GROUP_ADD_MESSAGE = 'GROUP_ADD_MESSAGE';
export const GROUP_CLEAN_MESSAGES = 'GROUP_CLEAN_MESSAGES';
export const GROUP_LAST_FEED_DOWN = 'GROUP_LAST_FEED_DOWN';
export const UPSERT_GROUP_QRCODE = 'UPSERT_GROUP_QRCODE';
export const REST_GROUP_QRCODE = 'REST_GROUP_QRCODE';
export const UPSERT_GROUP_FEEDS_TOP = 'UPSERT_GROUP_FEEDS_TOP';
export const UPDATE_FEED_GROUP_UNREAD = 'UPDATE_FEED_GROUP_UNREAD';
export const UPSERT_GROUP_FEEDS_BOTTOM = 'UPSERT_GROUP_FEEDS_BOTTOM';
export const GROIP_CLEAR_UNREAD_POST = 'GROIP_CLEAR_UNREAD_POST';
export const GET_GROUPS_BUSINESS = 'GET_GROUPS_BUSINESS';
export const SET_GROUPS_FOLLOWERS = 'SET_GROUPS_FOLLOWERS';
export const GROUP_FEED_LOADING_DONE = 'GROUP_FEED_LOADING_DONE';
export const GROUP_FEED_SHOWTOPLOADER = 'GROUP_FEED_SHOWTOPLOADER';
export const GROUP_UPDATE_SOCIAL_STATE = 'GROUP_UPDATE_SOCIAL_STATE';
export const GROUP_SAVING = 'GROUP_SAVING';
export const GROUP_SAVING_DONE = 'GROUP_SAVING_DONE';
export const GROUP_TOUCHED = 'GROUP_TOUCHED';
export const VISIBLE_GROUP_FEED = 'VISIBLE_GROUP_FEED';
export const MAX_GROUP_FEED_RETUNED = 'MAX_GROUP_FEED_RETUNED';
export const MAX_GROUP_FEED_NOT_RETUNED = 'MAX_GROUP_FEED_NOT_RETUNED';
export const GROUP_UPDATED = 'GROUP_UPDATED';
//user
export const UPSERT_USER = 'UPSERTuser';
export const UPSERT_SINGLE_USER = 'UPSERT_SINGLE_USER';
export const SET_USER = 'SET_USER';
export const USER_FOLLOW = 'USER_FOLLOW';
export const SAVING_USER = 'SAVING_USER';
export const SAVING_USER_DONE = 'SAVING_USER_DONE';
export const USER_SELECT = 'USER_SELECT';
export const USER_SELECT_RESET = 'USER_SELECT_RESET';
export const USER_UNSELECT = 'USER_UNSELECT';
export const USERS_UPLOAD_PIC = 'USERS_UPLOAD_PIC';
export const CLEAR_USERS_UPLOAD_PIC = 'CLEAR_USERS_UPLOAD_PIC';
//activity
export const UPSERT_ACTIVITY = 'UPSERTactivity';
//network
export const NETWORK_IS_OFFLINE = 'NETWORK_IS_OFFLINE';
export const NETWORK_IS_ONLINE = 'NETWORK_IS_ONLINE';
export const TIME_OUT = 'TIME_OUT';
//Render
export const CURRENT_SCREEN = 'CURRENT_SCREEN';
export const CURRENT_MAIN = 'CURRENT_MAIN';
export const CURRENT_TAB = 'CURRENT_TAB';
//Notification screen
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const SET_TOP_NOTIFICATION = 'SET_TOP_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const EXECUTE_NOTIFICATION_ACTION = 'EXECUTE_NOTIFICATION_ACTION';
export const NOTIFICATION_FINISH_UPDATE = 'NOTIFICATION_FINISH_UPDATE';
//group promotions with comments
export const UPSERT_GROUP_COMMENT = 'UPSERT_GROUP_COMMENT';
export const GROUP_COMMENT_INSTANCE = 'GROUP_COMMENT_INSTANCE';
export const GROUP_CLEAR_COMMENT_INSTANCE = 'GROUP_CLEAR_COMMENT_INSTANCE';
export const UPSERT_GROUP_TOP_COMMENT = 'UPSERT_GROUP_TOP_COMMENT';
export const CLEAR_GROUP_COMMENT_UNREAD = 'CLEAR_GROUP_COMMENT_UNREAD';
export const GROUP_COMMENT_LOADING_DONE = 'GROUP_COMMENT_LOADING_DONE';
export const GROUP_COMMENT_LAST_CALL = 'GROUP_COMMENT_LAST_CALL';
export const GROUP_COMMENT_SHOW_TOP_LOADER = 'GROUP_COMMENT_SHOW_TOP_LOADER';
export const GROUP_COMMENT_ADD_MESSAGE = 'GROUP_COMMENT_ADD_MESSAGE';
export const GROUP_COMMENT_CLEAR_MESSAGE = 'GROUP_COMMENT_CLEAR_MESSAGE';
export const GROUP_COMMENT_MAX = 'GROUP_COMMENT_MAX';
export const GROUP_COMMENT_MAX_NOT_RETRUNED = 'GROUP_COMMENT_MAX_NOT_RETRUNED';
//commentInstances
export const UPSERT_GROUP_INSTANCE_COMMENT = 'UPSERT_GROUP_INSTANCE_COMMENT';
export const UPSERT_GROUP_INSTANCE_TOP_COMMENT = 'UPSERT_GROUP_INSTANCE_TOP_COMMENT';
export const GROUP_COMMENT_INSTANCE_LOADING_DONE = 'GROUP_COMMENT_INSTANCE_LOADING_DONE';
export const GROUP_COMMENT_INSTANCE_LAST_CALL = 'GROUP_COMMENT_INSTANCE_LAST_CALL';
export const GROUP_COMMENT_INSTANCE_SHOW_TOP_LOADER = 'GROUP_COMMENT_INSTANCE_SHOW_TOP_LOADER';
export const GROUP_COMMENT_INSTANCE_ADD_MESSAGE = 'GROUP_COMMENT_INSTANCE_ADD_MESSAGE';
export const GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE = 'GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE';
export const GROUP_COMMENT_INSTANCE_MAX = 'GROUP_COMMENT_INSTANCE_MAX';
//entities comments
export const UPSERT_ENTITIES_COMMENT = 'UPSERT_ENTITIES_COMMENT';
export const UPSERT_ENTITIES_TOP_COMMENT = 'UPSERT_ENTITIES_TOP_COMMENT'
export const ENTITIES_COMMENT_LOADING_DONE = 'ENTITIES_COMMENT_LOADING_DONE'
export const ENTITIES_COMMENT_MAX_LOADING_DONE = 'ENTITIES_COMMENT_MAX_LOADING_DONE'
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
export const ADDRESS_CHANGE = 'ADDRESS_CHANGE';
export const ADDRESS_WAS_CHOOSEN = 'ADDRESS_WAS_CHOOSEN';
//categories
export const CATEGORIES_FETCHING = 'CATEGORIES_FETCHING';
export const CATEGORIES_FETCHING_DONE = 'CATEGORIES_FETCHING_DONE';
export const CATEGORIES_SET = 'CATEGORIES_SET';
//scanner
export const SCANNER_RESET = 'SCANNER_RESET';
export const SCANNER_SHOW_CAMERA = 'SCANNER_SHOW_CAMERA';
export const SCANNER_SHOW_SEARCH_SPIN = 'SCANNER_SHOW_SEARCH_SPIN';
export const SCANNER_CODE = 'SCANNER_CODE';
export const SCANNER_SHOW_BUSINESS = 'SCANNER_SHOW_BUSINESS';
export const SCANNER_SHOW_GROUP = 'SCANNER_SHOW_GROUP';
export const SCANNER_SHOW_PROMOTION = 'SCANNER_SHOW_PROMOTION';
export const SCANNER_SHOW_QRCODE_ASSIGMENT = 'SCANNER_SHOW_QRCODE_ASSIGMENT';
export const SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED = 'SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED';
export const SCANNER_SHOW_NOT_AUTHOTIZED = 'SCANNER_SHOW_NOT_AUTHOTIZED';
export const SCANNER_CONDITION_OUT_OF_SCOPE = 'SCANNER_CONDITION_OUT_OF_SCOPE';
//location
export const SET_LOCATION = 'SET_LOCATION';
export const SET_CURRENCY = 'SET_CURRENCY';
export const SEND_LOCATION_TIME = 'SEND_LOCATION_TIME';
//Posts
export const RESET_POST_FORM = 'RESET_POST_FORM';
export const POST_SAVING = 'POST_SAVING';
export const POST_SAVING_DONE = 'POST_SAVING_DONE';
export const UPSERT_POST = 'UPSERTpost';
//Dimensions
export const DIMENSIONS_CHANGED = 'DIMENSIONS_CHANGED';
//User Business by phone
export const USER_BUSINESS_BY_PHONE_SET_DATA = "USER_BUSINESS_BY_PHONE_SET_DATA";
export const USER_BUSINESS_BY_PHONE_SHOW_MESSAGE = "USER_BUSINESS_BY_PHONE_SHOW_MESSAGE";
export const USER_BUSINESS_BY_PHONE_SHOW_SPINNER = "USER_BUSINESS_BY_PHONE_SHOW_SPINNER";
export const USER_BUSINESS_BY_PHONE_CLEAR = "USER_BUSINESS_BY_PHONE_CLEAR";
// following
export const USER_FOLLOW_BUSINESS = "USER_FOLLOW_BUSINESS";
export const USER_FOLLOW_GROUP = "USER_FOLLOW_GROUP";
export const USER_UNFOLLOW_BUSINESS = "USER_UNFOLLOW_BUSINESS";
export const USER_UNFOLLOW_GROUP = "USER_UNFOLLOW_GROUP";
// dataSync
export const SOCIAL_STATE_LISTENER = "SOCIAL_STATE_LISTENER";
export const GROUP_LISTENER = "GROUP_LISTENER";
export const BUSINESS_LISTENER = "BUSINESS_LISTENER";
export const PROMOTION_LISTENER = "PROMOTION_LISTENER";
export const BUSINESS_PROMOTINS_LISTENER = "BUSINESS_PROMOTINS_LISTENER";
export const CHAT_LISTENER = "CHAT_LISTENER";
export const CHAT_LISTENER_GROUP = "CHAT_LISTENER_GROUP";
export const CHAT_LISTENER_GROUP_INSTANCE = "CHAT_LISTENER_GROUP_INSTANCE";


