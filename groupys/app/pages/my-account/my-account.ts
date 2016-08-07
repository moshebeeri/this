import {Platform, Page, NavController, Modal, Storage, LocalStorage, ActionSheet} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {ProfilePage} from '../profile/profile';
import {NameModal} from './modals/nameModal';
import {PictureModal} from './modals/pictureModal';
import {Camera, Transfer} from 'ionic-native';
import {DeviceService} from '../../services/device/device';
import {GlobalsService} from '../../services/globals/globals';
import {GlobalHeaders} from '../../services/headers/headers';
import {NgZone} from '@angular/core';

/*
  Generated class for the MyAccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/my-account/my-account.html',
  providers : [Camera, Transfer, DeviceService, GlobalsService, GlobalHeaders]
})
export class MyAccountPage {
  public base64Image: string;
  public base64Image2: string;
  public imageLocalStorage: string;
  public filePath: string;
  local: Storage = new Storage(LocalStorage);
  cameraDestinationType: any;
  contentHeader: Headers = new Headers();

  uploading: boolean = true;
  current: number = 1;
  total: number;
  progress: number;

  constructor(private platform: Platform, public nav: NavController, private deviceService: DeviceService, private globals: GlobalsService, private globalHeaders:GlobalHeaders, private ngZone: NgZone) {
    this.nav = nav;
    this.globals = globals;
    this.platform = platform;
    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    
    this.base64Image =  'img/avatar3.png';
    this.getBase64Image();
    this.cameraDestinationType = this.deviceService.getCameraDestinationType();
    this.local.set('filePath','');
    //alert(this.cameraDestinationType);
  }
  updatePic(){
    console.log("updatePic");
    this.nav.push(ProfilePage);
  }
  nameModal() {
    let nameModal = Modal.create(NameModal);
    this.nav.present(nameModal);
  }
  pictureModal() {
    let pictureModal = Modal.create(PictureModal);
    this.nav.present(pictureModal);
  }


  getBase64Image(){
    this.local.get('base64Image').then(base64Image => {
      //alert("IN getBase64Image");
      if(this.deviceService.getImageLocalStorage(base64Image).length>-1){
        this.base64Image = this.deviceService.getImageLocalStorage(base64Image);
        //alert('base64Image: ' + this.base64Image);
      }
      //return this.base64Image;

    }).catch(error => {
      console.log(error);
    });
  }


  getGalleryPic(){
    this.platform.ready().then(() => {
      Camera.getPicture({
        ///destinationType: Camera.DestinationType.DATA_URL,
        destinationType: this.cameraDestinationType,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        correctOrientation: true
      }).then((imageData) => {
        this.base64Image =  'img/loading.gif';
        this.local.remove('base64Image');
        this.deviceService.clearCache();

        setTimeout(() => {
          this.base64Image = this.deviceService.getImageData(imageData);
          //alert("base64Image: " + this.base64Image);
          this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
          //alert("imageLocalStorage: " + this.imageLocalStorage);
          this.upload("file://" + this.base64Image);
          this.local.set('base64Image', this.imageLocalStorage);
        }, 300);
      }, (err) => {
        console.log(err);
      });
    })
  }

  takePicture(){
    this.platform.ready().then(() => {
      Camera.getPicture({
        ///destinationType: Camera.DestinationType.DATA_URL,
        destinationType: this.cameraDestinationType,
        encodingType: Camera.EncodingType.JPEG,
        quality : 75,
        targetWidth: 700,
        targetHeight: 700,
        allowEdit: true,
        correctOrientation: true
      }).then((imageData) => {

        this.base64Image = this.deviceService.getImageData(imageData);
        //alert("base64Image: " + this.base64Image);
        this.imageLocalStorage = this.deviceService.setImageLocalStorage(imageData);
        //alert("imageLocalStorage: " + this.imageLocalStorage);
        //this.uploadImage(this.base64Image);
        this.upload(this.base64Image);

        this.local.set('base64Image', this.imageLocalStorage);
      }, (err) => {
        console.log(err);
      });
    })
  }

  done = () : void => {
    //this.nav.setRoot(Home);
  }

  success = (result: any) : void => {
    alert(JSON.stringify(result));
    if(this.current < this.total) {
      this.current++;
      this.progress = 0;
      //this.upload(this.images[this.current - 1]);
    } else {
      this.uploading = false;
    }
  }

  failed = (err: any) : void => {
    alert(JSON.stringify(err));
    let code = err.code;
    alert("Failed to upload image. Code: " + code);
  }

  onProgress =  (progressEvent: ProgressEvent) : void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        console.log(progress);
        this.progress = progress
      }
    });
  }

  upload = (image: string) : void => {
    alert(image);
    let token = this.local.get('token') || '';
    token = token.__zone_symbol__value || '';
    this.contentHeader = new Headers({"Content-Type": "application/json"});
    this.contentHeader.append('Authorization', 'Bearer ' + token);
    alert("this.contentHeader: "+ this.contentHeader);

    function resolveLocalFileErrorHandler(error) {
      console.log(error);
    }
    function resolveLocalFileSuccessHandler(fileEntry) {
      window.localStorage.setItem('filePath', fileEntry.toInternalURL());
      window.localStorage.setItem('filePath2', fileEntry.toInternalURL());
    }
    window.resolveLocalFileSystemURL(image, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);
    setTimeout(() => {
      this.local.get('filePath').then(filePath => {
        this.base64Image2 = filePath;
        let fileURL = filePath;
        alert("filePath: " + this.base64Image2);


        let ft = new Transfer();
        //alert(ft);
        let filename = fileURL.substr(fileURL.lastIndexOf('/') + 1).toString();
        alert("------------------" + filename);
        if(filename === '.Pic.jpg' || filename === undefined){
          filename = this.deviceService.unixName();
        }

        let options = new FileUploadOptions();
        options.fileKey='avatar';
        options.fileName=filename;
        options.mimeType='image/jpeg';
        options.chunkedMode=false;

        let params = new Object();
        params['fileName'] = filename;
        options.params = params;
        
        let headers = new Object();
        headers['Connection'] = 'close';
        headers['Authorization'] = this.contentHeader || '';
        options.headers = headers;
        /*
         let options = {
           fileKey: 'file',
           fileName: filename,
           mimeType: 'image/jpeg',
           chunkedMode: false,
           headers: {
           //'Content-Type' : undefined,
           //'Connection' : 'close'
           },
           params: {
            fileName: filename
           }
         };
         */
        //ft.onProgress(this.onProgress);
        let filenameURL = filename.slice(0, -4).toString();
        alert(filenameURL);
        alert(filename);
        ft.upload(fileURL, this.globals.FILE_TRANSFER_URL + filenameURL, options, false)
          .then((result: any) => {
            this.success(result);
          }).catch((error: any) => {
          this.failed(error);
        });
      });

    }, 1000);
  }
/*
  upload = (image: string) : void => {
    function resolveLocalFileErrorHandler(error) {
      console.log(error);
    }
    function resolveLocalFileSuccessHandler(fileEntry) {
      window.localStorage.setItem('filePath', fileEntry.toInternalURL());
      window.localStorage.setItem('filePath2', fileEntry.toInternalURL());
    }
    window.resolveLocalFileSystemURL(image, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);
    setTimeout(() => {
      let ft = new Transfer();
      let options = new FileUploadOptions();

      options.fileKey="file";
      options.fileName=image.substr(image.lastIndexOf('/')+1)+'.jpg';
      options.mimeType="text/plain";

      let params = new Object();
      params['apikey'] = "helloworld";
      options.params = params;

      //ft.onProgress(this.onProgress);
      ft.upload(image, this.globals.FILE_TRANSFER_URL + 'rami01', options, false)
        .then((result: any) => {
          this.success(result);
        }).catch((error: any) => {
        this.failed(error);
      });

    }, 1000);
  }
  success = (result: any) : void => {
    alert(JSON.stringify(result));
  };
  failed = (err: any) : void => {
    alert(JSON.stringify(err));
  };
*/

  uploadImage(fileEntry) {

    function resolveLocalFileErrorHandler(error) {
      console.log(error);
    }
    function resolveLocalFileSuccessHandler(fileEntry) {
      /*alert("---------------------------------");
      alert(fileEntry.name);
      alert(fileEntry.fullPath);
      alert(JSON.stringify(fileEntry));
      alert(fileEntry.toURL());
      alert(JSON.stringify(fileEntry.toURL()));
      alert(JSON.stringify(fileEntry.toInternalURL()));

      alert("---------------------------------");
      fileEntry.getMetadata(function(metadata) {
        alert("METADATA: " + metadata.size); // or do something more useful with it..
      });*/
      window.localStorage.setItem('filePath', fileEntry.toInternalURL());
      window.localStorage.setItem('filePath2', fileEntry.toInternalURL());
      //window.localStorage.setItem('filePath', fileEntry.toURL().substring(7));
    }

    window.resolveLocalFileSystemURL(fileEntry, resolveLocalFileSuccessHandler, resolveLocalFileErrorHandler);

    /*window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

     function gotFS(fileSystem) {
     alert("fileSystem.root.toURL(): " + fileSystem.root.toURL());
     alert("fileSystem.root.toInternalURL(): " + fileSystem.root.toInternalURL());
     alert("fileSystem.root.nativeURL(): " + fileSystem.root.nativeURL());
     alert("fileSystem.root.nativeURL: " + fileSystem.root.nativeURL);
     }
     function fail() {
     console.log("failed to get filesystem");
     }*/

    setTimeout(() => {
      this.local.get('filePath2').then(filePath2 => {
        this.base64Image2 = filePath2;
        alert("222222222222222222: " + this.base64Image2)
      });
      this.local.get('filePath').then(filePath => {
        alert("------------  " + filePath);


        let fileURL = filePath;

        let win = function (r) {
          alert(JSON.stringify(r));
          /*alert("Code = " + r.responseCode);
          alert("Response = " + r.response);
          alert("Sent = " + r.bytesSent);*/
        }

        let fail = function (error) {
          alert(JSON.stringify(error));
          /*alert("An error has occurred: Code = " + error.code);
          alert("upload error source " + error.source);
          alert("upload error target " + error.target);*/
        }


        alert(fileURL);
        this.platform.ready().then(() => {
          let options = new FileUploadOptions();

          options.fileKey = "file";
          options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          options.mimeType = "image/jpeg";
          options.chunkedMode = false;
          alert(options.fileName);

          options.headers = {
            'Authorization': this.contentHeader
          }
          options.params = {};


          //params.value1 = "test";
          //params.value2 = "param";


          //options.params = params;
          alert(JSON.stringify(options));
          alert(JSON.stringify(fileURL));
          let ft = new FileTransfer();
          ft.upload(fileURL, encodeURI(this.globals.FILE_TRANSFER_URL + 'rami01'), win, fail, options);
          ft.abort();
        })

      }).catch(error => {
        console.log(error);
      });
    }, 5000);

  }
  
  
  presentActionSheet() {
    let actionSheet = ActionSheet.create({
      title: 'Profile Photo',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery clicked');
            this.getGalleryPic();
          }
        },{
          text: 'Camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePicture();
          }
        },{
          text: 'Remove Photo',
          handler: () => {
            console.log('Remove Photo clicked');
            this.base64Image =  'img/avatar3.png';
            this.local.remove('base64Image');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }
}
