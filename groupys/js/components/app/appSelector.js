/**
 * Created by roilandshut on 07/09/2017.
 */
import { createSelector } from 'reselect'

const getAuthentication = (state) => state.authentication

export const isAuthenticated = createSelector(
    [ getAuthentication],
    (authentication) => {
        const token = authentication.token;

        //Maybe check token validation from server or re-login
        if(token){
            return true;
        }
        return false;
    }
)
