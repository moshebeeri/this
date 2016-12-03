import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { MyAccountPage } from '../pages/my-account/my-account';
import { NameModal } from '../pages/my-account/modals/nameModal';
import { PictureModal } from '../pages/my-account/modals/pictureModal';
import { PhotoPage } from '../pages/photo/photo';
import { PhotoComponent } from '../pages/photo/photo-component/photo-component';
import {RegisterPage} from '../pages/register/register';
import {CountriesPage} from '../pages/countries/countries';
import {ProfilePage} from '../pages/profile/profile';
import {HomePage} from '../pages/home/home';


import {DeviceService} from '../services/device/device';
import {MyCameraService} from '../services/my-camera/my-camera';
import {GlobalsService} from '../services/globals/globals';
import {GlobalHeaders} from '../services/headers/headers';
import {PhotoService} from '../pages/photo/photo-service';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    MyAccountPage,
    NameModal,
    PictureModal,
    PhotoPage,
    PhotoComponent,
    RegisterPage,
    CountriesPage,
    ProfilePage,
    HomePage


  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    MyAccountPage,
    NameModal,
    PictureModal,
    PhotoPage,
    PhotoComponent,
    RegisterPage,
    CountriesPage,
    ProfilePage,
    HomePage
  ],
  providers: [
    Storage
    /*DeviceService,
    MyCameraService,
    GlobalsService,
    GlobalHeaders,
    PhotoService*/
  ]
})
export class AppModule {}
