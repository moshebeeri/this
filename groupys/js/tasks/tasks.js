import getStore from "../store";
import simpleStore from 'react-native-simple-store';
import BackgroundTimer from "react-native-background-timer";
import feedAction from '../actions/feedsMain'
import pageSync from '../refresh/refresher'
import * as actions from "../reducers/reducerActions";
import myPromotionAction from '../actions/myPromotions'
import ContactApi from '../api/contacts';
import handler from '../actions/ErrorHandler'
import * as errors from '../api/Errors'

const contactApi = new ContactApi();
const reduxStore = getStore();

class Tasks {
    async start() {
        await this.stop();
        const timer = BackgroundTimer.setInterval(() => {
            try {
                if (reduxStore.getState().authentication.token) {
                    contactApi.syncContacts();
                }
                if (reduxStore.getState().network.offline) {
                    reduxStore.dispatch({
                        type: actions.NETWORK_IS_ONLINE,
                    })
                }
            } catch (error) {
                handler.handleError(errors.NETWORK_ERROR, reduxStore.dispatch, 'tasks-synccontact')
            }
        }, 2000);
        const refresher = BackgroundTimer.setInterval(() => {
            try {
                pageSync.check();
            } catch (error) {
                handler.handleError(errors.PAGE_SYNC, reduxStore.dispatch, 'page-sync')
            }
        }, 1000);
        simpleStore.save("tasks", [timer, refresher])
    }

    async stop() {
        let tasks = await simpleStore.get("tasks");
        if (tasks) {
            tasks.forEach((task) => {
                BackgroundTimer.clearInterval(task);
            });
        }
    }

    async realizeTaskStart(id) {
        await this.realizeTaskstop();
        const refresher = BackgroundTimer.setInterval(() => {
            let token = reduxStore.getState().authentication.token;
            try {
                myPromotionAction.updateInstance(token, reduxStore.dispatch, id);
            } catch (error) {
                handler.handleError(errors.NETWORK_ERROR, reduxStore.dispatch, 'realize-updateInstance task')
            }
        }, 5000);
        simpleStore.save("realize_task", [refresher])
    }

    async realizeTaskstop() {
        let tasks = await simpleStore.get("realize_task");
        if (tasks) {
            tasks.forEach((task) => {
                BackgroundTimer.clearInterval(task);
            });
        }
    }

    async mainFeedTaskStart() {
        // await this.mainFeddTaskstop();
        // const refresher = BackgroundTimer.setInterval(() => {
        //     this.setMainFeedRefresh();
        // }, 5000);
        // simpleStore.save("main_feed", [refresher])
    }

    async mainFeddTaskstop() {
        // let tasks = await simpleStore.get("main_feed");
        // if (tasks) {
        //     tasks.forEach((task) => {
        //         BackgroundTimer.clearInterval(task);
        //     });
        // }
    }

    setMainFeedRefresh() {
        if (reduxStore.getState().feeds.feedView && reduxStore.getState().feeds.feedView.length > 0) {
            // let token = reduxStore.getState().authentication.token;
            // let user = reduxStore.getState().user.user;
            // let id = reduxStore.getState().feeds.feedView[0];
            // if (token && user) {
            //     feedAction.fetchTopList(id, token, user, reduxStore.dispatch);
            // }
        }
    }
}

let tasks = new Tasks();
export default tasks;
