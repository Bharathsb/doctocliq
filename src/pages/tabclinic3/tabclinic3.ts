import { Component } from '@angular/core';
import { NavController, App, ViewController } from 'ionic-angular';
import { Shared } from '../../providers/shared';
import { LandingPage } from '../../pages/landing/landing';
import { Api } from '../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'page-tabclinic3',
  templateUrl: 'tabclinic3.html'
})
export class Tabclinic3Page {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public shared: Shared,
     public app: App) {

  }

  private logOut() {
    // this.shared.showLoading(this.translateService.instant('loading'));
    //   this.api.clearSession().map(res => res).subscribe(res => {
    //     this.shared.hideLoading();
    //     this.shared.clearStroage();
    //     this.app.getRootNavs()[0].setRoot(LandingPage); 
    //   }, err => {
    //     this.shared.hideLoading();
    //     console.error('ERROR', err)
    //     this.shared.ShowToast(err);
    //   }); 
    this.shared.hideLoading();
    this.shared.clearStroage();
    this.app.getRootNavs()[0].setRoot(LandingPage);
  }
}
