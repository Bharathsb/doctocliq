import { Component } from '@angular/core';
import { Platform, Config, App, AlertController } from 'ionic-angular';
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
    public app: App, private alertCtrl: AlertController, private shared: Shared) {
    this.initTranslate();
    let tokenValid = localStorage.getItem("logindate");
    let tokenTempDate = moment(new Date(tokenValid)).format("DD/MM/YYYY");
    if ((tokenValid !== null) && (tokenTempDate === moment().format("DD/MM/YYYY"))) {
      this.rootPage = TabsclinicPage;
    } else {
      localStorage.removeItem("key");
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.CALL_PHONE,
        ]
      );
      platform.registerBackButtonAction(() => {
        let view = this.shared.getCurrentPage();
        let nav = app.getActiveNavs()[0];
        let activeView = nav.getActive();
        if (view === "tab1") {
          const alerts = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: 'Close App',
              handler: () => {
                platform.exitApp(); // Close this application
              }
            }]
          });
          alerts.present();
        } else if (view == "tab2" || view == "tab3") {
          // this.app.getRootNavs()[0].setRoot(TabsclinicPage);
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
    this.translate.setDefaultLang('en');
    // this.translate.use('en');
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
    //   this.translate.use('en'); // Set your language here
    // }

    this.translate.get(['back']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.back);
    });
  }
}
