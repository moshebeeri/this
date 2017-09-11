/**
 * Created by roilandshut on 07/09/2017.
 */
import { createSelector } from 'reselect'
import store from 'react-native-simple-store';
const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab


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
export const showAddAction = createSelector(
    [ getMainTab],  function(mainTab)
    {
        let index = mainTab.selectedTab;
        switch (index){
            case 0:
                return false;
            case 1:
                return false;
            case 2:
                return true;
            case 3:
                return false;
            case 4:
                return true;
            case 5:
                return true;

        }

        return false;
    }
)