import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { ContactPage } from '../contact/contact';
import { GroupListPage } from '../group-list/group-list';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = GroupListPage;
  tab2Root: any = ContactPage;
  tab3Root: any = MapPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewCanEnter(): boolean{
    // here we can either return true or false
    // depending on if we want to leave this view
    let randomValue = true;
    if(randomValue){
      return true;
    } else {
      return false;
    }
  }

}
