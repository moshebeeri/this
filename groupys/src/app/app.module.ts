import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SMS, Contacts } from 'ionic-native';

import { GroupysApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { CountryPage } from '../pages/country/country';
import { ContactPage } from '../pages/contact/contact';
import { GroupListPage } from '../pages/group-list/group-list';
import { GroupPage } from '../pages/group/group';
import { GroupChatPage } from '../pages/group-chat/group-chat';
import { GroupContactPage } from '../pages/group-contact/group-contact';

import { BusinessListPage } from '../pages/business-list/business-list';
import { BusinessPage } from '../pages/business/business';
import { BusinessChatPage } from '../pages/business-chat/business-chat';
import { BusinessContactPage } from '../pages/business-contact/business-contact';

import { PromotionListPage } from '../pages/promotion-list/promotion-list';
import { PromotionPage } from '../pages/promotion/promotion';
import { PromotionChatPage } from '../pages/promotion-chat/promotion-chat';
import { PromotionContactPage } from '../pages/promotion-contact/promotion-contact';



import { FormBuilderService } from '../components/form-builder/form-builder';
import { DebugPanelComponent } from '../components/form-builder/debug-panel/debug-panel.component';
import { FormButtonsComponent } from '../components/form-builder/form-buttons-component/form-buttons-component';
import { PhotoComponent } from '../components/photo/photo-component/photo-component';
import { ContactComponent } from '../components/contact-component/contact-component';
import { PhotoPage } from '../components/photo/photo';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { CountryData } from '../providers/country-data';
import { UrlData } from '../providers/url-data';
import { HeaderData } from '../providers/header-data';
import { ContactData } from '../providers/contact-data';
import { EntityData } from '../providers/entity-data/entity-data';
import { CameraData } from '../providers/camera-data';
import { DeviceData } from '../providers/device-data';


@NgModule({
  declarations: [
    GroupysApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    CountryPage,
    ContactPage,
    GroupListPage,
    GroupPage,
    GroupChatPage,
    GroupContactPage,
    BusinessListPage,
    BusinessPage,
    BusinessChatPage,
    BusinessContactPage,
    PromotionListPage,
    PromotionPage,
    PromotionChatPage,
    PromotionContactPage,
    DebugPanelComponent,
    FormButtonsComponent,
    PhotoComponent,
    PhotoPage,
    ContactComponent
  ],
  imports: [
    IonicModule.forRoot(GroupysApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    GroupysApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    CountryPage,
    ContactPage,
    GroupListPage,
    GroupPage,
    GroupChatPage,
    GroupContactPage,
    BusinessListPage,
    BusinessPage,
    BusinessChatPage,
    BusinessContactPage,
    PromotionListPage,
    PromotionPage,
    PromotionChatPage,
    PromotionContactPage,
    DebugPanelComponent,
    FormButtonsComponent,
    PhotoComponent,
    PhotoPage,
    ContactComponent
  ],
  providers: [ConferenceData, UserData, CountryData, UrlData, HeaderData, ContactData, Storage, SMS, Contacts, EntityData, CameraData, DeviceData, FormBuilderService]
})
export class AppModule { }
