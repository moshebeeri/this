import {bootstrap} from 'angular2/platform/browser';
import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {provide} from 'angular2/core';
import {Http} from 'angular2/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth/auth';

import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {MyAccountPage} from './pages/my-account/my-account';
import {CouponsPage} from './pages/coupons/coupons';
import {WishListPage} from './pages/wish-list/wish-list';
import {FavouriteGroupsPage} from './pages/favourite-groups/favourite-groups';
import {MyOffersPage} from './pages/my-offers/my-offers';
import {MessagesPage} from './pages/messages/messages';
import {ProfilePage} from './pages/profile/profile';




@App({
  templateUrl: 'build/app.html',
  config: {
    mode: "md"
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig, http);
      },
      deps: [Http]
    }),
    AuthService
  ]
})
class MyApp {
  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>
  authenticated: boolean;

  constructor(private app: IonicApp, private platform: Platform, private auth: AuthService) {
    this.initializeApp();
    this.authenticated = auth.authenticated();
    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'My Account', component: MyAccountPage },
      { title: 'Coupons', component: CouponsPage },
      { title: 'Wish List', component: WishListPage },
      { title: 'Favourite Groups', component: FavouriteGroupsPage },
      { title: 'My offers', component: MyOffersPage },
      { title: 'Messages', component: MessagesPage },
      { title: 'Profile', component: ProfilePage},
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
