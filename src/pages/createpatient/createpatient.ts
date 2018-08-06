import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavController,App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Api } from '../../providers/api/api';
import { TabsclinicPage } from '../tabsclinic/tabsclinic';
import { LandingPage } from '../landing/landing';

@IonicPage()
@Component({
    selector: 'page-patient',
    templateUrl: 'createpatient.html',
})
export class CreatePatientComponent implements OnInit {
    list_district: any;
    gender: string;
    district: string;
    patientForm: FormGroup;
    patientError: any
    constructor(private nav: NavController, private view: ViewController, public shared: Shared,
        public translateService: TranslateService, public formBuilder: FormBuilder, public api: Api,private app: App) {
    }

    ngOnInit() {
        this.gender = 'm';
        this.patientError = {
            "first_name": {
                "required": "Please Enter Name",
            }, 
            "last_name": {
                "required": "Please Enter Surnames",
            },
            "cel_phone": {
                "required": "Please Enter Phone no",
                "minlength": "Min length",
                "maxlength": "Max length",
            }
        }
        this.patientForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            cel_phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
            email: [''],
            dni: [''],
            birth_date: [''],
            gender: [''],
            district: [''],
        });

        this.list_district = this.shared.districtlist;
    }

    private createPatient() {
        if (this.patientForm.valid) {
            let requestValue = {
                'first_name': this.patientForm.value['first_name'],
                'last_name': this.patientForm.value['last_name'],
                'email': this.patientForm.value['email'] || null,
                'district': this.district || null,
                'cel_phone': this.patientForm.value['cel_phone'],
                'birth_date': this.patientForm.value['birth_date'] || null,
                'sex': this.gender,
                'dni': this.patientForm.value['dni'] || null,
            }
            this.api.authpost(this.api.createPatient, requestValue, false).map(res => res.json()).subscribe(res => {
                if (res) {
                    this.shared.showAlert('Nuevo paciente registrado correctamente');
                    this.closeModal();
                }
            }, err => {
                if (err.status_code === '406') {
                    this.shared.ShowToast("Usuario Paciente ya existe con ese numero de telefono");
                } else {
                    console.error('ERROR', err)
                    this.shared.ShowToast(err);
                }
            }); 
        } else {
            let patientErrorValidateKey = Object.keys(this.patientError);
            for (let key of patientErrorValidateKey) {
                if (this.patientForm.controls[key].status === 'INVALID') {
                    let errorMsgKey =  Object.keys(this.patientForm.controls[key].errors)
                    this.shared.showAlert(this.patientError[key][errorMsgKey[0]]);
                    break;
                }
            }
        }
    }

    private closeModal() { 
        this.view.dismiss();
    }
}
