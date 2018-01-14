const initialState = {currentScreen: 'home', currentTab: 'feed'};
import * as actions from "./reducerActions";

export default function render(state = initialState, action) {
    switch (action.type) {
        case actions.CURRENT_SCREEN:
            return {
                ...state,
                currentScreen: action.screen,
            };
        case  actions.CURRENT_TAB:
            return {
                ...state,
                currentTab: action.currentTab,
            };

        default:
            return state;
    }
};
