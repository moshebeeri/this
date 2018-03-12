import PhoneUtils from "../utils/phoneUtils";
import serverRequestHandler from './serverRequestHandler';
import CallingCallUtils from '../utils/LocalToCallingCode'
import FormUtils from "../utils/fromUtils";
class BusinessApi {
    getAll(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/list/mine`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'businesses', 'list/:mine');
    }

    createBusiness(business, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(business)
        }, 'businesses', '/create');
    }

    updateBusiness(business, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/${business._id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(business)
        }, 'businesses', '/update');
    }

    get(token, id) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'businesses', '/get');
    }

    getSubCategory(token, categoryId, locale) {

        return serverRequestHandler.fetch_handler(`${server_host}/api/categories/by/id/${locale}/${categoryId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'categories', '/by/id');
    }

    getBusinessCategories(gid, token) {
        let locale = FormUtils.getLocale();
        return serverRequestHandler.fetch_handler(`${server_host}/api/categories/business/${locale}/${gid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'categories', 'business');
    }

    followBusiness(businessId, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/follow/${businessId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'businesses', '/follow', 'BOOLEAN');
    }

    unFollowBusiness(businessId, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/follow//${businessId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'businesses', '/follow');
    }

    groupFollowBusiness(groupId, businessId, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/follow/${groupId}/${businessId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'groups', '/follow');
    }

    checkAddress(businesses, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/checkAddress`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(businesses)
        }, 'businesses', '/checkAddress');
    }

    searchBusiness(search, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/businesses/search/0/100/${search}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'businesses', '/search');
    }

    searchBusinessByCode(qrCode, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/qrcodes/find/${qrCode}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'qrcodes', '/find');
    }

    assihgnQrcCodeToBusinese(qrCode, token, business) {
        let requset = {
            assignment: {business: business},
            type: 'FOLLOW_BUSINESS',
            action: 'FOLLOW'
        }
        return serverRequestHandler.fetch_handler(`${server_host}/api/qrcodes/assign/${qrCode.code}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(requset)
        }, 'qrcodes', '/assign');
    }

    async getUserBusinessesByPhoneNumber(phone, token) {
        let callingCode = await CallingCallUtils.getCallingCode();
        let phoneNumber = PhoneUtils.clean_phone_number(phone);
        return serverRequestHandler.fetch_handler(`${server_host}/api/user/businesses/by/phone/${callingCode}/${phoneNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'businesses', '/user/businesses/by/phone');
    }
}

export default BusinessApi;