import { Component } from '@angular/core';
import { Http, Headers} from '@angular/http';


import { App, ActionSheet, ActionSheetController, Config, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../providers/conference-data';
import { UrlData } from '../../providers/url-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { GroupPage } from '../group/group';
import { GroupContactPage } from '../group-contact/group-contact';


@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html'
})
export class GroupChatPage {
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
  groupName:string;



  constructor(private navParams: NavParams, private http:Http, private urlData:UrlData, private _app: App, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private userData:UserData, public confData: ConferenceData, public config: Config) {
    this.formID = "formID";
    this.data = "data";
    this.pageType = "page";
    this.serviceName = "GroupChatPage ======";
    this.groupName = this.navParams.get('groupName');
  }

  ionViewDidLoad() {
    
  }
}
