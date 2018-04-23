import getStore from "../store";
import users from '../actions/user'
import simpleStore from 'react-native-simple-store';

const store = getStore();

class PageRefresher {
    constructor() {
    }

    async updateUserFireBase(fireBaseToken) {
        let token = store.getState().authentication.token;
        if (!token) {
            token = await simpleStore.get("token");
        }
        let user = store.getState().user.user;
        if (!user) {
            user = await simpleStore.get("user");
        }
        if (token && user) {
            users.updateUserToken(store.dispatch, token, user, fireBaseToken)
        }
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
