
const initialState = {
    categories: [],
    categoriesFetching:false,


};
import * as actions from './../reducerActions';

export default function categoriesForm(state = initialState, action) {

    switch (action.type) {
        case actions.CATEGORIES_SET :
            let categoriesState = {...state};
         //   categoriesState.categories.push(action.)
            return categoriesState;
        case actions.CATEGORIES_FETCHING :
            return {
                ...state,
                categoriesFetching: true,
            };
        case actions.CATEGORIES_FETCHING_DONE :
            return {
                ...state,
                categoriesFetching: false,
            };

        default:
            return state;
    }
};