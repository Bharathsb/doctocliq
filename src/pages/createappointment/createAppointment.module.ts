import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAppointmentComponent } from './createAppointment';

@NgModule({
  declarations: [
    CreateAppointmentComponent,
  ],
  imports: [
    IonicPageModule.forChild(CreateAppointmentComponent),
  ],
  exports: [
    CreateAppointmentComponent
  ]
})
export class ModalAppointemntPageModule {}
