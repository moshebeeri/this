import { Component } from '@angular/core';
import { Http, Headers} from '@angular/http';


import { App, ActionSheet, ActionSheetController, Config, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../providers/conference-data';
import { UrlData } from '../../providers/url-data';
import { UserData } from '../../providers/user-data';
import { FeedData } from '../../providers/feed-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { GroupPage } from '../group/group';
import { GroupContactPage } from '../group-contact/group-contact';


@Component({
  selector: 'page-campaign-info',
  templateUrl: 'campaign-info.html'
})
export class CampaignInfoPage {
  error: string;
  actionSheet: ActionSheet;
  formID: string;
  data: string;
  pageType: string;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  groupFeed:any;
  userFeed:any;
  groupList = [];
  currentUser:any;
  serviceName:string;
  campaignName:string;
  campaignID:string;
  modified: any;



  constructor(private feedData: FeedData, private navParams: NavParams, private http:Http, private urlData:UrlData, private _app: App, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private userData:UserData, public confData: ConferenceData, public config: Config) {
    this.formID = "formID";
    this.data = "data";
    this.pageType = "page";
    this.modified = "?" + (new Date).getTime();
    this.serviceName = "CampaignInfoPage ======";
    this.campaignName = this.navParams.get('campaignName');
    this.campaignID = this.navParams.get('campaignID');
    this.getGroupFeed();
    this.getUserFeed();
  }

  ionViewDidLoad() {
    
  }

  getGroupFeed(){
    alert("getBusinessFeed");
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
      let params = '/start/down/group/' + this.campaignID + this.modified;
      alert(this.urlData.FEED_URL + params);

      this.http.get(this.urlData.FEED_URL + params, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => this.groupFeed = data,
          err => this.error = err,
          () => alert("GROUP FEED: " + JSON.stringify(this.groupFeed))
        );

    });
  }

  getUserFeed(){
    alert("getBusinessFeed");
    this.userData.getCurrentUser().then((user) => {
      alert("USER: " + user._id);

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
        alert(this.urlData.FEED_URL + params);

        this.http.get(this.urlData.FEED_URL + params, { headers: this.contentHeader })
          .map(res => res.json())
          .subscribe(
            data => this.userFeed = data,
            err => this.error = err,
            () => alert("USER FEED: " + JSON.stringify(this.userFeed))
          );

      });
    });
    
  }
}
