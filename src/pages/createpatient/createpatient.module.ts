import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePatientComponent } from './createpatient';

@NgModule({
  declarations: [
    CreatePatientComponent,
  ],
  imports: [
    IonicPageModule.forChild(CreatePatientComponent),
  ],
  exports: [
    CreatePatientComponent
  ]
})
export class CreatePatientPageModule {}
