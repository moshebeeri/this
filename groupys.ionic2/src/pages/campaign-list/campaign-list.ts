import { Component } from '@angular/core';
import { Http, Headers} from '@angular/http';

import { App, ActionSheet, ActionSheetController, Config, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../providers/conference-data';
import { UrlData } from '../../providers/url-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { CampaignPage } from '../campaign/campaign';
import { CampaignContactPage } from '../campaign-contact/campaign-contact';
import { CampaignInfoPage } from '../campaign-info/campaign-info';
import { PromotionListPage } from '../promotion-list/promotion-list';


@Component({
  selector: 'page-campaign-list',
  templateUrl: 'campaign-list.html'
})
export class CampaignListPage {
  error: string;
  actionSheet: ActionSheet;
  speakers = [];
  formID: string;
  data: string;
  pageType: string;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  campaignList = [];
  currentUser:any;
  serviceName:string;
  businessName:string;
  businessID:string;
  modified:any;



  constructor(private navParams: NavParams, private http:Http, private urlData:UrlData, private _app: App, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private userData:UserData, public confData: ConferenceData, public config: Config) {
    this.formID = "formID";
    this.businessName = this.navParams.get('businessName');
    this.businessID = this.navParams.get('businessID');
    this.data = "data";
    this.pageType = "page";
    this.serviceName = "CampaignListPage ======";
    this.modified = "/" + (new Date).getTime();
    this.getUserPromotionList();
  }


  ionViewDidLoad() {
    this.pageType = "page";
    this.confData.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
    
  }
  createCampaign(){
    //this._app.getRootNav().setRoot(SignupPage);
    this._app.getRootNav().push(CampaignContactPage, {"businessID":this.businessID});
  }
  getUserPromotionList(){
    this.userData.getToken().then((token) => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      console.log(this.serviceName + this.contentHeader);
      console.log(this.serviceName + this.urlData.CAMPAIGN_LIST_URL + " ---------- " + this.contentHeader);
      var urlParams = this.businessID;

      this.http.get(this.urlData.CAMPAIGN_LIST_URL + urlParams, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => this.campaignList = data,
          err => this.error = err,
          () => console.log(JSON.stringify(this.campaignList))
        );

    });
  }
  goToCampaign(e, campaign) {
    console.log(this.serviceName + "campaign: " + JSON.stringify(campaign));
    this._app.getRootNav().push(CampaignInfoPage, {'campaignName': campaign.name, 'campaignID': campaign._id, 'businessID':this.businessID});
  }

  goToPromotionList(e, campaign) {
    console.log(this.serviceName + "campaign: " + JSON.stringify(campaign));
    this._app.getRootNav().push(PromotionListPage, {'campaignName': campaign.name, 'campaignID': campaign._id, 'businessID':this.businessID});
  }
}
