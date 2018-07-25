import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Api } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'createAppointment.html',
})
export class CreateAppointmentComponent {
  appointmentForm: FormGroup;
  lista_patients: any;
  lista_doctores: any;
  lista_especialidades: any;
  list_horario: any;
  list_duration: any;
  list_motivo: any;


  constructor(private navParams: NavParams, private view: ViewController, public shared: Shared,
    public translateService: TranslateService, public modalCtrl: ModalController, public formBuilder: FormBuilder,
    public api: Api) {
    this.lista_doctores = this.navParams.get("doctorlist");
    this.getPatientList();
    this.getSpecialityList();
    this.appointmentForm = formBuilder.group({
      patient: ['', Validators.required],
      especialidade: ['', Validators.required],
      doctore: ['', Validators.required],
      datePicker: ['', Validators.required],
      horario: ['', Validators.required],
      duracione: ['', Validators.required],
      motivo: ['', Validators.required],
      reason_price: ['', Validators.required],
      comment_appointment: [""]
    });
  }

  private getPatientList() {
    this.api.get("clinics/get_patients/").map(res => res.json()).subscribe(res => {
      this.lista_patients = [];
      res.patients.forEach((data) => {
        let patientObj = {
          name: data.first_name + " " + data.last_name,
          id: data.id
        }
        this.lista_patients.push(patientObj);
      });
    }, err => {
      this.shared.ShowToast(this.translateService.instant('Failedloading'))
      console.error('ERROR', err)
    });
  }

  private getSpecialityList() {
    this.lista_especialidades = [];
    this.lista_especialidades = this.shared.specialitylist;
  }

  closeModal() {
    this.view.dismiss();
  }

  creatApointment() {
    if (this.appointmentForm.valid) {
      console.log(this.appointmentForm.value)
    } else {
      console.log(this.appointmentForm.value)
      this.shared.ShowToast(this.translateService.instant('All Fields Mandatory'));
    }
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ModalfiltersPage');
  // }
  // closeModal() {
  //   if (this.district == '') {
  //     this.shared.ShowToast(this.translateService.instant('needdistrict'))
  //   } else if (this.speciality == '') {
  //     this.shared.ShowToast(this.translateService.instant('needspeciality'))
  //   } else {
  //     this.view.dismiss({ speciality: this.speciality, district: this.districtselect.id });
  //   }

  // }
  // gotoSearch1() {
  //   let addModal = this.modalCtrl.create(Searchbar1Page);
  //   addModal.onDidDismiss(item => {
  //     this.specialityselect = item

  //     if (item && item.name) this.speciality = item.name
  //   })
  //   addModal.present();
  // }
  // gotoSearch2() {
  //   let addModal = this.modalCtrl.create(Searchbar2Page);
  //   addModal.onDidDismiss(item => {
  //     this.districtselect = item
  //     if (item && item.name) this.district = item.name
  //     console.log(item)

  //   })
  //   addModal.present();
  // }


}
