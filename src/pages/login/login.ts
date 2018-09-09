import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { TabspatientPage } from '../tabspatient/tabspatient';
import { TabsdoctorPage } from '../tabsdoctor/tabsdoctor';
import { TabsclinicPage } from '../tabsclinic/tabsclinic';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Shared } from '../../providers/shared';
import { Api } from '../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
import { ModalforgotpasswordPage } from '../../pages/modalforgotpassword/modalforgotpassword';
import { AppointmentStep3Page } from '../appointment-step3/appointment-step3';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController,
    public translateService: TranslateService
    , public api: Api, public shared: Shared, formBuilder: FormBuilder, private storage: Storage) {
    this.registerForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
      rememberme: [false]
    });
  }

  validate(): boolean {
    if (this.registerForm.valid) {
      return true;
    }

    // figure out the error message
    let errorMsg = '';

    // validate each field
    let passcontrol = this.registerForm.controls['password'];
    let phonecontrol = this.registerForm.controls['phone'];


    if (!phonecontrol.valid) {
      if (phonecontrol.errors['required']) {
        errorMsg = this.translateService.instant('needphone');
      } else if (phonecontrol.errors['minlength']) {
        errorMsg = this.translateService.instant('minphone');
      }
      else if (phonecontrol.errors['maxlength']) {
        errorMsg = this.translateService.instant('maxphone');
      }
    } else if (!passcontrol.valid) {
      if (passcontrol.errors['required']) {
        errorMsg = this.translateService.instant('needpassword');
      } else if (passcontrol.errors['minlength']) {
        errorMsg = this.translateService.instant('minpassword');
      }
    }
    this.shared.showAlert(errorMsg)
    console.log(errorMsg)
    return false;
  }

  login() {
    if (this.validate()) {
      this.shared.showLoading(this.translateService.instant('loading'));
      let body = { "username": this.registerForm.value.phone, "password": this.registerForm.value.password };
      let seq = this.api.authpost(this.api.loginUrl, body, true)
      seq.map(res => res.json()).subscribe(res => {
        this.shared.hideLoading()
        if (res.patient) {
          this.shared.loggedIn(res.patient, 'login')
          if (this.navParams.get('item')) {
            var data = {
              time: this.navParams.get('time'), date: this.navParams.get('date'), districtname: this.navParams.get('districtname'),
              item: this.navParams.get('item'), reason: this.navParams.get('reason'), districtsdoctor: this.navParams.get('districtsdoctor'), schedule: this.navParams.get('schedule')
            }
            this.navCtrl.push(AppointmentStep3Page, data);
          } else this.navCtrl.push(TabspatientPage);
        } else if (res.doctor) {
          this.shared.loggedIn(res.doctor, 'login');
          this.navCtrl.push(TabsdoctorPage);
        }
        else if (res.key) {
          this.shared.loggedIn(res.key, 'login')
          this.navCtrl.setRoot(TabsclinicPage);
        } else {
          this.shared.ShowToast(this.translateService.instant('errorlogin'));
        }
        if (this.registerForm.value.rememberme) {
          this.storage.set('rememberme', true);
          this.storage.set('userdata', this.registerForm.value.phone + "~" + this.registerForm.value.password);
        } else {
          this.storage.clear();
        }

      }, err => {
        console.error('ERROR', err)
        this.shared.hideLoading();
        if (err.status === 403) {
          this.shared.ShowToast("CSRF Failed:  Forbidden Issue");
        } else if (err.status === 400) {
          this.shared.ShowToast("Please check your username or password");
        } else {
          this.shared.ShowToast(err);
        }
      });
    }
  }

  openForgotpasswordModal() {

    const myModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create(ModalforgotpasswordPage, myModalOptions);
    myModal.present();
  }

  ngOnInit() {
    this.shared.clearStroage();
    this.shared.showLoading(this.translateService.instant('loading'));
    this.api.clearSession().map(res => res).subscribe(sessionClear => {
      this.shared.hideLoading();
      this.storage.get('rememberme').then((val) => {
        if (val) {
          this.storage.get('userdata').then((data) => {
            let dataSplit = data.split("~");
            this.registerForm.patchValue({
              "phone": dataSplit[0],
              "password": dataSplit[1],
              "rememberme": true
            });
            // this.login();
          });
        }
      });
    }, err => {
      this.shared.hideLoading();
    });
  }

  ionViewCanEnter() {
    let token = localStorage.getItem("key");
    if ((token !== undefined) && (token !== null)) {
      this.navCtrl.setRoot(TabsclinicPage);
    }
  }
}
