/**
 * Created by roilandshut on 07/09/2017.
 */
import { createSelector } from 'reselect'

export const isAuthenticated = createSelector( state => {
    const token = state.authentication.token;

    //Maybe check token validation from server or re-login
    if(token){
        return true;
    }
    return false;

})