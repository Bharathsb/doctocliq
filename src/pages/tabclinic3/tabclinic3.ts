import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Shared } from '../../providers/shared';
import { LandingPage } from '../../pages/landing/landing';
import { Modal, ModalController, ModalOptions, AlertController } from 'ionic-angular';
import { HelpComponent } from '../help/help';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-tabclinic3',
  templateUrl: 'tabclinic3.html'
})
export class Tabclinic3Page {
  constructor(public shared: Shared, private app: App, public modal: ModalController, private alertCtrl: AlertController,
    private storage: Storage, public translateService: TranslateService) {
  }

  logOut() {
    let msg = "Do you want to close the app? ", cancelTxt = "Cancel", confirmTxt = "Close App";
    if (this.translateService.currentLang === 'sp') {
      msg = "¿Quieres cerrar la aplicación? ", cancelTxt = "Cancelar", confirmTxt = "Cerrar app";
    }

    const alerts = this.alertCtrl.create({
      // title: '',
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
          this.storage.get('rememberme').then((val) => {
            if (val === null || val === undefined) {
              this.storage.clear();
            }
            this.shared.clearStroage();
            this.app.getRootNavs()[0].setRoot(LandingPage);
          });
        }
      }]
    });
    alerts.present();
  }


  myProfile() {
    window.open('http://doctocliq.com/clinic/9/');
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
