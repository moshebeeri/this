import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, Storage, LocalStorage} from 'ionic-angular';
import {StatusBar, Geolocation} from 'ionic-native';

import {Http} from '@angular/http';
import {Type} from '@angular/core';
import {AuthService} from './services/auth/auth';
import {EntityManagerFactoryService} from './services/breezejs/entityManagerFactory';

import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {MyAccountPage} from './pages/my-account/my-account';
import {CouponsPage} from './pages/coupons/coupons';
import {WishListPage} from './pages/wish-list/wish-list';
import {FavouriteGroupsPage} from './pages/favourite-groups/favourite-groups';
import {MyOffersPage} from './pages/my-offers/my-offers';
import {MessagesPage} from './pages/messages/messages';
import {ProfilePage} from './pages/profile/profile';
import {LoginPage} from './pages/login/login';
import {RegisterPage} from './pages/register/register';
import {CountriesPage} from './pages/countries/countries';
import {ContactsPage} from './pages/contacts/contacts';
import {BreezePage} from './pages/breeze/breeze';
import {LazyLoadPage} from './pages/lazy-load/lazy-load';






@Component({
  templateUrl: 'build/app.html',
  config: {
    mode: "md"
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    AuthService,
	  EntityManagerFactoryService
  ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;
  authenticated: boolean;
  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  currentLatitude: number;
  currentLongitude: number;
  local: Storage = new Storage(LocalStorage);

  constructor(private menu: MenuController, private platform: Platform, private auth: AuthService, public http: Http, private entityManagerFactoryService: EntityManagerFactoryService) {
    this.initializeApp();
    
    this.auth = auth;
	  this.entityManagerFactoryService = entityManagerFactoryService;
    this.authenticated = this.auth.authenticated();

    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAuthorized = this.auth.isAuthorized('user');
    this.isAdmin = this.auth.isAdmin();
    console.log("isLoggedIn3: " +  this.isLoggedIn);
    console.log("isAuthorized3: " +  this.isAuthorized);
    console.log("isAdmin3: " +  this.isAdmin);
	
    this.local.remove('countryNameDetails');
    this.local.remove('callingCodesDetails');
    this.local.remove('callingDigitsDetails');
    this.local.remove('digitsValidator');
    this.local.remove('isSIM');
    this.local.remove('countryCode');
    this.local.set('isSIM', 'true');
	
	  this.entityManagerFactoryService.emFactory().subscribe(data => console.log(data));

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
      { title: 'Login', component: LoginPage},
      { title: 'Register', component: RegisterPage},
      { title: 'Countries', component: CountriesPage},
      { title: 'Contacts', component: ContactsPage},
      { title: 'Breeze', component: BreezePage},
	    { title: 'Lazy Load', component: LazyLoadPage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Geolocation.getCurrentPosition().then((resp) => {
          this.currentLatitude = resp.coords.latitude;
          this.currentLongitude = resp.coords.longitude;
          console.log("Latitude: ", resp.coords.latitude);
          console.log("Longitude: ", resp.coords.longitude);
      });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
