import { Component } from '@angular/core';
import { Http, Headers} from '@angular/http';

import { App, ActionSheet, ActionSheetController, Config, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../providers/conference-data';
import { UrlData } from '../../providers/url-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { PromotionPage } from '../promotion/promotion';
import { PromotionContactPage } from '../promotion-contact/promotion-contact';
import { PromotionChatPage } from '../promotion-chat/promotion-chat';


@Component({
  selector: 'page-promotion-list',
  templateUrl: 'promotion-list.html'
})
export class PromotionListPage {
  error: string;
  actionSheet: ActionSheet;
  speakers = [];
  formID: string;
  data: string;
  pageType: string;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  groupList = [];
  currentUser:any;
  serviceName:string;
  campaignName:string;
  campaignID:string;
  businessID:string;



  constructor(private navParams:NavParams, private http:Http, private urlData:UrlData, private _app: App, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private userData:UserData, public confData: ConferenceData, public config: Config) {
    this.formID = "formID";
    this.data = "data";
    this.pageType = "page";
    this.serviceName = "PromotionListPage ======";
    this.campaignName = this.navParams.get('campaignName');
    this.campaignID = this.navParams.get('campaignID');
    this.businessID = this.navParams.get('businessID');
    this.getUserGroupList();
  }

  ionViewDidLoad() {
    this.pageType = "page";
    this.confData.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
    
  }
  createGroup(){
    //this._app.getRootNav().setRoot(SignupPage);
    this._app.getRootNav().push(PromotionContactPage);
  }
  getUserGroupList(){
    this.userData.getToken().then((token) => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      console.log(this.serviceName + this.contentHeader);
      console.log(this.serviceName + this.urlData.PROMOTION_LIST_URL + " ---------- " + this.contentHeader);
      var urlParams = this.businessID + "/" + this.campaignID ;

      this.http.get(this.urlData.PROMOTION_LIST_URL + urlParams, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => this.groupList = data,
          err => this.error = err,
          () => console.log(JSON.stringify(this.groupList))
        );

    });
  }
  goToGroup(e, group) {
    console.log(this.serviceName + "group: " + JSON.stringify(group));
    this._app.getRootNav().push(PromotionChatPage, {'groupName': group.name});

  }
}
