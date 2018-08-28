import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpComponent } from './help';

@NgModule({
  declarations: [
    HelpComponent,
  ],
  imports: [
    IonicPageModule.forChild(HelpComponent),
  ],
  exports: [
    HelpComponent
  ]
})
export class HelpPageModule {}
