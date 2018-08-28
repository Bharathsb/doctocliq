import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Shared } from '../../providers/shared';
import { LandingPage } from '../../pages/landing/landing';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { HelpComponent } from '../help/help';

@Component({
  selector: 'page-tabclinic3',
  templateUrl: 'tabclinic3.html'
})
export class Tabclinic3Page {
  constructor(public shared: Shared, private app: App,public modal: ModalController) {
  }

  logOut() {
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
    this.shared.clearStroage();
    this.app.getRootNavs()[0].setRoot(LandingPage);
  }



  openHelp() {
    const myModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create(HelpComponent, myModalOptions);
    myModal.onDidDismiss(item => {

    })
    myModal.present();
  }

  ionViewDidEnter() {
    this.shared.setCurrentPage("tab3");
  }
}
