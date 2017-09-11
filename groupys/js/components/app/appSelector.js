/**
 * Created by roilandshut on 07/09/2017.
 */
import { createSelector } from 'reselect'
import store from 'react-native-simple-store';
const getAuthentication = (state) => state.authentication


export const isAuthenticated = createSelector(
    [ getAuthentication], async function(authentication)
   {
        let token = await store.get("token");
         if(token){
            return true;
        }

        return false;
    }
)
