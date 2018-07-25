import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
    selector: 'page-patient',
    templateUrl: 'createpatient.html',
})
export class CreatePatientComponent implements OnInit {
    list_district: any;
    patientForm: FormGroup;
    constructor(private navParams: NavParams, private view: ViewController, public shared: Shared,
        public translateService: TranslateService, public formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.patientForm = this.formBuilder.group({
            first_name  : ['', Validators.required],
            last_name: ['', Validators.required],
            cel_phone: ['', Validators.required],
            email: ['', Validators.required],
            dni: ['', Validators.required],
            birth_date: ['', Validators.required],
            gender: ['', Validators.required],
            district: ['', Validators.required],
        });
        this.list_district = this.shared.districtlist;
    }

    private createPatient(){
        if(this.patientForm.valid){

        }else{
            this.shared.ShowToast(this.translateService.instant('All Fields Mandatory'));
        }
    }

    private closeModal() {
        this.view.dismiss();
    }

}
