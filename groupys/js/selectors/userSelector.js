/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateUsers = (state) => state.user

function immutableObject(obj){
    return{
        ...obj
    }
}

export const getUserFollowesr = createSelector(  [getStateUsers ],
    (users) => {


        if (users.followers.length > 0) {
            let response = users.followers.map(user => {
               let fullUser =  users.users[user._id]
                if(fullUser) {
                   let result = immutableObject(fullUser);
                   if(!_.isEmpty(result.pictures)){
                       let pictureArray = new Array()
                       Object.keys(result.pictures).forEach(key =>{
                           pictureArray.push(result.pictures[key])
                       })
                       result.pictures = pictureArray;
                   }
                   return result;
                }
                return user;
            });


            return response;
        }
        return new Array();

    })