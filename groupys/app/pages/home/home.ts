import {Page} from 'ionic-angular';
import {AuthService} from '../../services/auth/auth';


@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  isLoggedIn: boolean;
  isAuthorized: boolean;
  isAdmin: boolean;
  
  constructor(private auth: AuthService) {

    this.isLoggedIn = auth.isLoggedIn();
    this.isAuthorized = auth.isAuthorized('user');
    this.isAdmin = auth.isAdmin();

    console.log("isLoggedIn: " +  this.isLoggedIn);
    console.log("isAuthorized: " +  this.isAuthorized);
    console.log("isAdmin: " +  this.isAdmin);

  }
}
