import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import { UrlData } from './url-data';
import { UserData } from './user-data';


@Injectable()
export class FeedData {
  serviceName: string;
  error: string;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  groupFeed:any;
  userFeed:any;
  modified: any;
  
  constructor(private http:Http, private urlData:UrlData, private userData:UserData) {
    this.serviceName = "FeedData ======";
    this.modified = "?" + (new Date).getTime();
  }

  getGroupFeed(groupID){
    this.userData.getToken().then((token) => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      console.log(this.serviceName + this.contentHeader);
      console.log(this.serviceName + this.urlData.FEED_URL + " ---------- " + this.contentHeader);

      /**
       * :from_id - feed reference id, the last if you scroll down and the top most if you scroll up, in case of fresh start just set to 'start'
       * :scroll -  down or up
       * :entity_type - user or group
       * :entity_id - the _id of the item of which you like to show the feed
       */
      //router.get('/:from_id/:scroll/:entity_type/:entity_id', auth.isAuthenticated(), controller.feed);
      let params = '/start/down/group/' + groupID + this.modified;

      return this.http.get(this.urlData.FEED_URL + params, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => {return data},
          err => this.error = err
        );

    });
  }

  getUserFeed(){
    return this.userData.getCurrentUser().then((user) => {
      this.userData.getToken().then((token) => {
        var contentHeader = new Headers({"Content-Type": "application/json"});
        contentHeader.append('Authorization', 'Bearer ' + token);
        console.log(this.serviceName + this.contentHeader);
        console.log(this.serviceName + this.urlData.FEED_URL + " ---------- " + this.contentHeader);

        /**
         * :from_id - feed reference id, the last if you scroll down and the top most if you scroll up, in case of fresh start just set to 'start'
         * :scroll -  down or up
         * :entity_type - user or group
         * :entity_id - the _id of the item of which you like to show the feed
         */
        //router.get('/:from_id/:scroll/:entity_type/:entity_id', auth.isAuthenticated(), controller.feed);
        let params = '/start/down/user/' + user._id + this.modified;

        this.http.get(this.urlData.FEED_URL + params, { headers: this.contentHeader })
          .map(res => res.json())
          .subscribe(
            data => {return data},
            err => this.error = err
          );

      });
    });

  }  
}
