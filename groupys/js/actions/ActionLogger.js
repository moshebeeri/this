
const Analytics = require('react-native-firebase-analytics');
import store from "react-native-simple-store";


class ActionLogger {

    async init(){

            let user_id = await store.get("user_id");
            if (user_id) {
                Analytics.setUserId(user_id);
            } else {
                Analytics.setUserId('not_registered');
            }

    }

    async actionFailed(method,param) {

        await this.init();
        if(param){
            Analytics.logEvent('operation_failed', {
                'action_name': method,
                'param':param
            });
        }else {
            Analytics.logEvent('operation_failed', {
                'action_name': method
            });
        }
    }

    async screenVisited(currentScreen,_prevScreen){
        await this.init();
        Analytics.setScreenName(currentScreen)
        Analytics.logEvent('redirect', {
            'current_screen': currentScreen,
            'prev_screen':_prevScreen

        });
    }
}

export default ActionLogger;
