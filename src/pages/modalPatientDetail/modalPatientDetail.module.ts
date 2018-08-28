import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPatientDetailPage } from './modalPatientDetail';

@NgModule({
  declarations: [
    ModalPatientDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPatientDetailPage),
  ],
  exports: [
    ModalPatientDetailPage
  ]
})
export class ModalPatientDetailPageModule {}
