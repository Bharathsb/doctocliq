import { Component } from '@angular/core';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Shared } from '../../providers/shared';
import { TranslateService } from '@ngx-translate/core';
import { CallNumber } from '@ionic-native/call-number';
import { ModalPatientDetailPage } from '../modalPatientDetail';
@Component({
  selector: 'page-tabclinic2',
  templateUrl: 'tabclinic2.html'
})
export class Tabclinic2Page {
  lista_patients: any;
  term: string = '';
  constructor(public api: Api,
    public translateService: TranslateService,
    public shared: Shared,
    public modal: ModalController, private call: CallNumber,
  ) {
  }

  ionViewDidEnter() {
    this.getPatientList();
    this.shared.setCurrentPage("tab2");
  }

  async callNumber(phoneNumber): Promise<any> {
    try {
      await this.call.callNumber(String(phoneNumber), true);
    } catch (e) {
      this.shared.ShowToast(this.translateService.instant('Failedloading'));
      console.log(e);
    }
  }

  whatsapp(phoneNumber) {
    window.open('https://api.whatsapp.com/send?phone=51' + phoneNumber);
  }
  // tempcallNumber() {
  //   setTimeout(() => {
  //     let tel = String(this.phoneNumber);
  //     window.open(`tel:${tel}`, '_system');
  //   }, 100);
  // }

  private getPatientList() {
    this.shared.showLoading(this.translateService.instant('loading'));
    this.api.get(this.api.apiPaitentList).map(res => res.json()).subscribe(res => {
      this.lista_patients = [];
      res.patients.forEach((data) => {
        let age;
        if (data.age > 0) {
          age = data.age;
        }
        let patientObj = {
          imageProfile: (data.sex === 'F') ? '/static/patient/female.png' : '/static/patient/male.png',
          name: data.first_name + " " + data.last_name,
          id: data.id,
          age: age,
          phoneNumber: data.cel_phone
        }
        this.lista_patients.push(patientObj);
      });
      this.shared.hideLoading();
    }, err => {
      this.shared.hideLoading();
      this.shared.ShowToast(this.translateService.instant('Failedloading'))
      console.error('ERROR', err)
    });
  }

  getPatientDetail(patientId) {
    const myModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create(ModalPatientDetailPage, { patientId: patientId }, myModalOptions);
    myModal.onDidDismiss(item => {

    })
    myModal.present();
  }

  searchFn(ev: any) {
    this.term = ev.target.value;
  }
}
