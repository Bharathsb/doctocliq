import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Api } from '../../providers/api/api';
import { Shared } from '../../providers/shared';
import { Patient } from './patient.model';
@IonicPage()
@Component({
  selector: 'page-modalpatientdetail',
  templateUrl: 'modalPatientDetail.html',
})
export class ModalPatientDetailPage {
  patientId;
  patientdetail: Patient;
  constructor(private view: ViewController, public navParams: NavParams, 
    public translateService: TranslateService, public api: Api, public shared: Shared) {
    this.patientId = this.navParams.get('patientId')
    this.loaddata()
  }

  closeModal() {
    this.view.dismiss();
  }
  loaddata() {
    this.shared.showLoading(this.translateService.instant('loading'));
    var seq = this.api.get(this.api.apiPaitentDetail+'?patient='+Number(this.patientId))
    seq.map(res => { return res.json(); }).subscribe(res => {
      this.shared.hideLoading();
      this.patientdetail = res.patient;
      this.patientdetail.sex = (this.patientdetail.sex === "F") ? "Woman" : "Man";
    }, err => {
      this.shared.hideLoading()
      this.shared.ShowToast(this.translateService.instant('Failedloading'));
      console.error('ERROR', err);
    });
  }


  ionViewDidEnter() {
    this.shared.setCurrentPage("ModalPatientDetailPage");
  }
  ionViewWillLeave() {
    this.shared.setCurrentPage("tab2");
  }

}
