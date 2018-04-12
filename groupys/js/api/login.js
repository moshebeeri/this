import store from "react-native-simple-store";
import CallingCallUtils from '../utils/LocalToCallingCode'
import PhoneUtils from '../utils/phoneUtils'
import serverRequestHandler from './serverRequestHandler';

class LoginApi {
    async login(phone, password,callingCode) {
        let phoneNumber =  callingCode + phone;
        let normalizedPhone = this.normalizePhoneNumber(phoneNumber, callingCode );
        let normalizePhoneNumber = PhoneUtils.clean_phone_number(normalizedPhone);
        let email = PhoneUtils.clean_phone_number(callingCode) + normalizePhoneNumber + "@low.la";
        return serverRequestHandler.fetch_handler(`${server_host}/auth/local`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }, 'auth', '/login');
    }

    normalizePhoneNumber(phone, countryCode) {
        let newPhone = phone.toString().substring(phone.indexOf(countryCode.toString()) + countryCode.toString().length);
        return newPhone;
    }

    async signup(phone, password, firstName, lastName,callingCode) {
        let phoneNumber =  callingCode + phone;
        let normalizedPhone = this.normalizePhoneNumber(phoneNumber, callingCode );
        let normalizePhoneNumber = PhoneUtils.clean_phone_number(normalizedPhone);
        let email = PhoneUtils.clean_phone_number(callingCode) + normalizePhoneNumber + "@low.la";
        return serverRequestHandler.fetch_handler(`${server_host}/api/users`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    country_code: callingCode,
                    name: firstName + ' ' + lastName,
                    phone_number: phone,
                    email: email,
                    password: password
                })
            }
            , 'users', '/signup')
    }

    async verifyCode(code) {
        let token = await store.get('token');
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/verification/${code}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'users', '/verification','BOOLEAN');
    }

    recoverPassword(phoneNumber) {
        let normalizedPhone = PhoneUtils.clean_phone_number(phoneNumber);
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/password/${normalizedPhone}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
        }, 'users', '/password');
    }

    changePassword(oldPassword, newPassowrd, userId, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/${userId}/password`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassowrd,
            })
        }, 'users', '/password', 'BOOLEAN');
    }
}

export default LoginApi;
