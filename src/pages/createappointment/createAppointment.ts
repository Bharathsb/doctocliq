import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Api } from '../../providers/api/api';
import { AppointmentModel } from './appointment.model';
import * as moment from 'moment';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Searchbar3Page } from '../searchbar3/searchbar3';

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'createAppointment.html',
})
export class CreateAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  lista_patients: any;
  lista_doctores: any;
  lista_especialidades: any;
  list_horario: any;
  list_duration: any;
  list_motivo: any;
  list_reasons: any;
  appointmentDetail: any;
  appointmentModel: AppointmentModel;
  title: string;
  doctorsList: any;
  errorMsg: any;
  type: string;
  lista_estados: any;
  patientName: any;
  establishments: Map<number, number>;
  establishmntID: number;
  constructor(private navParams: NavParams, private view: ViewController, public shared: Shared,
    public translateService: TranslateService, public modalCtrl: ModalController, public formBuilder: FormBuilder,
    public api: Api, private alertCtrl: AlertController) {
    this.doctorsList = this.navParams.get("doctorlist");
    this.appointmentDetail = this.navParams.get("appointmentDetails");
    this.type = this.navParams.get("type");
    this.list_motivo = [];
    this.lista_especialidades = [];
    this.list_reasons = [];
  }

  ngOnInit() {
    this.shared.setCurrentPage("createAppointment");
    this.appointmentModel = new AppointmentModel();
    this.establishments = new Map<number, number>();
    this.shared.showLoading(this.translateService.instant('loading'));
    this.api.authget(this.api.getClinicInfo).map(res => res.json()).subscribe(res => {
      this.shared.hideLoading();
      let establishmentDetails = Object.keys(res.establishments);
      for (let key of establishmentDetails) {
        this.establishments.set(Number(key), res.establishments[key]);
      }
      this.list_reasons = res.reasons;
      this.lista_especialidades = res.specialities;

      if (this.type === 'Update') {
        this.loadEstidos();
        this.title = "Appointment data";
        let patientObj = this.appointmentDetail[0].patient;
        let doctorObj = this.appointmentDetail[0].doctor;
        let appointment = this.appointmentDetail[0];
        this.appointmentModel.appointmentId = appointment.id;
        this.appointmentModel.patient = patientObj.id;
        this.appointmentModel.patientName = patientObj.first_name + " " + patientObj.last_name;
        this.appointmentModel.especialidade = doctorObj.speciality;
        this.appointmentModel.doctore = doctorObj.id;
        this.appointmentModel.doctorName = doctorObj.title + " " + doctorObj.first_name + " " + doctorObj.last_name;
        this.appointmentModel.datePicker = moment(appointment.start).format("DD/MM/YYYY");
        this.appointmentModel.horario = moment(appointment.start).format("HH:mm A");
        this.appointmentModel.duracione = appointment.duration;
        this.appointmentModel.reason_price = appointment.price;
        this.appointmentModel.comment_appointment = appointment.comment_appointment;

        if (appointment.comment_patient === "" || appointment.comment_patient === undefined || appointment.comment_patient === null) {
          appointment.comment_patient = "No Comment";
        }
        this.appointmentModel.comment_patient = appointment.comment_patient;
        this.appointmentModel.comment_doctor = appointment.comment_doctor;
        this.appointmentModel.estado = appointment.state;
        this.selectedDoctor(doctorObj.id);
        this.appointmentModel.motivo = appointment.reason.id;
      } else {
        this.getPatientList();
        this.loadHours();
        this.loadErrorMsg();
        this.loadDuration();
        this.appointmentForm = this.formBuilder.group({
          patient: ['', Validators.required],
          especialidade: [''],
          doctore: ['', Validators.required],
          datePicker: [''],
          horario: ['', Validators.required],
          duracione: ['', Validators.required],
          motivo: [''],
          reason_price: [''],
          comment_appointment: [""]
        });
        if (this.appointmentDetail && this.appointmentDetail.length > 0) {
          let doctorObj = this.doctorsList.find((data) => (data.id === this.appointmentDetail[0].doctor));
          let speciality;
          if (doctorObj) {
            this.onSelectedSpeciality(doctorObj.speciality);
            speciality = doctorObj.speciality;
            this.selectedDoctor(doctorObj.id);
          }
          this.appointmentForm.patchValue({
            'duracione': 0,
            'especialidade': speciality,
            'doctore': this.appointmentDetail[0].doctor || null,
            'datePicker': this.appointmentDetail[0].date,
            'horario': this.appointmentDetail[0].time_start
          });
        } else {
          this.appointmentForm.patchValue({
            'duracione': 0
          });
        }

        this.title = "Create Appointment";
      }

    }, err => {
      this.shared.ShowToast(this.translateService.instant('Failedloading'));
      console.error('ERROR', err);
    });
  }

  closeModal() {
    this.view.dismiss("close");
  }

  redirectToBack(redirectType: string) {
    this.view.dismiss(redirectType);
  }

  creatApointment() {
    if (this.appointmentForm.valid) {
      this.shared.showLoading(this.translateService.instant('loading'));
      let request =
        {
          'schedule_id': this.appointmentForm.value['horario'],
          'reason_id': Number(this.appointmentForm.value['motivo']) || 0,
          'doctor': this.appointmentForm.value['doctore'],
          'establishment': this.establishmntID,
          'user': this.appointmentForm.value['patient'],
          'price': Number(this.appointmentForm.value['reason_price']) || 0,
          'comment_appointment': this.appointmentForm.value['comment_appointment'],
          'duration': this.appointmentForm.value['duracione'],
          'date': moment(this.appointmentForm.value["datePicker"]).format("DD/MM/YYYY")
        }
      let req = this.convertStringtoEncodeFormat(request);
      this.api.authpost1(this.api.createAppointment, req).map(res => res.json()).subscribe(res => {
        this.shared.hideLoading();
        if (res.status == 200) {
          this.successAlertRedirect("¡Cita creada correctamente!", "create");
        } else {
          this.shared.ShowToast("Failed to create due to service error!");
        }
      }, err => {
        this.errorlog(err.json(), err);
      });
    } else {
      let errorMsgValidateKey = Object.keys(this.errorMsg);
      for (let key of errorMsgValidateKey) {
        if (this.appointmentForm.controls[key].status === 'INVALID') {
          let errorMsgKey = Object.keys(this.appointmentForm.controls[key].errors)
          this.shared.showAlert(this.errorMsg[key][errorMsgKey[0]]);
          break;
        }
      }
    }
  }


  updateApointment() {
    this.shared.showLoading(this.translateService.instant('loading'));
    let request = {
      'price': this.appointmentModel.reason_price || 0,
      'appointment_id': this.appointmentModel.appointmentId,
      'reason_id': this.appointmentModel.motivo,
      'comment_appointment': this.appointmentModel.comment_appointment,
      'comment_doctor': this.appointmentModel.comment_doctor,
      'state': this.appointmentModel.estado,
    };
    this.api.authpost(this.api.updateAppoinmetnt, request, false).map(res => res.json()).subscribe(res => {
      this.shared.hideLoading();
      if (res.status == 200) {
        this.successAlertRedirect("a cita fue actualizada correctamente", "update");
      } else {
        this.shared.ShowToast("Failed to update due to service error!");
      }
    }, err => {
      this.errorlog(err.json(), err);
    });
  }

  remove() {
    let alert = this.alertCtrl.create({
      title: 'Eliminar cita',
      message: '¿Desea realmente eliminar esta cita?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.removeAppointment();
          }
        }
      ]
    });
    alert.present();
  }

  removeAppointment() {
    this.shared.showLoading(this.translateService.instant('loading'));
    let request = { "appointment_id": this.appointmentModel.appointmentId };
    this.api.authpost(this.api.deleteAppointment, request, false).map(res => res.json()).subscribe(res => {
      this.shared.hideLoading();
      if (res.status == 200) {
        this.successAlertRedirect("Cita eliminada correctamente", "remove");
      } else {
        this.shared.ShowToast("Failed to delete due to service error!");
      }
    }, err => {
      this.errorlog(err.json(), err);
    });
  }

  private errorlog(error, seriveerror) {
    try {
      this.shared.hideLoading();
      if (error.status_code) {
        this.shared.ShowToast(error.detail);
      } else {
        this.shared.ShowToast(seriveerror);
      }
    }
    catch (e) {
      this.shared.ShowToast("Service Error!");
    }
  }

  private getPatientList() {
    this.api.get(this.api.apiPaitentList).map(res => res.json()).subscribe(res => {
      this.lista_patients = [];
      res.patients.forEach((data) => {
        let patientObj = {
          name: data.first_name + " " + data.last_name,
          id: data.user_id
        }
        this.lista_patients.push(patientObj);
      });
    }, err => {
      this.shared.ShowToast(this.translateService.instant('Failedloading'))
      console.error('ERROR', err)
    });
  }

  private loadErrorMsg() {
    this.errorMsg = {
      "patient": {
        "required": "Por favor escoja un paciente válido",
      },
      "doctore": {
        "required": "Please Select Doctor",
      },
      "horario": {
        "required": "escoger un horario para la cita por favor",
      },
      "duracione": {
        "required": "Please Select duartion",
      }
    }
  }

  private loadHours() {
    this.list_horario = ["07:00:00", "07:30:00", "08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00",
      "16:30:00", "17:00:00", "17:30:00", "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00", "21:00:00"];
  }

  private loadDuration() {
    this.list_duration = [];
    let duration = { id: 0, value: "30 min" };
    this.list_duration.push(duration);
    duration = { id: 1, value: "1 hora" };
    this.list_duration.push(duration);
    duration = { id: 2, value: "1 hora y 30 min" };
    this.list_duration.push(duration);
    duration = { id: 3, value: "2 horas" };
    this.list_duration.push(duration);
  }

  private loadEstidos() {

    this.lista_estados = [];
    let estados = { id: "1", value: "Ausente" };
    this.lista_estados.push(estados);
    estados = { id: "2", value: "Creada" };
    this.lista_estados.push(estados);
    estados = { id: "3", value: "Cancelada" };
    this.lista_estados.push(estados);
    estados = { id: "4", value: "Postergada" };
    this.lista_estados.push(estados);
    estados = { id: "5", value: "Confirmada" };
    this.lista_estados.push(estados);
    estados = { id: "6", value: "Otro" };
    this.lista_estados.push(estados);
  }

  private loadMotivo() {
    this.establishments = new Map<number, number>();
    this.api.authget(this.api.getClinicInfo).map(res => res.json()).subscribe(res => {
      let establishmentDetails = Object.keys(res.establishments);
      for (let key of establishmentDetails) {
        this.establishments.set(Number(key), res.establishments[key]);
      }
      this.list_reasons = res.reasons;
      this.lista_especialidades = res.specialities;
    }, err => {
      this.shared.ShowToast(this.translateService.instant('Failedloading'));
      console.error('ERROR', err);
    });
  }

  gotoSearch1() {
    let addModal = this.modalCtrl.create(Searchbar3Page, { 'patientList': this.lista_patients });
    addModal.onDidDismiss(item => {
      if (item && item.name) {
        this.patientName = item.name;
        this.appointmentForm.patchValue({
          'patient': item.id,
        })
      }
    })
    addModal.present();
  }

  private convertStringtoEncodeFormat(srcjson) {
    if (typeof srcjson !== "object")
      if (typeof console !== "undefined") {
        console.log("\"srcjson\" is not a JSON object");
        return null;
      }
    var u = encodeURIComponent;
    var urljson = "";
    var keys = Object.keys(srcjson);
    for (var i = 0; i < keys.length; i++) {
      urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
      if (i < (keys.length - 1)) urljson += "&";
    }
    return urljson;
  }


  onSelectedSpeciality(selectedValue: any) {
    this.lista_doctores = [];
    this.list_motivo = [];
    let filterDoctors = [];
    this.appointmentForm.controls['doctore'].setValue(undefined);
    this.appointmentForm.controls['motivo'].setValue(undefined);
    this.appointmentForm.controls['reason_price'].setValue(undefined);

    // this.appointmentForm.patchValue({
    //   'doctore': undefined,
    //   'motivo': undefined,
    //   'reason_price': undefined
    // });
    filterDoctors = this.doctorsList.filter((data) => (data.speciality === selectedValue));
    this.lista_doctores = filterDoctors;
    if (filterDoctors.length === 1) {
      this.appointmentForm.patchValue({
        'doctore': filterDoctors[0].id
      });
      this.selectedDoctor(filterDoctors[0].id);
    }
  }
  selectedDoctor(value) {
    if (this.appointmentForm){
      this.appointmentForm.controls['motivo'].setValue(undefined);
      this.appointmentForm.controls['reason_price'].setValue(undefined);
    }      
    this.establishmntID = this.establishments.get(value);
    this.list_motivo = this.list_reasons.filter(data => (data.establishment === this.establishmntID));
  }
  selectedReason(value) {
    let reason = this.list_reasons.find(data => (data.id === value));
    if (reason === undefined || reason === null)
      reason['price'] = 0;
    if (this.appointmentForm) {
      this.appointmentForm.patchValue({
        'reason_price': Number(reason.price) || 0
      });
    }
    else {
      this.appointmentModel.reason_price = Number(reason.price) || 0;
    }
  }

  successAlertRedirect(subTitle: string, redirectKey: string) {
    let alert = this.alertCtrl.create({
      title: 'Success', subTitle: subTitle,
      buttons: [
        {
          text: 'ok',
          handler: () => {
            this.redirectToBack(redirectKey);
          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillLeave() {
    this.shared.setCurrentPage("tab1");
  }
}
