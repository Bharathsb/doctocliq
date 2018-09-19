import { Component } from '@angular/core';
import { Platform, Config, App, AlertController, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from '../pages/landing/landing';
import { TranslateService } from '@ngx-translate/core';
import { Api } from '../providers/api/api';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TabsclinicPage } from '../pages/tabsclinic/tabsclinic';
import { Shared } from '../providers/shared';
import * as moment from 'moment';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LandingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public translate: TranslateService,
    public config: Config, public api: Api, public androidPermissions: AndroidPermissions,
    public app: App, private alertCtrl: AlertController, private shared: Shared, public ionicApp: IonicApp) {
    this.initTranslate();
    let tokenValid = localStorage.getItem("logindate");
    let tokenTempDate = moment(new Date(tokenValid)).format("DD/MM/YYYY");
    if ((tokenValid !== null) && (tokenTempDate === moment().format("DD/MM/YYYY"))) {
      this.rootPage = TabsclinicPage;
    } else {
      localStorage.removeItem("key");
    }

    let appPath;
    if (platform.is('ios')) {
      appPath = 'doctocliq://';
    } else if (platform.is('android')) {
      appPath = 'com.doctocliq.android';
    }
    // this.appAvailability.check(appPath)
    //   .then(
    //     (yes: boolean) => this.shared.showAlert('Doctocliq is available ' +appPath),
    //     (no: boolean) => console.log(appPath + ' is NOT available')
    //   );


    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#004D99');
      splashScreen.hide();
      androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.CALL_PHONE,
        ]
      );
      platform.registerBackButtonAction(() => {
        let view = this.shared.getCurrentPage();
        let overlayview = this.ionicApp._overlayPortal._views[0];
        let nav = app.getActiveNavs()[0];
        let activeView = nav.getActive();
        if(overlayview && overlayview.dismiss){
          overlayview.dismiss();
        }else if (view === "tab1") {
          let msg = "Do you want to close the app? ", cancelTxt = "Cancel", confirmTxt = "Close App";
          if (this.translate.currentLang === 'sp') {
            msg = "¿Quieres cerrar la aplicación? ", cancelTxt = "Cancelar", confirmTxt = "Cerrar app";
          }
          const alerts = this.alertCtrl.create({
            // title: 'App termination',
            message: msg,
            buttons: [{
              text: cancelTxt,
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: confirmTxt,
              handler: () => {
                platform.exitApp();
              }
            }]
          });
          alerts.present();
        } else if (view == "tab2" || view == "tab3") {
          nav.parent.select(0);
        } else if (view === "landingpage") {
          platform.exitApp();
        } else {
          if (nav.canGoBack()) {
            nav.pop();
          } else {
            activeView.dismiss();
          }
        }
      }, 10);
    });
  }
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    // this.translate.setDefaultLang('sp');
    // this.translate.setDefaultLang('sp');
    // this.translate.use('en');
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
    //   this.translate.use('en'); // Set your language here
    // }
    this.translate.use('sp');

    this.translate.get(['back']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.back);
    });
  }
}
